import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { AiReviewService } from './ai-review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reviews/ai')
export class AiReviewController {
  constructor(private readonly aiReviewService: AiReviewService) {}

  @Post(':websiteId')
  create(
    @Param('websiteId') websiteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiReviewService.createReview(websiteId, userId);
  }

  @Get(':websiteId')
  getReview(
    @Param('websiteId') websiteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiReviewService.getReview(websiteId, userId);
  }

  @Get('reset-stuck')
  resetStuck() {
    return this.aiReviewService.resetStuck();
  }
}
