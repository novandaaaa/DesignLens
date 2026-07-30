import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReactionType } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async publishPost(websiteId: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id: websiteId },
      include: { communityPost: true },
    });

    if (!website) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses');
    }

    if (website.communityPost?.status === 'PUBLISHED') {
      throw new BadRequestException(
        'Website sudah dipublikasikan ke komunitas',
      );
    }

    const post = await this.prisma.communityPost.upsert({
      where: { websiteId },
      create: {
        websiteId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      update: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: {
        website: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            category: true,
            screenshots: true,
          },
        },
      },
    });

    return post;
  }

  async getFeed(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          website: {
            include: {
              user: { select: { id: true, name: true, avatar: true } },
              category: true,
              screenshots: { take: 1 },
            },
          },
          _count: { select: { comments: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.communityPost.count({ where: { status: 'PUBLISHED' } }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPost(postId: string, userId?: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        website: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            category: true,
            screenshots: true,
            aiReview: true,
          },
        },
        comments: {
          where: { parentCommentId: null },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                specializations: true,
              },
            },
            mentions: {
              include: { user: { select: { id: true, name: true } } },
            },
            reactions: true,
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                    specializations: true,
                  },
                },
                reactions: true,
                mentions: {
                  include: { user: { select: { id: true, name: true } } },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post tidak ditemukan');
    }

    // Apply blind voting logic
    post.comments = post.comments.map((comment) =>
      this.applyBlindVoting(comment, userId),
    ) as any;

    return post;
  }

  private applyBlindVoting(comment: any, currentUserId?: string) {
    const userHasReacted =
      currentUserId &&
      comment.reactions.some((r: any) => r.userId === currentUserId);
    const isOwner = currentUserId && comment.userId === currentUserId;

    // Group reactions
    const reactionCounts = {
      AGREE: 0,
      NEEDS_REVIEW: 0,
      DISAGREE: 0,
    };

    comment.reactions.forEach((r: any) => {
      (reactionCounts as any)[r.type]++;
    });

    if (!userHasReacted && !isOwner) {
      // Hide counts if user hasn't participated and is not owner
      comment['reactionCounts'] = null;
    } else {
      comment['reactionCounts'] = reactionCounts;
    }

    // Only return user's own reaction (or none)
    comment['userReaction'] = currentUserId
      ? comment.reactions.find((r: any) => r.userId === currentUserId) || null
      : null;

    // Do the same for replies
    if (comment.replies) {
      comment.replies = comment.replies.map((reply: any) =>
        this.applyBlindVoting(reply, currentUserId),
      );
    }

    delete comment.reactions; // Hide full list
    return comment;
  }

  async updatePost(postId: string, userId: string, data: { title?: string; description?: string; targetAudience?: string }) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: { website: true },
    });

    if (!post) throw new NotFoundException('Postingan tidak ditemukan');
    if (post.website.userId !== userId) throw new ForbiddenException('Anda tidak memiliki akses');

    await this.prisma.website.update({
      where: { id: post.websiteId },
      data: {
        title: data.title,
        description: data.description,
        targetAudience: data.targetAudience,
      },
    });

    return this.getPost(postId, userId);
  }

  async unpublishPost(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: { website: true },
    });

    if (!post) throw new NotFoundException('Postingan tidak ditemukan');
    if (post.website.userId !== userId) throw new ForbiddenException('Anda tidak memiliki akses');

    const updated = await this.prisma.communityPost.update({
      where: { id: postId },
      data: { status: 'DRAFT' },
    });

    return updated;
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: { website: true },
    });

    if (!post) throw new NotFoundException('Postingan tidak ditemukan');
    if (post.website.userId !== userId) throw new ForbiddenException('Anda tidak memiliki akses');

    // Only delete the community post, keep the website
    await this.prisma.communityPost.delete({
      where: { id: postId },
    });

    return { success: true };
  }

  // ===== Mentions Helper =====
  private extractMentions(content: string) {
    // Regex matches @[Name](userId)
    const mentionRegex = /@\[.*?\]\((.*?)\)/g;
    const userIds = new Set<string>();
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      userIds.add(match[1]);
    }

    return Array.from(userIds);
  }

  private async notifyMentions(
    commentId: string,
    authorId: string,
    mentionedUserIds: string[],
  ) {
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    for (const userId of mentionedUserIds) {
      if (userId !== authorId) {
        // Create Mention Record
        await this.prisma.commentMention
          .create({
            data: { commentId, userId },
          })
          .catch(() => {}); // Ignore duplicates

        // Create Notification
        await this.prisma.notification.create({
          data: {
            userId,
            type: 'MENTION',
            title: 'Seseorang menyebut Anda',
            message: `${author?.name || 'Seseorang'} menyebut Anda dalam komentar.`,
            link: `/community/comments/${commentId}`,
          },
        });
      }
    }
  }

  // ===== Comments =====

  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post tidak ditemukan');
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId,
        userId,
        content: dto.content,
        xPct: dto.xPct,
        yPct: dto.yPct,
        screenshotId: dto.screenshotId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Handle mentions
    const mentionedIds = this.extractMentions(dto.content);
    if (mentionedIds.length > 0) {
      await this.notifyMentions(comment.id, userId, mentionedIds);
    }

    return comment;
  }

  async replyComment(commentId: string, userId: string, dto: CreateCommentDto) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    const comment = await this.prisma.comment.create({
      data: {
        postId: parentComment.postId,
        userId,
        parentCommentId: commentId,
        content: dto.content,
        xPct: dto.xPct,
        yPct: dto.yPct,
        screenshotId: dto.screenshotId,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Handle mentions
    const mentionedIds = this.extractMentions(dto.content);
    if (mentionedIds.length > 0) {
      await this.notifyMentions(comment.id, userId, mentionedIds);
    }

    return comment;
  }

  // ===== Reactions =====

  async reactToComment(commentId: string, userId: string, type: ReactionType) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    const existingReaction = await this.prisma.reaction.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Toggle off
        await this.prisma.reaction.delete({
          where: { id: existingReaction.id },
        });

        // Remove reputation
        await this.adjustReputation(comment.userId, type, -1);

        return { reacted: false, type: null, message: 'Reaction dihapus' };
      } else {
        // Change reaction
        await this.prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });

        // Adjust reputation (-old, +new)
        await this.adjustReputation(comment.userId, existingReaction.type, -1);
        await this.adjustReputation(comment.userId, type, 1);

        return { reacted: true, type, message: 'Reaction diubah' };
      }
    }

    // New reaction
    await this.prisma.reaction.create({
      data: { userId, commentId, type },
    });

    // Add reputation
    await this.adjustReputation(comment.userId, type, 1);

    return { reacted: true, type, message: 'Reaction ditambahkan' };
  }

  private async adjustReputation(
    userId: string,
    type: ReactionType,
    multiplier: number,
  ) {
    let scoreChange = 0;
    if (type === 'AGREE') scoreChange = 5;
    else if (type === 'DISAGREE') scoreChange = -1;
    else if (type === 'NEEDS_REVIEW') scoreChange = 1;

    if (scoreChange !== 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          reputationScore: { increment: scoreChange * multiplier },
        },
      });
    }
  }
}
