import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export enum IncidentCategory {
  EARTHQUAKE = 'earthquake',
  FLOOD = 'flood',
  FIRE = 'fire',
  STORM = 'storm',
  LANDSLIDE = 'landslide',
  ACCIDENT = 'accident',
  INFRASTRUCTURE = 'infrastructure',
  HEALTH = 'health',
  SECURITY = 'security',
  OTHER = 'other',
}

export enum IncidentSeverity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  EMERGENCY = 5,
}

export class CreateIncidentDto {
  @ApiProperty({
    description: 'Titre de l\'incident',
    example: 'Inondation dans le centre-ville',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description détaillée de l\'incident',
    example: 'Inondation importante causée par les fortes pluies, plusieurs rues sont impraticables',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Catégorie de l\'incident',
    enum: IncidentCategory,
    example: IncidentCategory.FLOOD,
  })
  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @ApiProperty({
    description: 'Niveau de gravité de l\'incident (1-5)',
    minimum: 1,
    maximum: 5,
    example: 3,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  severity: IncidentSeverity;

  @ApiProperty({
    description: 'Latitude de l\'incident',
    example: 36.7538,
  })
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Longitude de l\'incident',
    example: 3.0588,
  })
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Adresse textuelle de l\'incident',
    example: 'Rue Didouche Mourad, Alger Centre, Alger',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Tags associés à l\'incident',
    example: ['urgence', 'route-bloquée', 'évacuation'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Nombre estimé de personnes affectées',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedAffectedPeople?: number;
}

