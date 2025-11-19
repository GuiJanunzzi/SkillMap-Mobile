import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons'; 
import api from '../../services/api';

export default function SkillsScreen({ navigation }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const response = await api.get('/habilidades');
      setSkills(response.data.content); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as habilidades.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadSkills();
  }, []));

  const handleDelete = (id) => {
    Alert.alert('Excluir', 'Tem certeza que deseja excluir esta habilidade?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sim', 
        onPress: async () => {
          try {
            await api.delete(`/habilidades/${id}`);
            loadSkills(); 
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir. Verifique se a habilidade está em uso.');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.skillName}>{item.nome}</Text>
        <Text style={styles.skillDesc}>{item.descricao || 'Sem descrição'}</Text>
        <Text style={styles.skillCategory}>Categoria ID: {item.categoria?.id}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('SkillForm', { skillId: item.id })}>
          <Feather name="edit" size={24} color="#F57C00" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
          <Feather name="trash-2" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={skills}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma habilidade cadastrada.</Text>}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('SkillForm')}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 10 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardContent: { flex: 1 },
  skillName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  skillDesc: { fontSize: 14, color: '#666', marginVertical: 2 },
  skillCategory: { fontSize: 12, color: '#2E7D32', fontWeight: 'bold' },
  actions: { flexDirection: 'row' },
  fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#2E7D32', borderRadius: 28, elevation: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});