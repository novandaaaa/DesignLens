import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { WebsitesModule } from './websites/websites.module';
import { AiReviewModule } from './ai-review/ai-review.module';
import { CommunityModule } from './community/community.module';
import { ScreenshotsModule } from './screenshots/screenshots.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const screenshotDir =
          configService.get<string>('SCREENSHOT_DIR') || './screenshots';
        return [
          {
            rootPath: join(process.cwd(), screenshotDir),
            serveRoot: '/screenshots',
          },
        ];
      },
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    WebsitesModule,
    AiReviewModule,
    CommunityModule,
    ScreenshotsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
