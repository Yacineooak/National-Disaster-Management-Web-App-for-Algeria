import { PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum IncidentStatus {
  REPORTED = 'reported',
  VERIFIED = 'verified',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiProperty({
    description: 'Statut de l\'incident',
    enum: IncidentStatus,
    example: IncidentStatus.VERIFIED,
    required: false,
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;
}

