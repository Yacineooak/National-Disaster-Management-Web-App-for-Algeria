[national_disaster.md](https://github.com/user-attachments/files/22066370/national_disaster.md)
# Algeria National Disaster Management System
# Système National de Gestion des Catastrophes - Algérie
<img width="1901" height="882" alt="fedgddgdgdg" src="https://github.com/user-attachments/assets/07a1c5a2-4310-4195-a389-1d323c5d48ab" />

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

## 🚨 Overview | Vue d'ensemble

**English:**
A comprehensive web-based disaster management platform designed for the People's Democratic Republic of Algeria. This system enables real-time incident reporting by citizens while providing government authorities and NGOs with advanced analytics, risk assessment, and emergency response coordination tools.

**Français:**
Une plateforme web complète de gestion des catastrophes conçue pour la République Algérienne Démocratique et Populaire. Ce système permet aux citoyens de signaler des incidents en temps réel tout en offrant aux autorités gouvernementales et aux ONG des outils avancés d'analyse, d'évaluation des risques et de coordination des interventions d'urgence.

## ✨ Key Features | Fonctionnalités principales

### 🗺️ Real-time Interactive Mapping | Cartographie interactive en temps réel

**English:**
- Live incident visualization on Algeria's map using Leaflet.js
- Color-coded severity markers (levels 1-5)
- Intelligent clustering for nearby incidents
- AI-powered predictive risk zones
- Automatic user geolocation

**Français:**
- Visualisation des incidents en direct sur la carte de l'Algérie avec Leaflet.js
- Marqueurs de gravité colorés (niveaux 1-5)
- Clustering intelligent des incidents proches
- Zones de risque prédictives basées sur l'IA
- Géolocalisation automatique des utilisateurs

### 📱 Incident Reporting System | Système de signalement d'incidents
<img width="1133" height="879" alt="fghtrgertggtr" src="https://github.com/user-attachments/assets/2a54c908-b45a-4834-bdfc-cb256bf7d304" />

**English:**
- Comprehensive reporting form with geolocation
- Multi-photo upload support (max 5 photos, 5MB each)
- Automated categorization (earthquake, flood, fire, etc.)
- Severity level assessment
- Custom tags and affected population estimates

**Français:**
- Formulaire de signalement complet avec géolocalisation
- Support d'upload multi-photos (max 5 photos, 5MB chacune)
- Catégorisation automatique (séisme, inondation, incendie, etc.)
- Évaluation du niveau de gravité
- Tags personnalisés et estimation des populations affectées

### 🛡️ Advanced Dashboard Analytics | Tableaux de bord analytiques avancés

**English:**
- **Citizens**: Personal statistics, reporting history
- **Government**: National overview, advanced analytics
- **NGOs**: Resource coordination, intervention zones
- Interactive charts powered by Recharts
- Advanced filtering by region, category, time period

**Français:**
- **Citoyens** : Statistiques personnelles, historique des rapports
- **Gouvernement** : Vue d'ensemble nationale, analytics avancés
- **ONG** : Coordination des ressources, zones d'intervention
- Graphiques interactifs avec Recharts
- Filtrage avancé par région, catégorie, période

### 🎮 Gamification Engine | Moteur de gamification

**English:**
- **Levels & Points**: Activity-based progression system
- **Achievement Badges**: Rewards for various accomplishments
  - Common: First Report, Regular Observer
  - Rare: Verified Reporter, Local Hero
  - Epic: Safety Guardian
  - Legendary: National Protector
- **Leaderboards**: Top reporters by region
- **Streak System**: Continuous participation incentives

**Français:**
- **Niveaux et points** : Système de progression basé sur l'activité
- **Badges de réussite** : Récompenses pour différents accomplissements
  - Commun : Premier rapport, Observateur régulier
  - Rare : Rapporteur vérifié, Héros local
  - Épique : Gardien de la sécurité
  - Légendaire : Protecteur national
- **Classements** : Top rapporteurs par région
- **Système de séries** : Incitations à la participation continue

### 🤖 Artificial Intelligence | Intelligence artificielle

**English:**
- **Anomaly Detection**: Isolation Forest for suspicious pattern identification
- **Geospatial Clustering**: DBSCAN for incident grouping
- **Risk Zone Prediction**: Historical data analysis
- **Automated Alerts**: Real-time push notifications

**Français:**
- **Détection d'anomalies** : Isolation Forest pour identifier les patterns suspects
- **Clustering géospatial** : DBSCAN pour regrouper les incidents
- **Prédiction de zones à risque** : Analyse des données historiques
- **Alertes automatiques** : Notifications push en temps réel

## 🏗️ Technical Architecture | Architecture technique

### Backend - Microservices Architecture | Architecture microservices (Node.js/NestJS)

```
├── api-gateway/          # Main entry point with Swagger docs | Point d'entrée principal avec Swagger
├── auth-service/         # JWT authentication + roles | Authentification JWT + rôles
├── incident-service/     # Incident report management | Gestion des rapports d'incidents
├── map-service/          # Cartographic services | Services cartographiques
├── notification-service/ # Real-time notifications (WebSocket) | Notifications temps réel (WebSocket)
├── dashboard-service/    # Analytics and statistics | Analytics et statistiques
├── ai-service/          # Anomaly detection (Python/scikit-learn) | Détection d'anomalies (Python/scikit-learn)
└── shared/              # Shared TypeScript types | Types TypeScript partagés
```

### Frontend Stack | Stack frontend (React + Vite)

```
├── components/          # Reusable UI components | Composants UI réutilisables
│   ├── MapView.jsx     # Interactive Leaflet map | Carte interactive Leaflet
│   ├── Dashboard.jsx   # Dashboard components | Composants tableau de bord
│   ├── IncidentForm.jsx # Incident reporting form | Formulaire de signalement
│   └── Navbar.jsx      # Responsive navigation | Navigation responsive
├── hooks/              # Business logic hooks | Hooks logique métier
│   ├── useAuth.jsx     # Authentication management | Gestion authentification
│   └── useNotifications.jsx # Real-time notifications | Notifications temps réel
└── contexts/           # Global React contexts | Contextes React globaux
```

### Database Layer | Couche base de données

**English:**
- **MongoDB**: Incident storage, user profiles, notifications
- **PostgreSQL**: Analytics, audit logs, structured data
- **Redis**: Caching, sessions, real-time notifications

**Français:**
- **MongoDB** : Stockage des incidents, profils utilisateurs, notifications
- **PostgreSQL** : Analytics, logs d'audit, données structurées
- **Redis** : Cache, sessions, notifications temps réel

### External Services | Services externes

**English:**
- **Cloudinary**: Image storage and optimization
- **OpenStreetMap**: Cartographic data
- **Nominatim**: Reverse geocoding services

**Français:**
- **Cloudinary** : Stockage et optimisation d'images
- **OpenStreetMap** : Données cartographiques
- **Nominatim** : Services de géocodage inverse

## 🚀 Installation & Deployment | Installation et déploiement

### Prerequisites | Prérequis

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- pnpm

### Local Development Setup | Configuration développement local

```bash
# Clone repository | Cloner le dépôt
git clone https://github.com/your-org/algeria-disaster-management.git
cd algeria-disaster-management

# Backend services installation | Installation des services backend
cd services/api-gateway && npm install
cd ../auth-service && npm install
cd ../incident-service && npm install
# Repeat for all services | Répéter pour tous les services

# Frontend installation | Installation frontend
cd frontend/disaster-management-frontend
pnpm install

# Python AI service | Service IA Python
cd services/ai-service
pip install -r requirements.txt

# Start with Docker Compose | Démarrer avec Docker Compose
docker-compose up -d
```

### Production Deployment | Déploiement production

```bash
# Build frontend | Build frontend
cd frontend/disaster-management-frontend
pnpm run build

# Deploy dist/ folder to web server | Déployer le dossier dist/ sur serveur web
```

## 🔧 Configuration

### Environment Variables | Variables d'environnement

```env
# Database | Base de données
MONGODB_URI=mongodb://localhost:27017/disaster-management
POSTGRES_URI=postgresql://user:pass@localhost:5432/disaster_db
REDIS_URL=redis://localhost:6379

# External Services | Services externes
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security | Sécurité
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Real-time | Temps réel
WEBSOCKET_PORT=3001
```

## 📊 Usage Guide | Guide d'utilisation

### For Citizens | Pour les citoyens

**English:**
1. **Registration**: Create account with email and location
2. **Reporting**: Use red "Report" button on map interface
3. **Tracking**: Monitor report status in user profile
4. **Engagement**: Earn points and badges through participation

**Français:**
1. **Inscription** : Créer un compte avec email et localisation
2. **Signalement** : Utiliser le bouton rouge "Signaler" sur la carte
3. **Suivi** : Consulter le statut des rapports dans le profil
4. **Engagement** : Gagner des points et badges en participant

### For Authorities | Pour les autorités

**English:**
1. **Access**: Government/NGO accounts with extended privileges
2. **Monitoring**: Real-time incident surveillance
3. **Verification**: Validate or reject citizen reports
4. **Analytics**: Analyze trends and risk zones
5. **Alerts**: Broadcast geo-targeted emergency alerts

**Français:**
1. **Accès** : Comptes gouvernement/ONG avec privilèges étendus
2. **Surveillance** : Monitoring des incidents en temps réel
3. **Vérification** : Valider ou rejeter les rapports citoyens
4. **Analytics** : Analyser les tendances et zones à risque
5. **Alertes** : Diffuser des alertes d'urgence géolocalisées

## 🔒 Security Features | Caractéristiques de sécurité

**English:**
- JWT authentication with refresh token rotation
- Client and server-side data validation
- Rate limiting to prevent abuse
- HTTPS encryption in production
- Image upload sanitization
- Consent-based geolocation

**Français:**
- Authentification JWT avec rotation des tokens de rafraîchissement
- Validation des données côté client et serveur
- Limitation de débit pour prévenir les abus
- Chiffrement HTTPS en production
- Sanitisation des uploads d'images
- Géolocalisation basée sur le consentement

## 📈 Performance Optimizations | Optimisations de performance

**English:**
- Server-side clustering for optimized map rendering
- React component lazy loading
- Redis caching for frequent queries
- CDN for static asset delivery
- Gzip compression for API responses

**Français:**
- Clustering côté serveur pour optimiser le rendu cartographique
- Lazy loading des composants React
- Cache Redis pour les requêtes fréquentes
- CDN pour la livraison d'assets statiques
- Compression gzip des réponses API

## 🌐 Localization | Localisation

**English:**
- Primary interface in **French** (official language)
- **Arabic** support planned
- Algeria-specific geographic data
- **48 wilayas** coverage
- Local timezone support

**Français:**
- Interface principale en **français** (langue officielle)
- Support de l'**arabe** prévu
- Données géographiques spécifiques à l'Algérie
- Couverture des **48 wilayas**
- Support des fuseaux horaires locaux

## 🤝 Contributing | Contribution

### Commit Convention | Convention des commits

```
feat: new feature | nouvelle fonctionnalité
fix: bug fix | correction de bug
docs: documentation update | mise à jour documentation
style: code formatting | formatage code
refactor: code refactoring | refactorisation
test: add tests | ajout de tests
```

### Development Workflow | Workflow de développement

**English:**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

**Français:**
1. Fork du dépôt
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commits des changements (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 License | Licence

**English:**
This project is licensed under the MIT License. See the `LICENSE` file for details.

**Français:**
Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Development Team | Équipe de développement

**English:**
Developed for the People's Democratic Republic of Algeria as part of the national initiative to improve natural disaster management and civil security infrastructure.

**Français:**
Développé pour la République Algérienne Démocratique et Populaire dans le cadre de l'initiative nationale d'amélioration de la gestion des catastrophes naturelles et de l'infrastructure de sécurité civile.

## 📞 Support & Contact | Support et contact

**English:**
For technical support or inquiries:
- 📧 Email: stylebenderkh@gmail.com
- 📱 Phone: +213 541 09 59 03

**Français:**
Pour le support technique ou les demandes :
- 📧 Email : stylebenderkh@gmail.com
- 📱 Téléphone : +213 541 09 59 03 

## 🏆 Project Goals | Objectifs du projet

**English:**
- Enhance national disaster preparedness and response capabilities
- Facilitate real-time communication between citizens and authorities
- Improve emergency resource allocation through data-driven insights
- Build community resilience through citizen engagement
- Support evidence-based policy making for disaster risk reduction

**Français:**
- Améliorer les capacités nationales de préparation et de réponse aux catastrophes
- Faciliter la communication en temps réel entre citoyens et autorités
- Améliorer l'allocation des ressources d'urgence grâce aux insights basés sur les données
- Renforcer la résilience communautaire par l'engagement citoyen
- Soutenir l'élaboration de politiques basées sur des preuves pour la réduction des risques

---

**🇩🇿 Building a safer and more resilient Algeria | Pour une Algérie plus sûre et résiliente**

## Repository Tags | Tags du dépôt

`disaster-management` `emergency-response` `algeria` `real-time-monitoring` `react` `nodejs` `nestjs` `mongodb` `postgresql` `microservices` `geolocation` `interactive-maps` `leaflet` `incident-reporting` `gamification` `machine-learning` `anomaly-detection` `data-analytics` `government` `civic-tech`
