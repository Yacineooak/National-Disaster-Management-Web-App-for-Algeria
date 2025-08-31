import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Camera,
  X,
  Upload,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';

const INCIDENT_CATEGORIES = [
  { value: 'earthquake', label: 'Séisme', icon: '🌍' },
  { value: 'flood', label: 'Inondation', icon: '🌊' },
  { value: 'fire', label: 'Incendie', icon: '🔥' },
  { value: 'storm', label: 'Tempête', icon: '⛈️' },
  { value: 'landslide', label: 'Glissement de terrain', icon: '⛰️' },
  { value: 'accident', label: 'Accident', icon: '🚗' },
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
  { value: 'health', label: 'Santé', icon: '🏥' },
  { value: 'security', label: 'Sécurité', icon: '🚨' },
  { value: 'other', label: 'Autre', icon: '❓' }
];

const SEVERITY_LEVELS = [
  { value: 1, label: 'Faible', color: 'bg-green-100 text-green-800', description: 'Incident mineur sans danger immédiat' },
  { value: 2, label: 'Moyen', color: 'bg-yellow-100 text-yellow-800', description: 'Incident nécessitant une attention' },
  { value: 3, label: 'Élevé', color: 'bg-orange-100 text-orange-800', description: 'Incident sérieux nécessitant une intervention' },
  { value: 4, label: 'Critique', color: 'bg-red-100 text-red-800', description: 'Incident grave avec risques importants' },
  { value: 5, label: 'Urgence', color: 'bg-red-200 text-red-900', description: 'Urgence absolue - intervention immédiate requise' }
];

function IncidentForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: '',
    latitude: '',
    longitude: '',
    address: '',
    tags: [],
    estimatedAffectedPeople: ''
  });
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef(null);

  // Obtenir la localisation automatiquement à l'ouverture
  useEffect(() => {
    if (isOpen && !formData.latitude && !formData.longitude) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));

        // Géocodage inverse pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr`
          );
          const data = await response.json();
          if (data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name
            }));
          }
        } catch (error) {
          console.error('Erreur lors du géocodage inverse:', error);
        }

        setLocationLoading(false);
        toast.success('Localisation obtenue avec succès');
      },
      (error) => {
        setLocationLoading(false);
        toast.error('Impossible d\'obtenir votre localisation');
        console.error('Erreur de géolocalisation:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (photos.length + files.length > 5) {
      toast.error('Maximum 5 photos autorisées');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          file,
          preview: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }
    if (!formData.category) {
      toast.error('La catégorie est requise');
      return;
    }
    if (!formData.severity) {
      toast.error('Le niveau de gravité est requis');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      toast.error('La localisation est requise');
      return;
    }

    setLoading(true);

    try {
      // Simulation d'envoi des données
      const incidentData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        severity: parseInt(formData.severity),
        estimatedAffectedPeople: formData.estimatedAffectedPeople ? 
          parseInt(formData.estimatedAffectedPeople) : undefined,
        photos: photos.map(photo => photo.file),
        timestamp: new Date().toISOString()
      };

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Données de l\'incident:', incidentData);
      
      toast.success('Incident signalé avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        description: '',
        category: '',
        severity: '',
        latitude: '',
        longitude: '',
        address: '',
        tags: [],
        estimatedAffectedPeople: ''
      });
      setPhotos([]);
      setCurrentTag('');
      
      onClose();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error('Erreur lors de l\'envoi du rapport');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = INCIDENT_CATEGORIES.find(cat => cat.value === formData.category);
  const selectedSeverity = SEVERITY_LEVELS.find(sev => sev.value === parseInt(formData.severity));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Signaler un incident
          </DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour signaler un incident aux autorités compétentes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de l'incident *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Inondation dans le centre-ville"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez l'incident en détail..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{category.icon}</span>
                          {category.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCategory && (
                  <Badge variant="outline" className="mt-2">
                    {selectedCategory.icon} {selectedCategory.label}
                  </Badge>
                )}
              </div>

              <div>
                <Label htmlFor="severity">Niveau de gravité *</Label>
                <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner la gravité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value.toString()}>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${level.color.split(' ')[0]}`} />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSeverity && (
                  <div className="mt-2">
                    <Badge className={selectedSeverity.color}>
                      {selectedSeverity.label}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{selectedSeverity.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Localisation *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                Localisation actuelle
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="36.7538"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="3.0588"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse ou description du lieu"
                className="mt-1"
              />
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4">
            <Label>Photos (optionnel, max 5)</Label>
            
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Cliquez pour ajouter des photos ou glissez-déposez
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG jusqu'à 5MB chacune
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label>Tags (optionnel)</Label>
            <div className="flex space-x-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Ajouter
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Personnes affectées */}
          <div>
            <Label htmlFor="estimatedAffectedPeople">Nombre estimé de personnes affectées (optionnel)</Label>
            <Input
              id="estimatedAffectedPeople"
              type="number"
              min="0"
              value={formData.estimatedAffectedPeople}
              onChange={(e) => handleInputChange('estimatedAffectedPeople', e.target.value)}
              placeholder="Ex: 50"
              className="mt-1"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Signaler l'incident
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default IncidentForm;

