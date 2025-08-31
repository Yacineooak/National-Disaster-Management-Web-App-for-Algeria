import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  MapPin, 
  Filter, 
  Layers,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Icônes personnalisées pour les différents types d'incidents
const createIncidentIcon = (severity, category) => {
  const colors = {
    1: '#10b981', // Vert - Faible
    2: '#f59e0b', // Jaune - Moyen  
    3: '#f97316', // Orange - Élevé
    4: '#ef4444', // Rouge - Critique
    5: '#dc2626'  // Rouge foncé - Urgence
  };

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="incident-marker severity-${severity}" style="
        width: 24px;
        height: 24px;
        background-color: ${colors[severity]};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
      ">
        ${severity}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Composant pour gérer les événements de clic sur la carte
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    }
  });
  return null;
}

// Composant pour les contrôles de la carte
function MapControls({ filters, onFilterChange, onToggleLayer, layers }) {
  return (
    <div className="absolute top-4 right-4 z-[1000] space-y-2">
      <Card className="p-2">
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleLayer('incidents')}
            className={layers.incidents ? 'bg-blue-100' : ''}
          >
            {layers.incidents ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="ml-2">Incidents</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleLayer('riskZones')}
            className={layers.riskZones ? 'bg-red-100' : ''}
          >
            {layers.riskZones ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="ml-2">Zones de risque</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleLayer('clusters')}
            className={layers.clusters ? 'bg-green-100' : ''}
          >
            {layers.clusters ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="ml-2">Clusters</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Composant principal de la vue carte
function MapView({ onReportIncident }) {
  const [incidents, setIncidents] = useState([]);
  const [riskZones, setRiskZones] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapCenter, setMapCenter] = useState([36.7538, 3.0588]); // Alger par défaut
  const [userLocation, setUserLocation] = useState(null);
  
  // Filtres et couches
  const [filters, setFilters] = useState({
    category: 'all',
    severity: 'all',
    timeRange: '24h'
  });
  
  const [layers, setLayers] = useState({
    incidents: true,
    riskZones: true,
    clusters: false
  });

  // Charger les données initiales
  useEffect(() => {
    loadIncidents();
    loadRiskZones();
    getUserLocation();
  }, [filters]);

  // Obtenir la localisation de l'utilisateur
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          console.warn('Géolocalisation non disponible:', error);
          toast.warning('Impossible d\'obtenir votre localisation');
        }
      );
    }
  };

  // Charger les incidents depuis l'API
  const loadIncidents = async () => {
    try {
      setLoading(true);
      
      // Simulation de données d'incidents pour l'Algérie
      const mockIncidents = [
        {
          id: '1',
          title: 'Inondation dans le centre-ville d\'Alger',
          description: 'Fortes pluies causant des inondations importantes',
          category: 'flood',
          severity: 4,
          latitude: 36.7538,
          longitude: 3.0588,
          address: 'Rue Didouche Mourad, Alger Centre',
          status: 'reported',
          createdAt: new Date().toISOString(),
          reporterId: 'user1',
          photos: []
        },
        {
          id: '2',
          title: 'Incendie de forêt près de Blida',
          description: 'Feu de forêt en progression, évacuation en cours',
          category: 'fire',
          severity: 5,
          latitude: 36.4203,
          longitude: 2.8277,
          address: 'Forêt de Chréa, Blida',
          status: 'verified',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reporterId: 'user2',
          photos: []
        },
        {
          id: '3',
          title: 'Accident de la route sur l\'autoroute',
          description: 'Collision multiple, embouteillages importants',
          category: 'accident',
          severity: 3,
          latitude: 36.6000,
          longitude: 3.1000,
          address: 'Autoroute A1, sortie Rouiba',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          reporterId: 'user3',
          photos: []
        },
        {
          id: '4',
          title: 'Séisme ressenti à Constantine',
          description: 'Secousse tellurique de magnitude 4.2',
          category: 'earthquake',
          severity: 2,
          latitude: 36.3650,
          longitude: 6.6147,
          address: 'Constantine Centre',
          status: 'verified',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          reporterId: 'user4',
          photos: []
        },
        {
          id: '5',
          title: 'Tempête de sable à Ouargla',
          description: 'Visibilité réduite, vents violents',
          category: 'storm',
          severity: 3,
          latitude: 31.9539,
          longitude: 5.3295,
          address: 'Ouargla Centre',
          status: 'reported',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          reporterId: 'user5',
          photos: []
        }
      ];

      setIncidents(mockIncidents);
      
      // Générer des clusters basés sur les incidents
      generateClusters(mockIncidents);
      
    } catch (error) {
      console.error('Erreur lors du chargement des incidents:', error);
      toast.error('Erreur lors du chargement des incidents');
    } finally {
      setLoading(false);
    }
  };

  // Charger les zones de risque
  const loadRiskZones = async () => {
    try {
      // Simulation de zones de risque pour l'Algérie
      const mockRiskZones = [
        {
          id: 'risk1',
          center: [36.7538, 3.0588],
          radius: 5000,
          riskLevel: 'high',
          type: 'flood_risk',
          description: 'Zone inondable - Centre d\'Alger'
        },
        {
          id: 'risk2',
          center: [36.4203, 2.8277],
          radius: 8000,
          riskLevel: 'critical',
          type: 'fire_risk',
          description: 'Zone à risque d\'incendie - Blida'
        },
        {
          id: 'risk3',
          center: [36.3650, 6.6147],
          radius: 15000,
          riskLevel: 'medium',
          type: 'earthquake_risk',
          description: 'Zone sismique - Constantine'
        }
      ];

      setRiskZones(mockRiskZones);
      
    } catch (error) {
      console.error('Erreur lors du chargement des zones de risque:', error);
    }
  };

  // Générer des clusters d'incidents
  const generateClusters = (incidentData) => {
    // Algorithme simple de clustering basé sur la proximité
    const clustered = [];
    const processed = new Set();
    
    incidentData.forEach((incident, index) => {
      if (processed.has(index)) return;
      
      const cluster = {
        id: `cluster_${index}`,
        center: [incident.latitude, incident.longitude],
        incidents: [incident],
        severity: incident.severity
      };
      
      // Chercher les incidents proches (dans un rayon de 10km)
      incidentData.forEach((otherIncident, otherIndex) => {
        if (index !== otherIndex && !processed.has(otherIndex)) {
          const distance = calculateDistance(
            incident.latitude, incident.longitude,
            otherIncident.latitude, otherIncident.longitude
          );
          
          if (distance < 10) { // 10km
            cluster.incidents.push(otherIncident);
            cluster.severity = Math.max(cluster.severity, otherIncident.severity);
            processed.add(otherIndex);
          }
        }
      });
      
      processed.add(index);
      
      if (cluster.incidents.length > 1) {
        clustered.push(cluster);
      }
    });
    
    setClusters(clustered);
  };

  // Calculer la distance entre deux points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Gérer le clic sur la carte
  const handleMapClick = (latlng) => {
    console.log('Clic sur la carte:', latlng);
    // Ici on pourrait ouvrir le formulaire de rapport avec les coordonnées pré-remplies
  };

  // Basculer l'affichage des couches
  const toggleLayer = (layerName) => {
    setLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  // Obtenir la couleur selon la gravité
  const getSeverityColor = (severity) => {
    const colors = {
      1: '#10b981',
      2: '#f59e0b', 
      3: '#f97316',
      4: '#ef4444',
      5: '#dc2626'
    };
    return colors[severity] || '#6b7280';
  };

  // Obtenir le texte de la gravité
  const getSeverityText = (severity) => {
    const texts = {
      1: 'Faible',
      2: 'Moyen',
      3: 'Élevé', 
      4: 'Critique',
      5: 'Urgence'
    };
    return texts[severity] || 'Inconnu';
  };

  // Obtenir le texte de la catégorie
  const getCategoryText = (category) => {
    const categories = {
      earthquake: 'Séisme',
      flood: 'Inondation',
      fire: 'Incendie',
      storm: 'Tempête',
      landslide: 'Glissement de terrain',
      accident: 'Accident',
      infrastructure: 'Infrastructure',
      health: 'Santé',
      security: 'Sécurité',
      other: 'Autre'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Contrôles de la carte */}
      <MapControls 
        filters={filters}
        onFilterChange={setFilters}
        onToggleLayer={toggleLayer}
        layers={layers}
      />

      {/* Bouton de rapport d'incident flottant */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <Button
          onClick={onReportIncident}
          size="lg"
          className="rounded-full shadow-lg bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Signaler un incident
        </Button>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={mapCenter}
        zoom={7}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Gestionnaire de clics sur la carte */}
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Marqueur de localisation utilisateur */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                <p className="font-medium">Votre position</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marqueurs d'incidents */}
        {layers.incidents && incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.latitude, incident.longitude]}
            icon={createIncidentIcon(incident.severity, incident.category)}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">{incident.title}</h3>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: getSeverityColor(incident.severity),
                      color: getSeverityColor(incident.severity)
                    }}
                  >
                    {getSeverityText(incident.severity)}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 mb-2">{incident.description}</p>
                
                <div className="space-y-1 text-xs">
                  <div className="flex items-center">
                    <span className="font-medium">Catégorie:</span>
                    <span className="ml-1">{getCategoryText(incident.category)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Adresse:</span>
                    <span className="ml-1">{incident.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Signalé:</span>
                    <span className="ml-1">
                      {new Date(incident.createdAt).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    Voir détails
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Confirmer
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Clusters d'incidents */}
        {layers.clusters && clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            position={cluster.center}
            icon={L.divIcon({
              className: 'cluster-marker',
              html: `
                <div style="
                  width: 40px;
                  height: 40px;
                  background-color: ${getSeverityColor(cluster.severity)};
                  border: 3px solid white;
                  border-radius: 50%;
                  color: white;
                  font-weight: bold;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">
                  ${cluster.incidents.length}
                </div>
              `,
              iconSize: [40, 40],
              iconAnchor: [20, 20]
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold mb-2">
                  Cluster de {cluster.incidents.length} incidents
                </h3>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {cluster.incidents.map((incident) => (
                    <div key={incident.id} className="text-xs border-b pb-1">
                      <div className="font-medium">{incident.title}</div>
                      <div className="text-gray-600">{getCategoryText(incident.category)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;

