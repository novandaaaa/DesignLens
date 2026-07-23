import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { WebsitesService } from './websites.service';
import { CreateWebsiteDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWebsiteDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.websitesService.create(userId, dto, files);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.websitesService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.websitesService.findOne(id, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.websitesService.delete(id, userId);
  }
}
