#!/usr/bin/env python3
"""
Service IA pour la détection d'anomalies et la prédiction des zones à haut risque
Application de gestion des catastrophes - Algérie
"""

import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from sklearn.cluster import DBSCAN, KMeans
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from pymongo import MongoClient
import redis
import threading
import time

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class IncidentData:
    """Structure de données pour un incident"""
    id: str
    latitude: float
    longitude: float
    category: str
    severity: int
    timestamp: datetime
    weather_conditions: Optional[Dict] = None
    population_density: Optional[float] = None

@dataclass
class RiskPrediction:
    """Structure pour les prédictions de risque"""
    latitude: float
    longitude: float
    risk_level: float
    risk_category: str
    confidence: float
    factors: List[str]

class DisasterAIService:
    """Service principal pour l'analyse IA des catastrophes"""
    
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        
        # Configuration des bases de données
        self.mongo_client = MongoClient(os.getenv('MONGODB_URL', 'mongodb://localhost:27017/disaster_db'))
        self.db = self.mongo_client.disaster_db
        self.redis_client = redis.Redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379'))
        
        # Modèles IA
        self.anomaly_detector = None
        self.risk_predictor = None
        self.scaler = StandardScaler()
        
        # Cache pour les prédictions
        self.prediction_cache = {}
        self.cache_expiry = 3600  # 1 heure
        
        # Initialiser les modèles
        self.initialize_models()
        
        # Configurer les routes Flask
        self.setup_routes()
        
        # Démarrer le processus de mise à jour périodique
        self.start_background_tasks()
    
    def initialize_models(self):
        """Initialiser les modèles d'IA"""
        try:
            # Charger les modèles existants ou en créer de nouveaux
            if os.path.exists('models/anomaly_detector.pkl'):
                self.anomaly_detector = joblib.load('models/anomaly_detector.pkl')
                logger.info("Modèle de détection d'anomalies chargé")
            else:
                self.anomaly_detector = IsolationForest(
                    contamination=0.1,
                    random_state=42,
                    n_estimators=100
                )
                logger.info("Nouveau modèle de détection d'anomalies créé")
            
            if os.path.exists('models/scaler.pkl'):
                self.scaler = joblib.load('models/scaler.pkl')
                logger.info("Scaler chargé")
            
            # Entraîner les modèles avec les données existantes
            self.train_models()
            
        except Exception as e:
            logger.error(f"Erreur lors de l'initialisation des modèles: {e}")
    
    def fetch_historical_data(self) -> List[IncidentData]:
        """Récupérer les données historiques depuis MongoDB"""
        try:
            incidents = []
            cursor = self.db.incidents.find({})
            
            for doc in cursor:
                incident = IncidentData(
                    id=str(doc['_id']),
                    latitude=doc['location']['coordinates'][1],
                    longitude=doc['location']['coordinates'][0],
                    category=doc['category'],
                    severity=doc['severity'],
                    timestamp=doc['createdAt'],
                    weather_conditions=doc.get('metadata', {}).get('weather'),
                    population_density=self.get_population_density(
                        doc['location']['coordinates'][1],
                        doc['location']['coordinates'][0]
                    )
                )
                incidents.append(incident)
            
            logger.info(f"Récupéré {len(incidents)} incidents historiques")
            return incidents
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des données: {e}")
            return []
    
    def get_population_density(self, lat: float, lng: float) -> float:
        """Estimer la densité de population pour une coordonnée donnée"""
        # Simulation basée sur les principales villes d'Algérie
        major_cities = {
            'alger': (36.7538, 3.0588, 3000),
            'oran': (35.6969, -0.6331, 1500),
            'constantine': (36.3650, 6.6147, 1200),
            'annaba': (36.9000, 7.7667, 800),
            'blida': (36.4203, 2.8277, 900),
            'batna': (35.5559, 6.1741, 600),
            'djelfa': (34.6714, 3.2631, 400),
            'setif': (36.1906, 5.4137, 700),
            'sidi_bel_abbes': (35.1908, -0.6307, 500),
            'biskra': (34.8481, 5.7281, 450)
        }
        
        min_distance = float('inf')
        density = 100  # Densité par défaut pour les zones rurales
        
        for city, (city_lat, city_lng, city_density) in major_cities.items():
            distance = np.sqrt((lat - city_lat)**2 + (lng - city_lng)**2)
            if distance < min_distance:
                min_distance = distance
                # Densité décroît avec la distance
                density = city_density * np.exp(-distance * 10)
        
        return max(density, 50)  # Minimum 50 hab/km²
    
    def prepare_features(self, incidents: List[IncidentData]) -> np.ndarray:
        """Préparer les caractéristiques pour l'entraînement"""
        features = []
        
        for incident in incidents:
            # Caractéristiques temporelles
            hour = incident.timestamp.hour
            day_of_week = incident.timestamp.weekday()
            month = incident.timestamp.month
            
            # Caractéristiques géographiques
            lat = incident.latitude
            lng = incident.longitude
            
            # Caractéristiques de l'incident
            severity = incident.severity
            category_encoded = self.encode_category(incident.category)
            
            # Densité de population
            pop_density = incident.population_density or self.get_population_density(lat, lng)
            
            # Conditions météorologiques (si disponibles)
            temp = 25.0  # Température par défaut
            humidity = 60.0  # Humidité par défaut
            wind_speed = 10.0  # Vitesse du vent par défaut
            
            if incident.weather_conditions:
                temp = incident.weather_conditions.get('temperature', 25.0)
                humidity = incident.weather_conditions.get('humidity', 60.0)
                wind_speed = incident.weather_conditions.get('windSpeed', 10.0)
            
            feature_vector = [
                lat, lng, severity, category_encoded, pop_density,
                hour, day_of_week, month, temp, humidity, wind_speed
            ]
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def encode_category(self, category: str) -> int:
        """Encoder les catégories d'incidents en valeurs numériques"""
        category_map = {
            'earthquake': 1, 'flood': 2, 'fire': 3, 'storm': 4,
            'landslide': 5, 'accident': 6, 'infrastructure': 7,
            'health': 8, 'security': 9, 'other': 10
        }
        return category_map.get(category, 10)
    
    def train_models(self):
        """Entraîner les modèles avec les données historiques"""
        try:
            incidents = self.fetch_historical_data()
            
            if len(incidents) < 10:
                logger.warning("Pas assez de données pour l'entraînement")
                return
            
            # Préparer les caractéristiques
            X = self.prepare_features(incidents)
            
            # Normaliser les données
            X_scaled = self.scaler.fit_transform(X)
            
            # Entraîner le détecteur d'anomalies
            self.anomaly_detector.fit(X_scaled)
            
            # Sauvegarder les modèles
            os.makedirs('models', exist_ok=True)
            joblib.dump(self.anomaly_detector, 'models/anomaly_detector.pkl')
            joblib.dump(self.scaler, 'models/scaler.pkl')
            
            logger.info("Modèles entraînés et sauvegardés avec succès")
            
        except Exception as e:
            logger.error(f"Erreur lors de l'entraînement: {e}")
    
    def detect_anomalies(self, incidents: List[IncidentData]) -> List[Dict]:
        """Détecter les anomalies dans les incidents"""
        if not self.anomaly_detector:
            return []
        
        try:
            X = self.prepare_features(incidents)
            X_scaled = self.scaler.transform(X)
            
            # Prédire les anomalies (-1 = anomalie, 1 = normal)
            predictions = self.anomaly_detector.predict(X_scaled)
            scores = self.anomaly_detector.decision_function(X_scaled)
            
            anomalies = []
            for i, (incident, pred, score) in enumerate(zip(incidents, predictions, scores)):
                if pred == -1:  # Anomalie détectée
                    anomalies.append({
                        'incident_id': incident.id,
                        'latitude': incident.latitude,
                        'longitude': incident.longitude,
                        'category': incident.category,
                        'severity': incident.severity,
                        'anomaly_score': float(score),
                        'timestamp': incident.timestamp.isoformat(),
                        'reasons': self.analyze_anomaly_reasons(incident, X_scaled[i])
                    })
            
            return anomalies
            
        except Exception as e:
            logger.error(f"Erreur lors de la détection d'anomalies: {e}")
            return []
    
    def analyze_anomaly_reasons(self, incident: IncidentData, features: np.ndarray) -> List[str]:
        """Analyser les raisons d'une anomalie"""
        reasons = []
        
        # Analyser la gravité
        if incident.severity >= 4:
            reasons.append("Gravité élevée inhabituelle")
        
        # Analyser l'heure
        hour = incident.timestamp.hour
        if hour < 6 or hour > 22:
            reasons.append("Heure inhabituelle")
        
        # Analyser la localisation (zones isolées)
        pop_density = self.get_population_density(incident.latitude, incident.longitude)
        if pop_density < 100:
            reasons.append("Zone à faible densité de population")
        
        return reasons
    
    def predict_risk_zones(self, region_bounds: Dict) -> List[RiskPrediction]:
        """Prédire les zones à haut risque dans une région"""
        try:
            # Générer une grille de points dans la région
            lat_min, lat_max = region_bounds['lat_min'], region_bounds['lat_max']
            lng_min, lng_max = region_bounds['lng_min'], region_bounds['lng_max']
            
            # Grille de 20x20 points
            lat_points = np.linspace(lat_min, lat_max, 20)
            lng_points = np.linspace(lng_min, lng_max, 20)
            
            predictions = []
            
            for lat in lat_points:
                for lng in lng_points:
                    risk_level = self.calculate_risk_level(lat, lng)
                    
                    if risk_level > 0.3:  # Seuil de risque significatif
                        prediction = RiskPrediction(
                            latitude=lat,
                            longitude=lng,
                            risk_level=risk_level,
                            risk_category=self.categorize_risk(risk_level),
                            confidence=0.8,  # Confiance simulée
                            factors=self.identify_risk_factors(lat, lng)
                        )
                        predictions.append(prediction)
            
            return predictions
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction des zones de risque: {e}")
            return []
    
    def calculate_risk_level(self, lat: float, lng: float) -> float:
        """Calculer le niveau de risque pour une coordonnée"""
        # Récupérer les incidents historiques dans un rayon de 5km
        nearby_incidents = self.get_nearby_incidents(lat, lng, 5000)
        
        if not nearby_incidents:
            return 0.1  # Risque minimal
        
        # Facteurs de risque
        incident_count = len(nearby_incidents)
        avg_severity = np.mean([inc['severity'] for inc in nearby_incidents])
        recent_incidents = len([inc for inc in nearby_incidents 
                              if (datetime.now() - inc['timestamp']).days < 30])
        
        # Densité de population
        pop_density = self.get_population_density(lat, lng)
        
        # Calcul du score de risque (0-1)
        risk_score = (
            min(incident_count / 10, 1.0) * 0.3 +  # Fréquence des incidents
            (avg_severity / 5.0) * 0.3 +           # Gravité moyenne
            min(recent_incidents / 5, 1.0) * 0.2 + # Incidents récents
            min(pop_density / 1000, 1.0) * 0.2     # Densité de population
        )
        
        return min(risk_score, 1.0)
    
    def get_nearby_incidents(self, lat: float, lng: float, radius: int) -> List[Dict]:
        """Récupérer les incidents à proximité d'une coordonnée"""
        try:
            # Requête géospatiale MongoDB
            query = {
                'location': {
                    '$near': {
                        '$geometry': {
                            'type': 'Point',
                            'coordinates': [lng, lat]
                        },
                        '$maxDistance': radius
                    }
                }
            }
            
            incidents = []
            cursor = self.db.incidents.find(query)
            
            for doc in cursor:
                incidents.append({
                    'id': str(doc['_id']),
                    'latitude': doc['location']['coordinates'][1],
                    'longitude': doc['location']['coordinates'][0],
                    'category': doc['category'],
                    'severity': doc['severity'],
                    'timestamp': doc['createdAt']
                })
            
            return incidents
            
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des incidents proches: {e}")
            return []
    
    def categorize_risk(self, risk_level: float) -> str:
        """Catégoriser le niveau de risque"""
        if risk_level >= 0.8:
            return 'critical'
        elif risk_level >= 0.6:
            return 'high'
        elif risk_level >= 0.4:
            return 'medium'
        else:
            return 'low'
    
    def identify_risk_factors(self, lat: float, lng: float) -> List[str]:
        """Identifier les facteurs de risque pour une zone"""
        factors = []
        
        # Analyser les incidents historiques
        nearby_incidents = self.get_nearby_incidents(lat, lng, 10000)
        
        if nearby_incidents:
            categories = [inc['category'] for inc in nearby_incidents]
            most_common = max(set(categories), key=categories.count)
            factors.append(f"Historique de {most_common}")
        
        # Analyser la densité de population
        pop_density = self.get_population_density(lat, lng)
        if pop_density > 1000:
            factors.append("Zone densément peuplée")
        
        # Facteurs géographiques (simulation)
        if lat > 36.0:  # Nord de l'Algérie
            factors.append("Zone côtière - risque d'inondation")
        
        if lng < 2.0:  # Ouest de l'Algérie
            factors.append("Proximité frontière - risque sécuritaire")
        
        return factors
    
    def perform_clustering(self, incidents: List[IncidentData]) -> List[Dict]:
        """Effectuer un clustering des incidents pour identifier les zones à risque"""
        if len(incidents) < 3:
            return []
        
        try:
            # Préparer les coordonnées pour le clustering
            coordinates = np.array([[inc.latitude, inc.longitude] for inc in incidents])
            
            # DBSCAN pour identifier les clusters géographiques
            dbscan = DBSCAN(eps=0.01, min_samples=2)  # ~1km de rayon
            cluster_labels = dbscan.fit_predict(coordinates)
            
            clusters = []
            unique_labels = set(cluster_labels)
            
            for label in unique_labels:
                if label == -1:  # Bruit (points isolés)
                    continue
                
                # Incidents dans ce cluster
                cluster_incidents = [incidents[i] for i, l in enumerate(cluster_labels) if l == label]
                
                if len(cluster_incidents) >= 2:
                    # Calculer le centre du cluster
                    center_lat = np.mean([inc.latitude for inc in cluster_incidents])
                    center_lng = np.mean([inc.longitude for inc in cluster_incidents])
                    
                    # Calculer le rayon du cluster
                    distances = [np.sqrt((inc.latitude - center_lat)**2 + (inc.longitude - center_lng)**2) 
                               for inc in cluster_incidents]
                    radius = max(distances) * 111000  # Conversion en mètres
                    
                    # Analyser la gravité du cluster
                    avg_severity = np.mean([inc.severity for inc in cluster_incidents])
                    
                    clusters.append({
                        'id': f"cluster_{label}",
                        'center': {'latitude': center_lat, 'longitude': center_lng},
                        'radius': radius,
                        'incident_count': len(cluster_incidents),
                        'average_severity': avg_severity,
                        'risk_level': self.categorize_risk(avg_severity / 5.0),
                        'incidents': [inc.id for inc in cluster_incidents]
                    })
            
            return clusters
            
        except Exception as e:
            logger.error(f"Erreur lors du clustering: {e}")
            return []
    
    def setup_routes(self):
        """Configurer les routes Flask"""
        
        @self.app.route('/health', methods=['GET'])
        def health_check():
            return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
        
        @self.app.route('/detect-anomalies', methods=['POST'])
        def detect_anomalies_endpoint():
            try:
                data = request.get_json()
                incidents_data = data.get('incidents', [])
                
                # Convertir en objets IncidentData
                incidents = []
                for inc_data in incidents_data:
                    incident = IncidentData(
                        id=inc_data['id'],
                        latitude=inc_data['latitude'],
                        longitude=inc_data['longitude'],
                        category=inc_data['category'],
                        severity=inc_data['severity'],
                        timestamp=datetime.fromisoformat(inc_data['timestamp'])
                    )
                    incidents.append(incident)
                
                anomalies = self.detect_anomalies(incidents)
                return jsonify({'anomalies': anomalies})
                
            except Exception as e:
                logger.error(f"Erreur dans detect-anomalies: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/predict-risk-zones', methods=['POST'])
        def predict_risk_zones_endpoint():
            try:
                data = request.get_json()
                region_bounds = data.get('region_bounds')
                
                predictions = self.predict_risk_zones(region_bounds)
                
                # Convertir en format JSON
                result = []
                for pred in predictions:
                    result.append({
                        'latitude': pred.latitude,
                        'longitude': pred.longitude,
                        'risk_level': pred.risk_level,
                        'risk_category': pred.risk_category,
                        'confidence': pred.confidence,
                        'factors': pred.factors
                    })
                
                return jsonify({'predictions': result})
                
            except Exception as e:
                logger.error(f"Erreur dans predict-risk-zones: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/cluster-incidents', methods=['POST'])
        def cluster_incidents_endpoint():
            try:
                data = request.get_json()
                incidents_data = data.get('incidents', [])
                
                # Convertir en objets IncidentData
                incidents = []
                for inc_data in incidents_data:
                    incident = IncidentData(
                        id=inc_data['id'],
                        latitude=inc_data['latitude'],
                        longitude=inc_data['longitude'],
                        category=inc_data['category'],
                        severity=inc_data['severity'],
                        timestamp=datetime.fromisoformat(inc_data['timestamp'])
                    )
                    incidents.append(incident)
                
                clusters = self.perform_clustering(incidents)
                return jsonify({'clusters': clusters})
                
            except Exception as e:
                logger.error(f"Erreur dans cluster-incidents: {e}")
                return jsonify({'error': str(e)}), 500
        
        @self.app.route('/retrain-models', methods=['POST'])
        def retrain_models_endpoint():
            try:
                self.train_models()
                return jsonify({'message': 'Modèles réentraînés avec succès'})
                
            except Exception as e:
                logger.error(f"Erreur lors du réentraînement: {e}")
                return jsonify({'error': str(e)}), 500
    
    def start_background_tasks(self):
        """Démarrer les tâches en arrière-plan"""
        def periodic_retraining():
            while True:
                try:
                    # Réentraîner les modèles toutes les 24 heures
                    time.sleep(24 * 3600)
                    logger.info("Réentraînement périodique des modèles")
                    self.train_models()
                except Exception as e:
                    logger.error(f"Erreur lors du réentraînement périodique: {e}")
        
        # Démarrer le thread de réentraînement
        retraining_thread = threading.Thread(target=periodic_retraining, daemon=True)
        retraining_thread.start()
    
    def run(self, host='0.0.0.0', port=3007, debug=False):
        """Démarrer le service Flask"""
        logger.info(f"Démarrage du service IA sur {host}:{port}")
        self.app.run(host=host, port=port, debug=debug)

if __name__ == '__main__':
    # Créer et démarrer le service
    ai_service = DisasterAIService()
    ai_service.run()

