[Application de Gestion des Catastrophes Nationales - Algérie.md](https://github.com/user-attachments/files/22066228/Application.de.Gestion.des.Catastrophes.Nationales.-.Algerie.md)
# Application de Gestion des Catastrophes Nationales - Algérie

## 🚨 Vue d'ensemble
<img width="1901" height="882" alt="fedgddgdgdg" src="https://github.com/user-attachments/assets/c20a6297-36d6-4868-b968-c326149161b6" />

Cette application web complète permet aux citoyens algériens de signaler des incidents et catastrophes naturelles en temps réel, tout en offrant aux autorités gouvernementales et ONG des outils avancés de gestion et d'analyse des risques.

## ✨ Fonctionnalités principales

### 🗺️ Carte interactive en temps réel
- Visualisation des incidents sur une carte de l'Algérie avec Leaflet
- Marqueurs colorés selon le niveau de gravité (1-5)
- Clustering intelligent des incidents proches
- Zones de risque prédictives basées sur l'IA
- Géolocalisation automatique des utilisateurs

### 📱 Signalement d'incidents
<img width="1133" height="879" alt="fghtrgertggtr" src="https://github.com/user-attachments/assets/3682e967-6f29-4bf0-8546-de2fe2f14f0a" />

- Formulaire complet avec géolocalisation
- Upload de photos (max 5, jusqu'à 5MB chacune)
- Catégorisation automatique (séisme, inondation, incendie, etc.)
- Évaluation du niveau de gravité
- Tags personnalisés et estimation des personnes affectées

### 🏛️ Tableaux de bord avancés
- **Citoyens** : Statistiques personnelles, historique des rapports
- **Gouvernement** : Vue d'ensemble nationale, analytics avancés
- **ONG** : Coordination des ressources, zones d'intervention
- Graphiques interactifs avec Recharts
- Filtres par région, catégorie, période

### 🎮 Système de gamification
- **Niveaux et points** : Progression basée sur l'activité
- **Badges** : Récompenses pour différents accomplissements
  - Commun : Premier rapport, Observateur régulier
  - Rare : Rapporteur vérifié, Héros local
  - Épique : Gardien de la sécurité
  - Légendaire : Protecteur national
- **Classements** : Top rapporteurs par région
- **Séries** : Encouragement à la participation continue

### 🤖 Intelligence artificielle
- **Détection d'anomalies** : Isolation Forest pour identifier les patterns suspects
- **Clustering géospatial** : DBSCAN pour regrouper les incidents
- **Prédiction de zones à risque** : Analyse des données historiques
- **Alertes automatiques** : Notifications push en temps réel

## 🏗️ Architecture technique

### Backend - Microservices (Node.js/NestJS)
```
├── api-gateway/          # Point d'entrée principal avec Swagger
├── auth-service/         # Authentification JWT + rôles
├── incident-service/     # Gestion des rapports d'incidents
├── map-service/          # Services cartographiques
├── notification-service/ # Notifications temps réel (WebSocket)
├── dashboard-service/    # Analytics et statistiques
├── ai-service/          # Détection d'anomalies (Python/scikit-learn)
└── shared/              # Types TypeScript partagés
```

### Frontend (React + Vite)
```
├── components/          # Composants UI réutilisables
│   ├── MapView.jsx     # Carte interactive Leaflet
│   ├── Dashboard.jsx   # Tableaux de bord
│   ├── IncidentForm.jsx # Formulaire de signalement
│   └── Navbar.jsx      # Navigation responsive
├── hooks/              # Logique métier React
│   ├── useAuth.jsx     # Gestion authentification
│   └── useNotifications.jsx # Notifications temps réel
└── contexts/           # Contextes React globaux
```

### Base de données
- **MongoDB** : Stockage des incidents, utilisateurs, notifications
- **PostgreSQL** : Analytics, logs, données structurées
- **Redis** : Cache, sessions, notifications temps réel

### Services externes
- **Cloudinary** : Stockage et optimisation des images
- **OpenStreetMap** : Données cartographiques
- **Nominatim** : Géocodage inverse

## 🚀 Installation et déploiement

### Prérequis
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- pnpm

### Installation locale
```bash
# Cloner le projet
git clone <repository-url>
cd disaster-management-app

# Backend - Installer les dépendances
cd services/api-gateway && npm install
cd ../auth-service && npm install
cd ../incident-service && npm install
# ... répéter pour tous les services

# Frontend - Installer les dépendances
cd frontend/disaster-management-frontend
pnpm install

# Service IA Python
cd services/ai-service
pip install -r requirements.txt

# Démarrer avec Docker Compose
docker-compose up -d
```

### Déploiement production
```bash
# Build frontend
cd frontend/disaster-management-frontend
pnpm run build

# Le dossier dist/ contient l'application prête pour déploiement
```

## 🔧 Configuration

### Variables d'environnement
```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/disaster-management
POSTGRES_URI=postgresql://user:pass@localhost:5432/disaster_db
REDIS_URL=redis://localhost:6379

# Services externes
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Notifications
WEBSOCKET_PORT=3001
```

## 📊 Utilisation

### Pour les citoyens
1. **Inscription** : Créer un compte avec email et localisation
2. **Signalement** : Utiliser le bouton rouge "Signaler" sur la carte
3. **Suivi** : Consulter le statut de vos rapports dans le profil
4. **Gamification** : Gagner des points et badges en participant

### Pour les autorités
1. **Connexion** : Compte gouvernement ou ONG avec privilèges étendus
2. **Monitoring** : Surveiller les incidents en temps réel
3. **Vérification** : Valider ou rejeter les rapports citoyens
4. **Analytics** : Analyser les tendances et zones à risque
5. **Alertes** : Diffuser des alertes d'urgence géolocalisées

## 🔒 Sécurité

- **Authentification JWT** avec refresh tokens
- **Validation des données** côté client et serveur
- **Rate limiting** pour prévenir les abus
- **Chiffrement HTTPS** en production
- **Sanitisation** des uploads d'images
- **Géolocalisation** avec consentement utilisateur

## 📈 Performances

- **Clustering côté serveur** pour optimiser l'affichage carte
- **Lazy loading** des composants React
- **Cache Redis** pour les requêtes fréquentes
- **CDN** pour les assets statiques
- **Compression gzip** des réponses API

## 🌍 Localisation

- Interface en **français** (langue officielle)
- Support de l'**arabe** prévu
- Données géographiques spécifiques à l'**Algérie**
- **48 wilayas** supportées
- Fuseaux horaires locaux

## 🤝 Contribution

### Structure des commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatage code
refactor: refactorisation
test: ajout de tests
```

### Workflow de développement
1. Fork du projet
2. Branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commits (`git commit -m 'feat: ajouter nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé pour la République Algérienne Démocratique et Populaire dans le cadre de l'amélioration de la gestion des catastrophes naturelles et de la sécurité civile.

## 📞 Support

Pour toute question ou problème :
- 📧 Email : stylebenderkh@gmail.com
- 📱 Téléphone : +213 541 09 59 03
---

**🇩🇿 Pour une Algérie plus sûre et résiliente face aux catastrophes naturelles**

