import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAuth } from './useAuth';

const NotificationContext = createContext();

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Simuler les notifications en temps réel
      const interval = setInterval(() => {
        // Générer une notification aléatoire de temps en temps
        if (Math.random() < 0.1) { // 10% de chance toutes les 30 secondes
          generateRandomNotification();
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Simuler le chargement des notifications
      const mockNotifications = [
        {
          id: '1',
          type: 'incident_nearby',
          title: 'Incident à proximité',
          message: 'Un nouvel incident a été signalé à 2km de votre position',
          data: { incidentId: 'inc_123', distance: 2000 },
          isRead: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 min ago
        },
        {
          id: '2',
          type: 'badge_earned',
          title: 'Nouveau badge obtenu !',
          message: 'Félicitations ! Vous avez obtenu le badge "Observateur Vigilant"',
          data: { badgeId: 'badge_vigilant' },
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
        },
        {
          id: '3',
          type: 'incident_update',
          title: 'Mise à jour d\'incident',
          message: 'L\'incident que vous avez signalé a été vérifié par les autorités',
          data: { incidentId: 'inc_456', status: 'verified' },
          isRead: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4h ago
        },
        {
          id: '4',
          type: 'level_up',
          title: 'Niveau supérieur !',
          message: 'Vous avez atteint le niveau 8 ! Continuez vos excellents rapports.',
          data: { newLevel: 8, points: 1250 },
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: '5',
          type: 'emergency_alert',
          title: 'Alerte d\'urgence',
          message: 'Alerte inondation dans votre région. Évitez les zones basses.',
          data: { alertLevel: 'high', region: 'Alger' },
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomNotification = () => {
    const randomNotifications = [
      {
        type: 'incident_nearby',
        title: 'Nouvel incident signalé',
        message: 'Un incident a été signalé dans votre zone',
        data: { incidentId: `inc_${Date.now()}` }
      },
      {
        type: 'system',
        title: 'Mise à jour système',
        message: 'L\'application a été mise à jour avec de nouvelles fonctionnalités',
        data: { version: '1.2.0' }
      },
      {
        type: 'incident_update',
        title: 'Incident résolu',
        message: 'Un incident dans votre région a été résolu',
        data: { incidentId: `inc_${Date.now() - 1000}`, status: 'resolved' }
      }
    ];

    const randomNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    const newNotification = {
      id: Date.now().toString(),
      ...randomNotif,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Afficher une notification toast si l'utilisateur est sur la page
    if (document.visibilityState === 'visible') {
      // Ici on pourrait utiliser une bibliothèque de notifications push
      console.log('Nouvelle notification:', newNotification);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      
      setUnreadCount(0);
      
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const notificationToDelete = notifications.find(n => n.id === notificationId);
      
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const sendNotification = async (notificationData) => {
    try {
      // Simuler l'envoi d'une notification
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newNotification = {
        id: Date.now().toString(),
        ...notificationData,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      return { success: true, notification: newNotification };
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      return { success: false, error: 'Erreur lors de l\'envoi' };
    }
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(notif => notif.type === type);
  };

  const getRecentNotifications = (limit = 5) => {
    return notifications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    getNotificationsByType,
    getRecentNotifications,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

