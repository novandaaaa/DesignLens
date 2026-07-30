import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }

  @Get(':id/activity')
  getUserActivity(
    @Param('id') id: string,
    @Query('type') type: 'comments' | 'websites',
  ) {
    return this.usersService.getUserActivity(id, type);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @UseInterceptors(FileInterceptor('avatar'))
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateProfile(userId, dto, file);
  }
}
