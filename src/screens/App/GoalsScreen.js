import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

export default function GoalsScreen({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useContext(AuthContext);

  // Busca o usuário e extrai a lista de METAS
  const loadGoals = async () => {
    if (!userInfo?.id) return;

    setLoading(true);
    try {
      // Usa o ID real do usuário logado
      const response = await api.get(`/usuarios/${userInfo.id}`);
      setGoals(response.data.metas);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar suas metas.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const handleDelete = (metaId) => {
    Alert.alert("Remover Meta", "Deseja desistir desta meta de aprendizado?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            // Endpoint específico de METAS
            await api.delete(`/usuarios/${userInfo.id}/metas/${metaId}`);
            loadGoals();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível remover a meta.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Feather name="target" size={24} color="#FFF" />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.goalName}>{item.nome}</Text>
          <Text style={styles.goalCategory}>{item.categoria?.nome}</Text>
        </View>
      </View>

      {/* Botão de Remover */}
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={{ padding: 5 }}
      >
        <Feather name="trash-2" size={22} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alvos de Aprendizado</Text>
        <Text style={styles.headerSubtitle}>
          Competências necessárias para sua transição.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#F57C00"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="wind" size={40} color="#CCC" />
              <Text style={styles.emptyText}>Nenhuma meta definida ainda.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("GoalForm")}
      >
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  header: { marginBottom: 20, marginTop: 10 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#333" },
  headerSubtitle: { fontSize: 14, color: "#666", marginTop: 5 },
  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 1,
  },
  contentContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F57C00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardContent: { flex: 1 },
  goalName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  goalCategory: { fontSize: 12, color: "#F57C00", fontWeight: "bold" },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { marginTop: 10, color: "#666", fontWeight: "bold" },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#F57C00",
    borderRadius: 28,
    elevation: 8,
  }, // Cor Laranja para Metas
});
