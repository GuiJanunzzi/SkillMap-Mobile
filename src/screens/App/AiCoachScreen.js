import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

export default function AiCoachScreen() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useContext(AuthContext);

  const handleGetAdvice = async () => {
    if (!userInfo?.id) return;

    setLoading(true);
    setAdvice(null); // Limpa o conselho anterior visualmente

    try {
      const response = await api.get(`/usuarios/${userInfo.id}/conselho-carreira`);
      
      console.log("Resposta da IA:", response.data);

      // Tenta pegar pelas chaves padrões
      let adviceText = response.data.conselho || response.data.advice;

      // Se não achou, pega o PRIMEIRO valor que vier no JSON (garante que funciona independente da chave)
      if (!adviceText) {
        const values = Object.values(response.data);
        if (values.length > 0) {
            adviceText = values[0];
        }
      }

      setAdvice(adviceText);

    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || 'O Coach IA está indisponível no momento.';
      Alert.alert('Ops!', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Feather name="cpu" size={50} color="#2E7D32" />
        <Text style={styles.title}>Coach de Carreira IA</Text>
        <Text style={styles.subtitle}>
          Conecte suas habilidades atuais com as oportunidades do setor de Energia Sustentável.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Como funciona?</Text>
        <Text style={styles.cardText}>
          Nossa IA analisa seu perfil atual e suas metas de aprendizado para sugerir o caminho mais rápido para sua recolocação no mercado verde.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleGetAdvice} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <View style={styles.btnContent}>
              <Feather name="zap" size={20} color="#FFF" style={{marginRight: 10}} />
              <Text style={styles.buttonText}>Gerar Plano de Carreira</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Só renderiza se advice tiver valor real (não null/undefined/vazio) */}
      {advice ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Feather name="check-circle" size={24} color="#2E7D32" />
            <Text style={styles.resultTitle}>Seu Plano Personalizado</Text>
          </View>
          <Text style={styles.adviceText}>{advice}</Text>
        </View>
      ) : null}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F0F4F8', flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1B5E20', marginTop: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#546E7A', textAlign: 'center', marginTop: 5, paddingHorizontal: 10 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginBottom: 10 },
  cardText: { fontSize: 14, color: '#607D8B', lineHeight: 20, marginBottom: 20 },
  button: { backgroundColor: '#2E7D32', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  resultCard: { 
    backgroundColor: '#E8F5E9', 
    padding: 20, 
    borderRadius: 12, 
    elevation: 2, 
    borderWidth: 1, 
    borderColor: '#C8E6C9',
    marginBottom: 30 // Margem extra no final
  },
  resultHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginLeft: 10 },
  adviceText: { fontSize: 15, color: '#263238', lineHeight: 24, textAlign: 'justify' }
});