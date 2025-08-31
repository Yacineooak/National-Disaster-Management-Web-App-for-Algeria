import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Target,
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange, selectedRegion]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Simulation de données de tableau de bord
    const mockData = {
      overview: {
        totalIncidents: 1247,
        activeIncidents: 89,
        resolvedIncidents: 1158,
        totalUsers: 15420,
        verifiedReporters: 3240,
        averageResponseTime: 24, // minutes
        trendsData: [
          { date: '2024-01-01', incidents: 45, resolved: 42 },
          { date: '2024-01-02', incidents: 52, resolved: 48 },
          { date: '2024-01-03', incidents: 38, resolved: 41 },
          { date: '2024-01-04', incidents: 67, resolved: 59 },
          { date: '2024-01-05', incidents: 43, resolved: 45 },
          { date: '2024-01-06', incidents: 58, resolved: 52 },
          { date: '2024-01-07', incidents: 71, resolved: 63 }
        ]
      },
      incidentsByCategory: [
        { name: 'Inondations', value: 342, color: '#3b82f6' },
        { name: 'Incendies', value: 198, color: '#ef4444' },
        { name: 'Accidents', value: 287, color: '#f59e0b' },
        { name: 'Séismes', value: 156, color: '#8b5cf6' },
        { name: 'Tempêtes', value: 123, color: '#10b981' },
        { name: 'Autres', value: 141, color: '#6b7280' }
      ],
      incidentsBySeverity: [
        { severity: 'Faible', count: 456, color: '#10b981' },
        { severity: 'Moyen', count: 387, color: '#f59e0b' },
        { severity: 'Élevé', count: 234, color: '#f97316' },
        { severity: 'Critique', count: 123, color: '#ef4444' },
        { severity: 'Urgence', count: 47, color: '#dc2626' }
      ],
      regionStats: [
        { region: 'Alger', incidents: 234, riskLevel: 'high', population: 3500000 },
        { region: 'Oran', incidents: 156, riskLevel: 'medium', population: 1500000 },
        { region: 'Constantine', incidents: 98, riskLevel: 'medium', population: 1200000 },
        { region: 'Annaba', incidents: 67, riskLevel: 'low', population: 800000 },
        { region: 'Blida', incidents: 89, riskLevel: 'medium', population: 900000 },
        { region: 'Batna', incidents: 45, riskLevel: 'low', population: 600000 }
      ],
      gamificationStats: {
        topReporters: [
          { id: 1, name: 'Ahmed Benali', reports: 47, badges: 12, level: 8 },
          { id: 2, name: 'Fatima Khelil', reports: 39, badges: 9, level: 7 },
          { id: 3, name: 'Mohamed Saidi', reports: 34, badges: 8, level: 6 },
          { id: 4, name: 'Aicha Meziane', reports: 28, badges: 6, level: 5 },
          { id: 5, name: 'Youcef Brahimi', reports: 25, badges: 5, level: 5 }
        ],
        badgeDistribution: [
          { name: 'Rapporteur Novice', count: 1240, rarity: 'common' },
          { name: 'Observateur Vigilant', count: 456, rarity: 'rare' },
          { name: 'Héros Local', count: 123, rarity: 'epic' },
          { name: 'Gardien de la Sécurité', count: 34, rarity: 'legendary' }
        ]
      }
    };

    // Simuler un délai de chargement
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getChangePercentage = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-200 text-red-900'
    };
    return colors[level] || colors.low;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-2 text-gray-600">
                Vue d'ensemble des incidents et statistiques
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7 jours</SelectItem>
                  <SelectItem value="30d">30 jours</SelectItem>
                  <SelectItem value="90d">3 mois</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={loadDashboardData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.totalIncidents.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12.5% par rapport au mois dernier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidents actifs</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{dashboardData.overview.activeIncidents}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                -8.2% par rapport à hier
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +5.7% nouveaux utilisateurs
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps de réponse moyen</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.overview.averageResponseTime}min</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                -15% amélioration
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="regions">Régions</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des tendances */}
              <Card>
                <CardHeader>
                  <CardTitle>Tendances des incidents</CardTitle>
                  <CardDescription>Évolution sur les 7 derniers jours</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dashboardData.overview.trendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="incidents" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Incidents signalés" />
                      <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Incidents résolus" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Répartition par catégorie */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Types d'incidents les plus fréquents</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.incidentsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData.incidentsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par gravité */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par niveau de gravité</CardTitle>
                <CardDescription>Distribution des incidents selon leur gravité</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.incidentsBySeverity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="severity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6">
                      {dashboardData.incidentsBySeverity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Incidents */}
          <TabsContent value="incidents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Incidents récents</CardTitle>
                  <CardDescription>Liste des derniers incidents signalés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, title: 'Inondation Alger Centre', severity: 4, status: 'active', time: '2h' },
                      { id: 2, title: 'Incendie forêt Blida', severity: 5, status: 'resolved', time: '4h' },
                      { id: 3, title: 'Accident autoroute A1', severity: 3, status: 'active', time: '1h' },
                      { id: 4, title: 'Séisme Constantine', severity: 2, status: 'verified', time: '6h' },
                      { id: 5, title: 'Tempête Oran', severity: 3, status: 'active', time: '3h' }
                    ].map((incident) => (
                      <div key={incident.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            incident.severity >= 4 ? 'bg-red-500' : 
                            incident.severity >= 3 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`} />
                          <div>
                            <p className="font-medium">{incident.title}</p>
                            <p className="text-sm text-gray-500">Il y a {incident.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={incident.status === 'active' ? 'destructive' : 
                                        incident.status === 'resolved' ? 'default' : 'secondary'}>
                            {incident.status === 'active' ? 'Actif' : 
                             incident.status === 'resolved' ? 'Résolu' : 'Vérifié'}
                          </Badge>
                          <Button variant="outline" size="sm">Voir</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Créer une alerte
                  </Button>
                  <Button className="w-full" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir sur la carte
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer incidents
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter rapport
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Régions */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques par région</CardTitle>
                <CardDescription>Analyse des incidents par wilaya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.regionStats.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{region.region}</h3>
                          <p className="text-sm text-gray-500">
                            {region.population.toLocaleString()} habitants
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{region.incidents} incidents</p>
                          <Badge className={getRiskLevelColor(region.riskLevel)}>
                            {region.riskLevel === 'low' ? 'Faible' :
                             region.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Gamification */}
          <TabsContent value="gamification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top rapporteurs */}
              <Card>
                <CardHeader>
                  <CardTitle>Top rapporteurs</CardTitle>
                  <CardDescription>Utilisateurs les plus actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.gamificationStats.topReporters.map((reporter, index) => (
                      <div key={reporter.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{reporter.name}</p>
                            <p className="text-sm text-gray-500">Niveau {reporter.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{reporter.reports} rapports</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Award className="w-3 h-3 mr-1" />
                            {reporter.badges} badges
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Distribution des badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribution des badges</CardTitle>
                  <CardDescription>Badges obtenus par les utilisateurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.gamificationStats.badgeDistribution.map((badge, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <div>
                            <p className="font-medium">{badge.name}</p>
                            <Badge className={getBadgeRarityColor(badge.rarity)}>
                              {badge.rarity === 'common' ? 'Commun' :
                               badge.rarity === 'rare' ? 'Rare' :
                               badge.rarity === 'epic' ? 'Épique' : 'Légendaire'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{badge.count}</p>
                          <p className="text-sm text-gray-500">utilisateurs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;

