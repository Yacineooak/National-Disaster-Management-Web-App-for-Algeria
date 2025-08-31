// Types partagés pour l'application de gestion des catastrophes

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profile?: UserProfile;
}

export enum UserRole {
  CITIZEN = 'citizen',
  GOVERNMENT = 'government',
  NGO = 'ngo',
  ADMIN = 'admin'
}

export interface UserProfile {
  avatar?: string;
  phone?: string;
  address?: Address;
  preferences: UserPreferences;
  gamification: GamificationProfile;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface UserPreferences {
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  emergencyAlerts: boolean;
}

export interface PrivacySettings {
  shareLocation: boolean;
  publicProfile: boolean;
  showOnLeaderboard: boolean;
}

export interface GamificationProfile {
  points: number;
  level: number;
  badges: Badge[];
  achievements: Achievement[];
  reportsCount: number;
  verifiedReports: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
  earnedAt: Date;
}

export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: Date;
}

export interface Incident {
  id: string;
  reporterId: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: Coordinates;
  address: string;
  photos: string[];
  videos?: string[];
  tags: string[];
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: IncidentMetadata;
}

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
  OTHER = 'other'
}

export enum IncidentSeverity {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  CRITICAL = 4,
  EMERGENCY = 5
}

export enum IncidentStatus {
  REPORTED = 'reported',
  VERIFIED = 'verified',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected'
}

export interface IncidentMetadata {
  deviceInfo?: DeviceInfo;
  weather?: WeatherInfo;
  nearbyIncidents?: string[];
  estimatedAffectedPeople?: number;
  emergencyServices?: EmergencyService[];
}

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  timestamp: Date;
  accuracy?: number;
}

export interface WeatherInfo {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  source: string;
}

export interface EmergencyService {
  type: EmergencyServiceType;
  name: string;
  phone: string;
  distance: number;
}

export enum EmergencyServiceType {
  POLICE = 'police',
  FIRE = 'fire',
  MEDICAL = 'medical',
  RESCUE = 'rescue'
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  INCIDENT_NEARBY = 'incident_nearby',
  INCIDENT_UPDATE = 'incident_update',
  BADGE_EARNED = 'badge_earned',
  LEVEL_UP = 'level_up',
  EMERGENCY_ALERT = 'emergency_alert',
  SYSTEM = 'system'
}

export interface MapCluster {
  id: string;
  center: Coordinates;
  radius: number;
  incidentCount: number;
  severity: IncidentSeverity;
  incidents: string[];
  riskLevel: RiskLevel;
  createdAt: Date;
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalUsers: number;
  verifiedReporters: number;
  averageResponseTime: number;
  incidentsByCategory: Record<IncidentCategory, number>;
  incidentsBySeverity: Record<IncidentSeverity, number>;
  incidentsByRegion: RegionStats[];
  trendsData: TrendData[];
}

export interface RegionStats {
  region: string;
  incidentCount: number;
  riskLevel: RiskLevel;
  coordinates: Coordinates;
}

export interface TrendData {
  date: Date;
  incidentCount: number;
  category: IncidentCategory;
  severity: IncidentSeverity;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  location: Coordinates;
  address: string;
  photos: string[];
  videos?: string[];
  tags?: string[];
}

export interface UpdateIncidentDto {
  title?: string;
  description?: string;
  category?: IncidentCategory;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  tags?: string[];
}

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface IncidentUpdate extends WebSocketMessage {
  type: 'incident_update';
  payload: {
    incident: Incident;
    action: 'created' | 'updated' | 'deleted';
  };
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  payload: Notification;
}

