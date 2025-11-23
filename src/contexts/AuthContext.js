import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao abrir o app, verifica se já existe um token salvo
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        // Carrega Token e Dados do Usuário
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          "@SkillMap:token",
          "@SkillMap:user",
        ]);

        if (storedToken[1] && storedUser[1]) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken[1]}`;
          setUserToken(storedToken[1]);
          setUserInfo(JSON.parse(storedUser[1])); // Recupera o objeto usuário
        }
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Função de Login (Conecta com o backend em Java)
  const signIn = async (email, password) => {
    // Chama a rota /auth/login que no Java
    const response = await api.post("/auth/login", { email, senha: password });

    const { token, userId } = response.data;

    const userData = { id: userId, email };

    // Salva no storage e no estado
    await AsyncStorage.multiSet([
      ["@SkillMap:token", token],
      ["@SkillMap:user", JSON.stringify(userData)],
    ]);

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUserToken(token);
    setUserInfo(userData);
  };

  // Função de Logout
  const signOut = async () => {
    await AsyncStorage.multiRemove(["@SkillMap:token", "@SkillMap:user"]);
    setUserToken(null);
    setUserInfo(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!userToken,
        userToken,
        userInfo,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
