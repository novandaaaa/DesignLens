import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      throw new BadRequestException('Website sudah dipublikasikan ke komunitas');
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

  async getPost(postId: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        website: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            category: true,
            screenshots: true,
          },
        },
        comments: {
          where: { parentCommentId: null },
          include: {
            user: { select: { id: true, name: true, avatar: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, avatar: true } },
                _count: { select: { likes: true } },
              },
              orderBy: { createdAt: 'asc' },
            },
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { comments: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post tidak ditemukan');
    }

    return post;
  }

  // ===== Comments =====

  async addComment(postId: string, userId: string, content: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post tidak ditemukan');
    }

    return this.prisma.comment.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async replyComment(commentId: string, userId: string, content: string) {
    const parentComment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!parentComment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    return this.prisma.comment.create({
      data: {
        postId: parentComment.postId,
        userId,
        parentCommentId: commentId,
        content,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  // ===== Likes =====

  async toggleLike(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Komentar tidak ditemukan');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false, message: 'Like dihapus' };
    }

    await this.prisma.like.create({
      data: { userId, commentId },
    });

    return { liked: true, message: 'Like ditambahkan' };
  }
}
