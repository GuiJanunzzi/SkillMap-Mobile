import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../contexts/AuthContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/App/HomeScreen';
import SkillsScreen from '../screens/App/SkillsScreen';
import SkillFormScreen from '../screens/App/SkillFormScreen';
import AboutScreen from '../screens/App/AboutScreen';
import GoalsScreen from '../screens/App/GoalsScreen';
import AiCoachScreen from '../screens/App/AiCoachScreen';

const Stack = createNativeStackNavigator();

function AuthRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Dashboard', headerTitleAlign: 'center' }}
      />
      <Stack.Screen 
        name="Skills" 
        component={SkillsScreen} 
        options={{ title: 'Minhas Habilidades' }}
      />
      <Stack.Screen 
        name="SkillForm" 
        component={SkillFormScreen} 
        options={{ title: 'Gerenciar Habilidade' }}
      />

      <Stack.Screen 
        name="Goals" 
        component={GoalsScreen} 
        options={{ title: 'Metas de Carreira' }} 
      />

      <Stack.Screen 
        name="AiCoach" 
        component={AiCoachScreen} 
        options={{ title: 'Consultoria IA' }} 
      />

      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'Sobre' }} 
      />
    </Stack.Navigator>
  );
}

export default function Routes() {
  const { signed, isLoading } = useContext(AuthContext);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {signed ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}