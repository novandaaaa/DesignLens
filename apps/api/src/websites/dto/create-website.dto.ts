import { IsString, IsUrl, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsUrl()
  url: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  targetAudience?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  feedbackFocus?: string;
}
