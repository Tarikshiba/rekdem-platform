// backend/src/user/dto/update-user.dto.ts

import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  company_name?: string;

  @IsString()
  @IsOptional()
  profile_bio?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsUrl()
  @IsOptional()
  profile_picture_url?: string;

  @IsUrl()
  @IsOptional()
  cover_picture_url?: string;
  
  @IsString()
  @IsOptional()
  whatsapp_number?: string;
  
  @IsUrl()
  @IsOptional()
  facebook_url?: string;

  @IsUrl()
  @IsOptional()
  instagram_url?: string;

  @IsUrl()
  @IsOptional()
  youtube_url?: string;

  @IsUrl()
  @IsOptional()
  tiktok_url?: string;

  @IsUrl()
  @IsOptional()
  telegram_url?: string;
}