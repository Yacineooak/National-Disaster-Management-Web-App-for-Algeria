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
  Sse,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une nouvelle notification' })
  @ApiResponse({ status: 201, description: 'Notification créée avec succès.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() req,
  ) {
    return this.notificationService.create(createNotificationDto, req.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les notifications de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Notifications récupérées avec succès.' })
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('unread') unread?: boolean,
  ) {
    return this.notificationService.findAll(req.user.sub, {
      page,
      limit,
      unread,
    });
  }

  @Get('unread-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer le nombre de notifications non lues' })
  @ApiResponse({ status: 200, description: 'Nombre récupéré avec succès.' })
  async getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.sub);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiResponse({ status: 200, description: 'Notification marquée comme lue.' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(id, req.user.sub);
  }

  @Patch('mark-all-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  @ApiResponse({ status: 200, description: 'Toutes les notifications marquées comme lues.' })
  async markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une notification' })
  @ApiResponse({ status: 200, description: 'Notification supprimée avec succès.' })
  @ApiResponse({ status: 404, description: 'Notification non trouvée.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.notificationService.remove(id, req.user.sub);
  }

  @Sse('stream')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Stream de notifications en temps réel (SSE)' })
  @ApiResponse({ status: 200, description: 'Stream de notifications établi.' })
  streamNotifications(@Request() req): Observable<MessageEvent> {
    return this.notificationService.getNotificationStream(req.user.sub);
  }

  @Post('broadcast')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Diffuser une notification (admin/gouvernement/ONG uniquement)' })
  @ApiResponse({ status: 201, description: 'Notification diffusée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async broadcast(
    @Body() createNotificationDto: CreateNotificationDto,
    @Request() req,
  ) {
    return this.notificationService.broadcast(createNotificationDto, req.user);
  }

  @Post('emergency-alert')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Envoyer une alerte d\'urgence (gouvernement/admin uniquement)' })
  @ApiResponse({ status: 201, description: 'Alerte d\'urgence envoyée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès interdit.' })
  async sendEmergencyAlert(
    @Body() alertData: {
      title: string;
      message: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      location?: { lat: number; lng: number; radius: number };
    },
    @Request() req,
  ) {
    return this.notificationService.sendEmergencyAlert(alertData, req.user);
  }
}

