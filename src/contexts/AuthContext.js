import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app, verifica se já existe um token salvo
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@SkillMap:token');
        
        if (storedToken) {
          // Se tem token, já configura o Axios para usar em todas as chamadas
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUserToken(storedToken);
        }
      } catch (error) {
        console.log("Erro ao carregar token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Função de Login (Conecta com o backend em Java)
  const signIn = async (email, password) => {
    // Chama a rota /auth/login que no Java
    const response = await api.post('/auth/login', { email, senha: password });
    
    const { token } = response.data;

    // Salva no storage e no estado
    await AsyncStorage.setItem('@SkillMap:token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUserToken(token);
  };

  // Função de Logout
  const signOut = async () => {
    await AsyncStorage.removeItem('@SkillMap:token');
    setUserToken(null);
    // Limpa o header do axios
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      signed: !!userToken, 
      userToken, 
      signIn, 
      signOut, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};