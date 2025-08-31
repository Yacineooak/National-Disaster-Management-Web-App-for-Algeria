import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('photos', 10))
  @ApiOperation({ summary: 'Créer un nouveau rapport d\'incident' })
  @ApiResponse({ status: 201, description: 'Incident créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async create(
    @Body() createIncidentDto: CreateIncidentDto,
    @Request() req,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    const userId = req.user.sub;
    return this.incidentService.create(createIncidentDto, userId, photos);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les incidents avec pagination' })
  @ApiResponse({ status: 200, description: 'Liste des incidents récupérée avec succès.' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category') category?: string,
    @Query('severity') severity?: number,
    @Query('status') status?: string,
    @Query('lat') lat?: number,
    @Query('lng') lng?: number,
    @Query('radius') radius?: number,
  ) {
    return this.incidentService.findAll({
      page,
      limit,
      category,
      severity,
      status,
      location: lat && lng ? { lat, lng, radius } : undefined,
    });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Récupérer les incidents à proximité' })
  @ApiResponse({ status: 200, description: 'Incidents à proximité récupérés avec succès.' })
  async findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius: number = 5000, // 5km par défaut
  ) {
    return this.incidentService.findNearby(lat, lng, radius);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Récupérer les statistiques des incidents' })
  @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès.' })
  async getStatistics() {
    return this.incidentService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un incident par ID' })
  @ApiResponse({ status: 200, description: 'Incident récupéré avec succès.' })
  @ApiResponse({ status: 404, description: 'Incident non trouvé.' })
  async findOne(@Param('id') id: string) {
    return this.incidentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un incident' })
  @ApiResponse({ status: 200, description: 'Incident mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Incident non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
    @Request() req,
  ) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.incidentService.update(id, updateIncidentDto, userId, userRole);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier un incident (gouvernement/ONG uniquement)' })
  @ApiResponse({ status: 200, description: 'Incident vérifié avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async verify(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.incidentService.verify(id, userId, userRole);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un incident' })
  @ApiResponse({ status: 200, description: 'Incident supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Incident non trouvé.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const userRole = req.user.role;
    return this.incidentService.remove(id, userId, userRole);
  }
}

