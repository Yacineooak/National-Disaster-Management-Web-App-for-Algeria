# Plan d'architecture de l'application de gestion des catastrophes en Algérie

## 1. Introduction

Ce document décrit l'architecture proposée pour l'application web de gestion des catastrophes nationales en Algérie. L'objectif est de créer une plateforme robuste, évolutive et en temps réel permettant aux citoyens de signaler des incidents, de visualiser une carte de crise, et aux entités gouvernementales/ONG de gérer les ressources.

## 2. Principes d'architecture

L'application sera construite sur une architecture microservices pour garantir la scalabilité, la résilience et la facilité de maintenance. Les principes clés incluent :

*   **Découplage des services :** Chaque microservice sera autonome et responsable d'une fonctionnalité spécifique.
*   **Communication asynchrone :** Utilisation de files d'attente de messages (par exemple, RabbitMQ, Kafka) pour la communication entre les services afin d'améliorer la résilience et la réactivité.
*   **API Gateway :** Un point d'entrée unique pour toutes les requêtes client, gérant l'authentification, la limitation de débit et le routage vers les microservices appropriés.
*   **Persistance des données :** Chaque microservice aura sa propre base de données pour maintenir l'autonomie.
*   **Observabilité :** Implémentation de la journalisation centralisée, de la surveillance et du traçage distribué.
*   **Tolérance aux pannes :** Conception des services pour qu'ils soient résilients aux pannes, avec des mécanismes de retry et de circuit breaker.

## 3. Technologies clés

*   **Backend :** Node.js avec le framework NestJS pour le développement des microservices.
*   **Base de données :** MongoDB pour les données non structurées (rapports d'incidents, photos) et PostgreSQL pour les données structurées (utilisateurs, gamification, données historiques pour l'IA).
*   **Communication inter-services :** RabbitMQ ou Kafka pour les messages asynchrones.
*   **Cartographie :** Leaflet ou Mapbox pour la carte de crise en temps réel.
*   **Clustering IA :** Algorithmes de clustering (par exemple, K-means, DBSCAN) implémentés en Python (via un microservice dédié) pour identifier les zones à haut risque.
*   **Détection d'anomalies IA :** Python avec des bibliothèques comme scikit-learn ou TensorFlow pour l'analyse des données historiques et la prédiction des zones à haut risque.
*   **Frontend :** React ou Angular pour une interface utilisateur réactive.
*   **Notifications en temps réel :** WebSockets (via Socket.IO ou équivalent) pour les push notifications.

## 4. Services microservices proposés

1.  **Service d'authentification et d'utilisateurs :** Gère l'enregistrement, la connexion, les profils utilisateurs et les rôles (citoyen, gouvernement, ONG).
2.  **Service de rapports d'incidents :** Reçoit et stocke les rapports d'incidents (géolocalisation, photos, description, gravité).
3.  **Service de cartographie et de géolocalisation :** Gère les données géospatiales, l'affichage de la carte de crise et le clustering des incidents.
4.  **Service de notifications :** Envoie des notifications en temps réel aux utilisateurs et aux tableaux de bord.
5.  **Service de gamification :** Gère les badges, les points et les classements des utilisateurs.
6.  **Service d'analyse de données/IA :** Traite les données historiques, exécute les modèles de détection d'anomalies et identifie les zones à haut risque.
7.  **Service de tableaux de bord :** Fournit les données agrégées et les visualisations pour les tableaux de bord gouvernementaux et ONG.

## 5. Flux de données typique

1.  Un citoyen soumet un rapport d'incident via l'application frontend.
2.  La requête passe par l'API Gateway et est routée vers le Service de rapports d'incidents.
3.  Le Service de rapports d'incidents stocke les données dans sa base de données et envoie un message asynchrone au Service de cartographie et de géolocalisation et au Service d'analyse de données/IA.
4.  Le Service de cartographie et de géolocalisation met à jour la carte de crise en temps réel et applique le clustering.
5.  Le Service d'analyse de données/IA traite le nouveau rapport, le combine avec les données historiques et exécute la détection d'anomalies.
6.  Le Service de notifications envoie des alertes aux tableaux de bord et aux utilisateurs concernés.
7.  Le Service de gamification met à jour le score de l'utilisateur et attribue des badges si nécessaire.

## 6. Considérations de sécurité

*   **Authentification et autorisation :** Utilisation de JWT (JSON Web Tokens) pour l'authentification et de mécanismes de contrôle d'accès basés sur les rôles.
*   **Validation des entrées :** Toutes les entrées utilisateur seront validées pour prévenir les attaques par injection.
*   **Chiffrement des données :** Les données sensibles seront chiffrées au repos et en transit.
*   **Protection contre les attaques DDoS :** Mise en place de mesures de protection au niveau de l'API Gateway.

## 7. Scalabilité et performances

*   **Mise à l'échelle horizontale :** Les microservices seront conçus pour être mis à l'échelle horizontalement en ajoutant de nouvelles instances.
*   **Mise en cache :** Utilisation de caches (par exemple, Redis) pour réduire la charge sur les bases de données et améliorer les performances.
*   **Optimisation des requêtes :** Optimisation des requêtes de base de données et des algorithmes.

## 8. Prochaines étapes

1.  Détailler les spécifications de chaque microservice.
2.  Choisir les outils spécifiques pour la cartographie (Leaflet vs Mapbox) et la communication inter-services (RabbitMQ vs Kafka).
3.  Commencer la mise en place de l'environnement de développement et l'initialisation des microservices de base.

