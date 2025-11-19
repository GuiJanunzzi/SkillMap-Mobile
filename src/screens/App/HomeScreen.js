import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { signOut } = useContext(AuthContext);

  const MenuCard = ({ title, subtitle, icon, color, onPress }) => (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Feather name={icon} size={24} color="#FFF" />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={24} color="#DDD" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho de Boas Vindas */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, Profissional</Text>
        <Text style={styles.headerTitle}>Sua Jornada Verde</Text>
      </View>

      {/* Cards de Ação */}
      <View style={styles.content}>
        
        <Text style={styles.sectionTitle}>MEU PERFIL</Text>
        
        <MenuCard 
          title="Minhas Habilidades" 
          subtitle="O que eu já sei (Upskilling)" 
          icon="briefcase" 
          color="#1976D2" 
          onPress={() => navigation.navigate('Skills')}
        />

        <MenuCard 
          title="Metas de Carreira" 
          subtitle="Onde quero chegar (Reskilling)" 
          icon="target" 
          color="#F57C00" 
          onPress={() => navigation.navigate('Goals')}
        />

        <Text style={styles.sectionTitle}>INTELIGÊNCIA ARTIFICIAL</Text>

        <MenuCard 
          title="Coach de Carreira" 
          subtitle="Plano personalizado via IA" 
          icon="cpu" 
          color="#2E7D32" 
          onPress={() => navigation.navigate('AiCoach')}
        />

        <Text style={styles.sectionTitle}>SISTEMA</Text>

        <MenuCard 
          title="Sobre o App" 
          subtitle="Versão e Desenvolvedores" 
          icon="info" 
          color="#607D8B" 
          onPress={() => navigation.navigate('About')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#2E7D32', padding: 25, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  welcomeText: { color: '#A5D6A7', fontSize: 14, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 26, fontWeight: 'bold' },
  content: { padding: 20, marginTop: -10 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#999', marginBottom: 10, marginTop: 10, letterSpacing: 1 },
  card: { backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3, borderLeftWidth: 5 },
  iconBox: { width: 50, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardSubtitle: { fontSize: 12, color: '#666' },
  logoutButton: { marginTop: 20, alignItems: 'center', padding: 15, marginBottom: 30 },
  logoutText: { color: '#D32F2F', fontWeight: 'bold' }
});