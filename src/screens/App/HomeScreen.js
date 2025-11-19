import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo ao SkillMap!</Text>
      <Text style={styles.subtext}>Você está logado.</Text>
      
      <View style={{ marginTop: 20, width: '100%' }}>
        <Button title="Sair (Logout)" onPress={signOut} color="#d32f2f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 16, color: '#666', marginBottom: 30 }
});