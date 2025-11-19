import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao SkillMap!</Text>
      <Text style={styles.subtitle}>Gerencie suas competências</Text>

      <View style={styles.menu}>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('Skills')}
        >
          <Text style={styles.cardTitle}>Minhas Habilidades</Text>
          <Text style={styles.cardDesc}>Gerenciar lista de skills</Text>
        </TouchableOpacity>

        {/* Espaço para outras funcionalidades futuras */}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sair do App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  menu: { flex: 1 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 5 },
  logoutButton: { padding: 15, alignItems: 'center' },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' }
});