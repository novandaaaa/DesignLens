import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebsiteDto } from './dto';
import { ScreenshotsService } from '../screenshots/screenshots.service';

@Injectable()
export class WebsitesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly screenshotsService: ScreenshotsService,
  ) {}

  async create(
    userId: string,
    dto: CreateWebsiteDto,
    files?: Express.Multer.File[],
  ) {
    const website = await this.prisma.website.create({
      data: {
        userId,
        categoryId: dto.categoryId,
        title: dto.title,
        url: dto.url ?? '',
        description: dto.description,
        targetAudience: dto.targetAudience,
        feedbackFocus: dto.feedbackFocus,
      },
      include: {
        category: true,
        screenshots: true,
      },
    });

    if (files && files.length > 0) {
      // User uploaded manual screenshots
      for (const file of files) {
        try {
          const filePath = await this.screenshotsService.saveUploadedFile(
            file,
            website.id,
          );
          await this.prisma.screenshot.create({
            data: {
              websiteId: website.id,
              fileUrl: filePath,
              type: 'manual',
            },
          });
        } catch (error) {
          console.error('Failed to save manual screenshot:', error);
        }
      }
    } else if (dto.url) {
      // Trigger auto screenshot di background only if URL is provided and no manual files
      this.takeInitialScreenshot(website.id, dto.url).catch(console.error);
    }

    return website;
  }

  private async takeInitialScreenshot(websiteId: string, url: string) {
    try {
      const screenshotPath = await this.screenshotsService.captureScreenshot(
        url,
        websiteId,
      );

      await this.prisma.screenshot.create({
        data: {
          websiteId,
          fileUrl: screenshotPath,
        },
      });
    } catch (error) {
      console.error(`Gagal mengambil screenshot otomatis untuk ${url}:`, error);
    }
  }

  async findAllByUser(userId: string) {
    return this.prisma.website.findMany({
      where: { userId },
      include: {
        category: true,
        screenshots: true,
        aiReview: {
          select: {
            id: true,
            status: true,
            overallScore: true,
            createdAt: true,
          },
        },
        communityPost: {
          select: {
            id: true,
            status: true,
            publishedAt: true,
            _count: {
              select: { comments: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const website = await this.prisma.website.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        screenshots: true,
        aiReview: true,
        communityPost: {
          include: {
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });

    if (!website) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    // AI review hanya bisa dilihat oleh owner
    if (website.aiReview && website.userId !== userId) {
      website.aiReview = null;
    }

    return website;
  }

  async delete(id: string, userId: string) {
    const website = await this.prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      throw new NotFoundException('Website tidak ditemukan');
    }

    if (website.userId !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses');
    }

    await this.prisma.website.delete({ where: { id } });

    return { message: 'Website berhasil dihapus' };
  }
}
