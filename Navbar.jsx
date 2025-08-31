import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertTriangle,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  BarChart3,
  MapPin,
  Plus,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';

function Navbar({ onReportIncident }) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    {
      name: 'Carte',
      href: '/',
      icon: MapPin,
      current: location.pathname === '/'
    },
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: BarChart3,
      current: location.pathname === '/dashboard',
      requireAuth: true
    }
  ];

  const getRoleText = (role) => {
    const roles = {
      citizen: 'Citoyen',
      government: 'Gouvernement',
      ngo: 'ONG',
      admin: 'Administrateur'
    };
    return roles[role] || role;
  };

  const getRoleBadgeVariant = (role) => {
    const variants = {
      citizen: 'default',
      government: 'destructive',
      ngo: 'secondary',
      admin: 'outline'
    };
    return variants[role] || 'default';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Gestion des Catastrophes
                </h1>
                <p className="text-xs text-gray-500">République Algérienne</p>
              </div>
            </Link>
          </div>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              if (item.requireAuth && !user) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-3">
            {/* Bouton de rapport d'incident */}
            <Button
              onClick={onReportIncident}
              size="sm"
              className="hidden sm:flex bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Signaler
            </Button>

            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem key={notification.id} className="flex-col items-start p-3">
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleString('fr-FR')}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    ) : (
                      <DropdownMenuItem disabled>
                        Aucune notification
                      </DropdownMenuItem>
                    )}
                    {notifications.length > 5 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center text-blue-600">
                          Voir toutes les notifications
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Menu utilisateur */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                          {getRoleText(user.role)}
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Paramètres
                    </DropdownMenuItem>
                    {(user.role === 'government' || user.role === 'ngo' || user.role === 'admin') && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          Administration
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Inscription</Link>
                </Button>
              </div>
            )}

            {/* Menu mobile */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigation et actions rapides
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Bouton de rapport mobile */}
                  <Button
                    onClick={() => {
                      onReportIncident();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Signaler un incident
                  </Button>

                  {/* Navigation mobile */}
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      if (item.requireAuth && !user) return null;
                      
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            item.current
                              ? 'bg-red-100 text-red-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Actions utilisateur mobile */}
                  {user ? (
                    <div className="pt-4 border-t space-y-2">
                      <div className="px-3 py-2">
                        <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs mt-1">
                          {getRoleText(user.role)}
                        </Badge>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        Inscription
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

