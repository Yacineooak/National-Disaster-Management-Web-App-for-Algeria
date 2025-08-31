import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Settings,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  Target,
  Zap,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.profile?.phone || '',
    city: user?.profile?.city || '',
    state: user?.profile?.state || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast.success('Profil mis à jour avec succès');
        setEditing(false);
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.profile?.phone || '',
      city: user?.profile?.city || '',
      state: user?.profile?.state || ''
    });
    setEditing(false);
  };

  const getBadgeRarityColor = (rarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800',
      rare: 'bg-blue-100 text-blue-800',
      epic: 'bg-purple-100 text-purple-800',
      legendary: 'bg-yellow-100 text-yellow-800'
    };
    return colors[rarity] || colors.common;
  };

  const getRoleText = (role) => {
    const roles = {
      citizen: 'Citoyen',
      government: 'Gouvernement',
      ngo: 'ONG',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const getNextLevelProgress = () => {
    const currentLevel = user?.profile?.gamification?.level || 1;
    const currentPoints = user?.profile?.gamification?.points || 0;
    const pointsForNextLevel = currentLevel * 200; // 200 points par niveau
    const pointsInCurrentLevel = currentPoints % pointsForNextLevel;
    return (pointsInCurrentLevel / pointsForNextLevel) * 100;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête du profil */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <Badge variant="outline">
                    {getRoleText(user.role)}
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-green-100 text-green-800">
                      Vérifié
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {user.email}
                  </div>
                  {user.profile?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {user.profile.phone}
                    </div>
                  )}
                  {user.profile?.city && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.profile.city}, {user.profile.state}
                    </div>
                  )}
                </div>

                {/* Statistiques de gamification */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.profile?.gamification?.level || 1}
                    </div>
                    <div className="text-xs text-gray-500">Niveau</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {user.profile?.gamification?.points || 0}
                    </div>
                    <div className="text-xs text-gray-500">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.profile?.gamification?.badges?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500">Badges</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {user.profile?.gamification?.reportsCount || 0}
                    </div>
                    <div className="text-xs text-gray-500">Rapports</div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setEditing(!editing)}
                variant="outline"
                className="self-start"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Onglets du profil */}
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          {/* Onglet Informations */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!editing}
                      className="mt-1"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Gamification */}
          <TabsContent value="gamification">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Niveau {user.profile?.gamification?.level || 1}</span>
                      <span>Niveau {(user.profile?.gamification?.level || 1) + 1}</span>
                    </div>
                    <Progress value={getNextLevelProgress()} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(getNextLevelProgress())}% vers le niveau suivant
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">
                        {user.profile?.gamification?.verifiedReports || 0}
                      </div>
                      <div className="text-sm text-gray-600">Rapports vérifiés</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-600">
                        {user.profile?.gamification?.streak || 0}
                      </div>
                      <div className="text-sm text-gray-600">Série active</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Badges obtenus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.profile?.gamification?.badges?.length > 0 ? (
                    <div className="space-y-3">
                      {user.profile.gamification.badges.map((badge) => (
                        <div key={badge.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Award className="w-6 h-6 text-yellow-500" />
                            <div>
                              <p className="font-medium">{badge.name}</p>
                              <Badge className={getBadgeRarityColor(badge.rarity)}>
                                {badge.rarity === 'common' ? 'Commun' :
                                 badge.rarity === 'rare' ? 'Rare' :
                                 badge.rarity === 'epic' ? 'Épique' : 'Légendaire'}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(badge.earnedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun badge obtenu pour le moment</p>
                      <p className="text-sm">Signalez des incidents pour gagner des badges !</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Activité */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simulation d'activités récentes */}
                  {[
                    { type: 'report', title: 'Incident signalé', description: 'Inondation signalée à Alger Centre', time: '2h' },
                    { type: 'badge', title: 'Badge obtenu', description: 'Observateur Vigilant', time: '1j' },
                    { type: 'verification', title: 'Rapport vérifié', description: 'Votre rapport d\'accident a été vérifié', time: '2j' },
                    { type: 'level', title: 'Niveau supérieur', description: 'Vous avez atteint le niveau 8', time: '3j' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'report' ? 'bg-blue-100' :
                        activity.type === 'badge' ? 'bg-yellow-100' :
                        activity.type === 'verification' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {activity.type === 'report' && <MapPin className="w-5 h-5 text-blue-600" />}
                        {activity.type === 'badge' && <Award className="w-5 h-5 text-yellow-600" />}
                        {activity.type === 'verification' && <Star className="w-5 h-5 text-green-600" />}
                        {activity.type === 'level' && <TrendingUp className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        Il y a {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;

