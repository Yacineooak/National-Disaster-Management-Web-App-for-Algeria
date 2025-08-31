import React, { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Simuler la vérification du token
        const mockUser = {
          id: '1',
          email: 'ahmed.benali@email.com',
          username: 'ahmed_benali',
          firstName: 'Ahmed',
          lastName: 'Benali',
          role: 'citizen',
          isVerified: true,
          profile: {
            avatar: null,
            phone: '+213555123456',
            city: 'Alger',
            state: 'Alger',
            gamification: {
              points: 1250,
              level: 8,
              badges: [
                { id: '1', name: 'Premier rapport', rarity: 'common', earnedAt: '2024-01-15' },
                { id: '2', name: 'Observateur vigilant', rarity: 'rare', earnedAt: '2024-01-20' },
                { id: '3', name: 'Héros local', rarity: 'epic', earnedAt: '2024-01-25' }
              ],
              reportsCount: 47,
              verifiedReports: 42,
              streak: 15
            }
          }
        };
        setUser(mockUser);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simuler l'appel API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: '1',
        email: credentials.email,
        username: 'ahmed_benali',
        firstName: 'Ahmed',
        lastName: 'Benali',
        role: 'citizen',
        isVerified: true,
        profile: {
          avatar: null,
          phone: '+213555123456',
          city: 'Alger',
          state: 'Alger',
          gamification: {
            points: 1250,
            level: 8,
            badges: [
              { id: '1', name: 'Premier rapport', rarity: 'common', earnedAt: '2024-01-15' },
              { id: '2', name: 'Observateur vigilant', rarity: 'rare', earnedAt: '2024-01-20' },
              { id: '3', name: 'Héros local', rarity: 'epic', earnedAt: '2024-01-25' }
            ],
            reportsCount: 47,
            verifiedReports: 42,
            streak: 15
          }
        }
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      setUser(mockUser);
      
      return { success: true, user: mockUser, token: mockToken };
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Identifiants invalides' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Simuler l'appel API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'citizen',
        isVerified: false,
        profile: {
          avatar: null,
          phone: userData.phone || null,
          city: userData.city || null,
          state: userData.state || null,
          gamification: {
            points: 0,
            level: 1,
            badges: [],
            reportsCount: 0,
            verifiedReports: 0,
            streak: 0
          }
        }
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('authToken', mockToken);
      setUser(newUser);
      
      return { success: true, user: newUser, token: mockToken };
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      // Simuler l'appel API de mise à jour du profil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...profileData,
        profile: {
          ...user.profile,
          ...profileData
        }
      };
      
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

