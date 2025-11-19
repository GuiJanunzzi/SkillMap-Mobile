import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../../services/api';

export default function SkillFormScreen({ route, navigation }) {
  const skillId = route.params?.skillId; // Se vier ID, é edição
  const isEdit = !!skillId;

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); // Input simples para ID
  const [loading, setLoading] = useState(false);

  // Se for edição, carrega os dados atuais
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/habilidades/${skillId}`)
        .then(response => {
          setNome(response.data.nome);
          setDescricao(response.data.descricao);
          setCategoriaId(String(response.data.categoria?.id || ''));
        })
        .catch(() => Alert.alert('Erro', 'Falha ao carregar dados da habilidade.'))
        .finally(() => setLoading(false));
    }
  }, [skillId]);

  const handleSave = async () => {
    if (!nome || !categoriaId) {
      Alert.alert('Atenção', 'Nome e ID da Categoria são obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        // PUT: Atualizar
        await api.put(`/habilidades/${skillId}`, {
          nome,
          descricao,
          categoriaId: parseInt(categoriaId)
        });
        Alert.alert('Sucesso', 'Habilidade atualizada!');
      } else {
        // POST: Criar
        await api.post('/habilidades', {
          nome,
          descricao,
          categoriaId: parseInt(categoriaId)
        });
        Alert.alert('Sucesso', 'Habilidade criada!');
      }
      navigation.goBack(); // Volta para a lista
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar os dados. Verifique se o ID da Categoria existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Habilidade *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Java" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Conhecimento avançado" />

      <Text style={styles.label}>ID da Categoria *</Text>
      <TextInput 
        style={styles.input} 
        value={categoriaId} 
        onChangeText={setCategoriaId} 
        placeholder="Ex: 1" 
        keyboardType="numeric"
      />
      <Text style={styles.hint}>Use '1' para testes (criamos no Insomnia)</Text>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  hint: { fontSize: 12, color: '#888', marginBottom: 20, marginTop: -10 }
});