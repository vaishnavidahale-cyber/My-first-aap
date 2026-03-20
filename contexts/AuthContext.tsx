import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin' | 'host';
  college: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Validate college email format
      const collegeEmailRegex = /@.*\.edu$|@.*college\..*|@.*university\..*|@gmail\.com$/i;
      if (!collegeEmailRegex.test(email)) {
        throw new Error('Please use a valid college email address');
      }

      // Mock authentication - In real app, this would be Firebase Auth
      const mockUsers = [
        {
          id: '1',
          email: 'admin@college.edu',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin' as const,
          college: 'Sample College'
        },
        {
          id: '2',
          email: 'student@college.edu',
          password: 'student123',
          name: 'students',
          role: 'student' as const,
          college: 'Sample College'
        },
        {
          id: '3',
          email: 'host@college.edu',
          password: 'host123',
          name: 'Event Host',
          role: 'host' as const,
          college: 'Sample College'
        }
      ];

      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await AsyncStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};