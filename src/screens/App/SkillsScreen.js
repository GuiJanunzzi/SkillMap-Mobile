import React, { useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

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
      Alert.alert("Erro", "Não foi possível carregar suas habilidades.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSkills();
    }, [])
  );

  const handleDelete = (skillId) => {
    Alert.alert("Remover", "Deseja remover esta habilidade do seu perfil?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          try {
            // Chama o endpoint de DESASSOCIAR (Remove do usuário, mantém no banco)
            await api.delete(`/usuarios/${userInfo.id}/habilidades/${skillId}`);

            // Recarrega a lista
            loadSkills();
          } catch (error) {
            Alert.alert("Erro", "Não foi possível remover a habilidade.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.skillName}>{item.nome}</Text>
        <Text style={styles.skillDesc}>
          {item.descricao || "Sem descrição"}
        </Text>
        <Text style={styles.skillCategory}>
          Categoria: {item.categoria?.nome}
        </Text>
      </View>

      <View style={styles.actions}>
        {/* Botão de Edição (Leva para o form global - Opcional manter) */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SkillForm", { skillId: item.id })}
        >
          <Feather name="edit" size={24} color="#F57C00" />
        </TouchableOpacity>

        {/* Botão de Remover */}
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={{ marginLeft: 15 }}
        >
          <Feather name="trash-2" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* CABECALHO */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Competências</Text>
        <Text style={styles.headerSubtitle}>
          Habilidades técnicas que você já domina.
        </Text>
      </View>
      {/* CARREGAR HABILIDADES */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2E7D32"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={skills}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="clipboard" size={40} color="#CCC" />
              <Text style={styles.emptyText}>
                Nenhuma habilidade registrada.
              </Text>
              <Text style={styles.emptySubText}>
                Adicione o que você já sabe fazer.
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("SkillForm")}
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
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  contentContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  cardContent: { flex: 1 },
  skillName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  skillDesc: { fontSize: 12, color: "#888", marginBottom: 2 },
  skillCategory: { fontSize: 12, color: "#2E7D32", fontWeight: "bold" },
  actions: { flexDirection: "row", alignItems: "center" },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#2E7D32",
    borderRadius: 28,
    elevation: 8,
  },
  emptyContainer: { alignItems: "center", marginTop: 50 },
  emptyText: { marginTop: 10, color: "#666", fontWeight: "bold", fontSize: 16 },
  emptySubText: { fontSize: 12, color: "#999", marginTop: 2 },
});
