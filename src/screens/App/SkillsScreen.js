import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

export default function SkillsScreen({ navigation }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pegar os dados do usuário logado
  const { userInfo } = useContext(AuthContext);

  const loadSkills = async () => {
    // Segurança: Se não tiver ID, não faz nada
    if (!userInfo?.id) return;

    setLoading(true);
    try {
      // Busca os dados do usuario
      const response = await api.get(`/usuarios/${userInfo.id}`);
      
      // Pega apenas a lista 'habilidadesPossuidas' do Usuário
      setSkills(response.data.habilidadesPossuidas); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar suas habilidades.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadSkills();
  }, []));

  const handleDelete = (skillId) => {
    Alert.alert('Remover', 'Deseja remover esta habilidade do seu perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sim', 
        onPress: async () => {
          try {
            // Chama o endpoint de DESASSOCIAR (Remove do usuário, mantém no banco)
            await api.delete(`/usuarios/${userInfo.id}/habilidades/${skillId}`);
            
            // Recarrega a lista
            loadSkills(); 
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível remover a habilidade.');
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
        <Text style={styles.skillCategory}>Categoria: {item.categoria?.nome}</Text>
      </View>

      <View style={styles.actions}>
        {/* Botão de Edição (Leva para o form global - Opcional manter) */}
        <TouchableOpacity onPress={() => navigation.navigate('SkillForm', { skillId: item.id })}>
          <Feather name="edit" size={24} color="#F57C00" />
        </TouchableOpacity>
        
        {/* Botão de Remover */}
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
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text style={styles.emptyText}>Você ainda não adicionou habilidades.</Text>
            </View>
          }
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
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16 }
});