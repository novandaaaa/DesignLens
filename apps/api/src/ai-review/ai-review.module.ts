import { Module } from '@nestjs/common';
import { AiReviewController } from './ai-review.controller';
import { AiReviewService } from './ai-review.service';
import { ScreenshotsModule } from '../screenshots/screenshots.module';

@Module({
  imports: [ScreenshotsModule],
  controllers: [AiReviewController],
  providers: [AiReviewService],
  exports: [AiReviewService],
})
export class AiReviewModule {}
