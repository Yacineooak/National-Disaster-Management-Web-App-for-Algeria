import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IncidentCategory, IncidentSeverity } from '../dto/create-incident.dto';
import { IncidentStatus } from '../dto/update-incident.dto';

export type IncidentDocument = Incident & Document;

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: IncidentCategory })
  category: IncidentCategory;

  @Prop({ required: true, enum: IncidentSeverity })
  severity: IncidentSeverity;

  @Prop({ required: true, enum: IncidentStatus, default: IncidentStatus.REPORTED })
  status: IncidentStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporterId: Types.ObjectId;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  photos: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verifiedBy: Types.ObjectId;

  @Prop()
  verifiedAt: Date;

  @Prop({ type: Number, min: 0 })
  estimatedAffectedPeople: number;

  @Prop({
    type: {
      deviceInfo: {
        userAgent: String,
        platform: String,
        timestamp: Date,
        accuracy: Number,
      },
      weather: {
        temperature: Number,
        humidity: Number,
        windSpeed: Number,
        conditions: String,
        source: String,
      },
      nearbyIncidents: [{ type: Types.ObjectId, ref: 'Incident' }],
    },
    default: {},
  })
  metadata: {
    deviceInfo?: {
      userAgent: string;
      platform: string;
      timestamp: Date;
      accuracy?: number;
    };
    weather?: {
      temperature: number;
      humidity: number;
      windSpeed: number;
      conditions: string;
      source: string;
    };
    nearbyIncidents?: Types.ObjectId[];
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

// Index géospatial pour les requêtes de proximité
IncidentSchema.index({ location: '2dsphere' });

// Index pour les requêtes fréquentes
IncidentSchema.index({ category: 1, severity: 1 });
IncidentSchema.index({ status: 1 });
IncidentSchema.index({ reporterId: 1 });
IncidentSchema.index({ createdAt: -1 });

