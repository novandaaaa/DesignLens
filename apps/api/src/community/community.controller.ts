import {
  Controller, Get, Post, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  // ===== Posts =====

  @UseGuards(JwtAuthGuard)
  @Post('publish/:websiteId')
  publishPost(
    @Param('websiteId') websiteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.communityService.publishPost(websiteId, userId);
  }

  @Public()
  @Get('feed')
  getFeed(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getFeed(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Public()
  @Get('posts/:id')
  getPost(@Param('id') id: string) {
    return this.communityService.getPost(id);
  }

  // ===== Comments =====

  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  addComment(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.addComment(postId, userId, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/reply')
  replyComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.replyComment(commentId, userId, dto.content);
  }

  // ===== Likes =====

  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/like')
  toggleLike(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.communityService.toggleLike(commentId, userId);
  }
}
