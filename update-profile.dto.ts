import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  Matches,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Ahmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Benali',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({
    description: 'Numéro de téléphone',
    example: '+213555123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Le numéro de téléphone doit être au format international (+213...)',
  })
  phone?: string;

  @ApiProperty({
    description: 'Ville de résidence',
    example: 'Alger',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({
    description: 'Wilaya de résidence',
    example: 'Alger',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({
    description: 'Adresse complète',
    example: 'Rue Didouche Mourad, Alger Centre',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiProperty({
    description: 'URL de l\'avatar',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Langue préférée',
    example: 'fr',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['fr', 'ar', 'en'])
  language?: string;

  @ApiProperty({
    description: 'Préférences de notifications par email',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({
    description: 'Préférences de notifications push',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiProperty({
    description: 'Préférences de notifications SMS',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  smsNotifications?: boolean;

  @ApiProperty({
    description: 'Alertes d\'urgence',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  emergencyAlerts?: boolean;

  @ApiProperty({
    description: 'Partager la localisation',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  shareLocation?: boolean;

  @ApiProperty({
    description: 'Profil public',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  publicProfile?: boolean;

  @ApiProperty({
    description: 'Afficher sur le classement',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  showOnLeaderboard?: boolean;
}

