import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content: string;

  @IsOptional()
  @IsNumber()
  xPct?: number;

  @IsOptional()
  @IsNumber()
  yPct?: number;

  @IsOptional()
  @IsUUID()
  screenshotId?: string;
}
