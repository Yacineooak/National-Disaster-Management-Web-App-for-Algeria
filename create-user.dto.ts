import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';

export enum UserRole {
  CITIZEN = 'citizen',
  GOVERNMENT = 'government',
  NGO = 'ngo',
  ADMIN = 'admin',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'ahmed.benali@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Nom d\'utilisateur unique',
    example: 'ahmed_benali',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores',
  })
  username: string;

  @ApiProperty({
    description: 'Mot de passe (minimum 8 caractères)',
    example: 'MotDePasse123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @ApiProperty({
    description: 'Prénom de l\'utilisateur',
    example: 'Ahmed',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'Nom de famille de l\'utilisateur',
    example: 'Benali',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur',
    enum: UserRole,
    example: UserRole.CITIZEN,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.CITIZEN;

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
}

