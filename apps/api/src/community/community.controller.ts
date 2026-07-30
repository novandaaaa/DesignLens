import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReactionType } from '@prisma/client';

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
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getFeed(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.communityService.getFeed(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get('posts/:id')
  getPost(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.communityService.getPost(id, userId);
  }

  // ===== Comments =====

  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  addComment(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.addComment(postId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/reply')
  replyComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.replyComment(commentId, userId, dto);
  }

  // ===== Reactions =====

  @UseGuards(JwtAuthGuard)
  @Post('comments/:commentId/react')
  reactToComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string,
    @Body('type') type: ReactionType,
  ) {
    return this.communityService.reactToComment(commentId, userId, type);
  }
}
