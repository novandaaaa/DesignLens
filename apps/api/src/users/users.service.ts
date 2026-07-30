import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly avatarDir: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const screenshotDir =
      this.configService.get<string>('SCREENSHOT_DIR') || './screenshots';
    this.avatarDir = path.resolve(process.cwd(), screenshotDir, 'avatars');
    if (!fs.existsSync(this.avatarDir)) {
      fs.mkdirSync(this.avatarDir, { recursive: true });
    }
  }

  async searchUsers(query: string) {
    if (!query || query.length < 2) {
      return [];
    }

    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { startsWith: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
      },
    });
  }

  async getUserProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        specializations: true,
        reputationScore: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
            websites: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserActivity(
    id: string,
    type: 'comments' | 'websites' = 'comments',
  ) {
    if (type === 'websites') {
      return this.prisma.website.findMany({
        where: { userId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
    }

    return this.prisma.comment.findMany({
      where: { userId: id },
      include: {
        post: {
          include: {
            website: {
              select: { title: true, id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: { name?: string; bio?: string; avatar?: string } = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.bio !== undefined) updateData.bio = dto.bio;

    if (file) {
      const fileName = `avatar-${userId}-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(this.avatarDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      updateData.avatar = `/screenshots/avatars/${fileName}`;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        specializations: true,
        reputationScore: true,
        role: true,
      },
    });
  }
}
