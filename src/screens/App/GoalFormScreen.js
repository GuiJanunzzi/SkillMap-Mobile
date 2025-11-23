import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, 
  ActivityIndicator, Modal, FlatList 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalFormScreen({ route, navigation }) {
    
  const { userInfo } = useContext(AuthContext);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  // Seleção
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [mode, setMode] = useState('select');
  const [systemSkills, setSystemSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModalVisible, setSkillModalVisible] = useState(false);

  // Cor do Tema (Laranja para Metas)
  const themeColor = '#F57C00';

  useEffect(() => {
    loadCategories();
    loadSystemSkills();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categorias?size=100');
      setCategories(response.data.content);
    } catch (error) { console.log(error); }
  };

  const loadSystemSkills = async () => {
    try {
      const response = await api.get('/habilidades?size=100');
      setSystemSkills(response.data.content);
    } catch (error) { console.log(error); }
  };

  const handleSave = async () => {
    if (!userInfo?.id) return;
    setLoading(true);

    try {
      if (mode === 'create') {
        if (!nome || !selectedCategory) {
          Alert.alert('Atenção', 'Nome e Categoria são obrigatórios.');
          setLoading(false); return;
        }
        // Cria globalmente
        const createResponse = await api.post('/habilidades', {
          nome, descricao, categoriaId: selectedCategory.id
        });
        // Associa como META
        await api.post(`/usuarios/${userInfo.id}/metas`, {
          habilidadeId: createResponse.data.id
        });
        Alert.alert('Sucesso', 'Nova meta definida!');
      } else {
        if (!selectedSkill) {
          Alert.alert('Atenção', 'Selecione uma habilidade.');
          setLoading(false); return;
        }
        // Associa como META
        await api.post(`/usuarios/${userInfo.id}/metas`, {
          habilidadeId: selectedSkill.id
        });
        Alert.alert('Sucesso', 'Meta definida!');
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedCategory(item); setCategoryModalVisible(false); }}>
      <Text style={styles.modalItemText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderSkillItem = ({ item }) => (
    <TouchableOpacity style={styles.modalItem} onPress={() => { setSelectedSkill(item); setSkillModalVisible(false); }}>
      <Text style={styles.modalItemText}>{item.nome}</Text>
      <Text style={[styles.modalItemSub, { color: themeColor }]}>{item.categoria?.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, { color: themeColor }]}>Nova Meta de Carreira</Text>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, mode === 'select' && styles.activeTab]} onPress={() => setMode('select')}>
          <Text style={[styles.tabText, mode === 'select' && { color: themeColor }]}>Buscar Existente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, mode === 'create' && styles.activeTab]} onPress={() => setMode('create')}>
          <Text style={[styles.tabText, mode === 'create' && { color: themeColor }]}>Criar Nova</Text>
        </TouchableOpacity>
      </View>

      {mode === 'select' ? (
        <View style={styles.formArea}>
          <Text style={styles.label}>Buscar:</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setSkillModalVisible(true)}>
            <Text style={styles.selectButtonText}>{selectedSkill ? selectedSkill.nome : 'Toque para buscar...'}</Text>
            <Feather name="search" size={20} color="#666" />
          </TouchableOpacity>
          {selectedSkill && (
            <View style={styles.selectedInfo}>
              <Text style={styles.infoText}>Categoria: {selectedSkill.categoria?.nome}</Text>
              <Text style={styles.infoText}>Descrição: {selectedSkill.descricao || '-'}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.formArea}>
          <Text style={styles.label}>Nome da Meta *</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Energia Eólica" placeholderTextColor="#666" />
          <Text style={styles.label}>Descrição</Text>
          <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Descrição breve" placeholderTextColor="#666" />
          <Text style={styles.label}>Categoria *</Text>
          <TouchableOpacity style={styles.selectButton} onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.selectButtonText}>{selectedCategory ? selectedCategory.nome : 'Selecione...'}</Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={[styles.button, { backgroundColor: themeColor }]} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Salvar Meta</Text>}
      </TouchableOpacity>

      {/* Modais Reutilizados */}
      <Modal visible={skillModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buscar Habilidade</Text>
            <TouchableOpacity onPress={() => setSkillModalVisible(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
          </View>
          <FlatList data={systemSkills} keyExtractor={item => String(item.id)} renderItem={renderSkillItem} contentContainerStyle={{ padding: 20 }} />
        </SafeAreaView>
      </Modal>

      <Modal visible={categoryModalVisible} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Categorias</Text>
            <TouchableOpacity onPress={() => setCategoryModalVisible(false)}><Feather name="x" size={24} color="#333" /></TouchableOpacity>
          </View>
          <FlatList data={categories} keyExtractor={item => String(item.id)} renderItem={renderCategoryItem} contentContainerStyle={{ padding: 20 }} />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  tabs: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F0F0F0', borderRadius: 8, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { color: '#666', fontWeight: 'bold' },
  formArea: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  selectButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 15, marginBottom: 15, backgroundColor: '#F9F9F9' },
  selectButtonText: { fontSize: 16, color: '#333' },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  selectedInfo: { backgroundColor: '#F0F4F8', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0' },
  infoText: { color: '#555', marginBottom: 5 },
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  modalItemText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  modalItemSub: { fontSize: 14, marginTop: 2 }
});