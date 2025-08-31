import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto, IncidentStatus } from './dto/update-incident.dto';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class IncidentService {
  constructor(
    @InjectModel(Incident.name) private incidentModel: Model<IncidentDocument>,
    private cloudinaryService: CloudinaryService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createIncidentDto: CreateIncidentDto,
    userId: string,
    photos?: Express.Multer.File[],
  ): Promise<Incident> {
    let photoUrls: string[] = [];

    // Upload des photos vers Cloudinary
    if (photos && photos.length > 0) {
      photoUrls = await Promise.all(
        photos.map(photo => this.cloudinaryService.uploadImage(photo)),
      );
    }

    const incident = new this.incidentModel({
      ...createIncidentDto,
      reporterId: userId,
      location: {
        type: 'Point',
        coordinates: [createIncidentDto.longitude, createIncidentDto.latitude],
      },
      photos: photoUrls,
      status: IncidentStatus.REPORTED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedIncident = await incident.save();

    // Émettre un événement pour notifier les autres services
    this.eventEmitter.emit('incident.created', {
      incident: savedIncident,
      userId,
    });

    return savedIncident;
  }

  async findAll(filters: {
    page: number;
    limit: number;
    category?: string;
    severity?: number;
    status?: string;
    location?: { lat: number; lng: number; radius?: number };
  }) {
    const { page, limit, category, severity, status, location } = filters;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (severity) {
      query.severity = severity;
    }

    if (status) {
      query.status = status;
    }

    // Recherche géospatiale si une localisation est fournie
    if (location) {
      const radius = location.radius || 5000; // 5km par défaut
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
          $maxDistance: radius,
        },
      };
    }

    const [incidents, total] = await Promise.all([
      this.incidentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('reporterId', 'username firstName lastName')
        .exec(),
      this.incidentModel.countDocuments(query),
    ]);

    return {
      incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findNearby(lat: number, lng: number, radius: number = 5000) {
    const incidents = await this.incidentModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
            $maxDistance: radius,
          },
        },
        status: { $ne: IncidentStatus.CLOSED },
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('reporterId', 'username firstName lastName')
      .exec();

    return incidents;
  }

  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentModel
      .findById(id)
      .populate('reporterId', 'username firstName lastName')
      .exec();

    if (!incident) {
      throw new NotFoundException('Incident non trouvé');
    }

    return incident;
  }

  async update(
    id: string,
    updateIncidentDto: UpdateIncidentDto,
    userId: string,
    userRole: string,
  ): Promise<Incident> {
    const incident = await this.findOne(id);

    // Vérifier les permissions
    const canUpdate = 
      incident.reporterId.toString() === userId || 
      ['government', 'ngo', 'admin'].includes(userRole);

    if (!canUpdate) {
      throw new ForbiddenException('Vous n\'avez pas l\'autorisation de modifier cet incident');
    }

    // Seuls les utilisateurs autorisés peuvent changer le statut
    if (updateIncidentDto.status && !['government', 'ngo', 'admin'].includes(userRole)) {
      delete updateIncidentDto.status;
    }

    const updatedIncident = await this.incidentModel
      .findByIdAndUpdate(
        id,
        { ...updateIncidentDto, updatedAt: new Date() },
        { new: true },
      )
      .populate('reporterId', 'username firstName lastName')
      .exec();

    // Émettre un événement pour notifier les autres services
    this.eventEmitter.emit('incident.updated', {
      incident: updatedIncident,
      userId,
      userRole,
    });

    return updatedIncident;
  }

  async verify(id: string, userId: string, userRole: string): Promise<Incident> {
    if (!['government', 'ngo', 'admin'].includes(userRole)) {
      throw new ForbiddenException('Seuls les utilisateurs autorisés peuvent vérifier les incidents');
    }

    const incident = await this.incidentModel
      .findByIdAndUpdate(
        id,
        {
          status: IncidentStatus.VERIFIED,
          isVerified: true,
          verifiedBy: userId,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        },
        { new: true },
      )
      .populate('reporterId', 'username firstName lastName')
      .exec();

    if (!incident) {
      throw new NotFoundException('Incident non trouvé');
    }

    // Émettre un événement pour la gamification
    this.eventEmitter.emit('incident.verified', {
      incident,
      verifiedBy: userId,
    });

    return incident;
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const incident = await this.findOne(id);

    const canDelete = 
      incident.reporterId.toString() === userId || 
      ['admin'].includes(userRole);

    if (!canDelete) {
      throw new ForbiddenException('Vous n\'avez pas l\'autorisation de supprimer cet incident');
    }

    await this.incidentModel.findByIdAndDelete(id);

    // Émettre un événement pour notifier les autres services
    this.eventEmitter.emit('incident.deleted', {
      incidentId: id,
      userId,
      userRole,
    });
  }

  async getStatistics() {
    const [
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      incidentsByCategory,
      incidentsBySeverity,
      recentIncidents,
    ] = await Promise.all([
      this.incidentModel.countDocuments(),
      this.incidentModel.countDocuments({
        status: { $in: [IncidentStatus.REPORTED, IncidentStatus.VERIFIED, IncidentStatus.IN_PROGRESS] },
      }),
      this.incidentModel.countDocuments({
        status: { $in: [IncidentStatus.RESOLVED, IncidentStatus.CLOSED] },
      }),
      this.incidentModel.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      this.incidentModel.aggregate([
        { $group: { _id: '$severity', count: { $sum: 1 } } },
      ]),
      this.incidentModel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('reporterId', 'username firstName lastName'),
    ]);

    return {
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      incidentsByCategory: incidentsByCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      incidentsBySeverity: incidentsBySeverity.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentIncidents,
    };
  }
}

