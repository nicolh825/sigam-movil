// src/app/providers/AuthProvider.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../../core/http/apiClient';

interface User {
  id_usuario: number;
  nombres: string;
  rol: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('sigam_token');
        const storedUser = await SecureStore.getItemAsync('sigam_user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error al cargar la sesión guardada:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredSession();
  }, [], );

  const login = async (newToken: string, userData: User) => {
    if (!userData) {
      console.error("Se intentó hacer login con datos de usuario indefinidos");
      return;
    }
    setToken(newToken);
    setUser(userData);
    await SecureStore.setItemAsync('sigam_token', newToken);
    await SecureStore.setItemAsync('sigam_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync('sigam_token');
    await SecureStore.deleteItemAsync('sigam_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);