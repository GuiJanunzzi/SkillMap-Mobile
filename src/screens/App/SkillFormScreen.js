import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SkillFormScreen({ route, navigation }) {
  const skillId = route.params?.skillId;
  const isEdit = !!skillId;
  const { userInfo } = useContext(AuthContext);

  // Estado do Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados de Seleção (Categoria)
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Estados de Seleção (Habilidade Existente)
  const [mode, setMode] = useState("select"); // 'select' ou 'create'
  const [systemSkills, setSystemSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModalVisible, setSkillModalVisible] = useState(false);

  // Carrega dados iniciais (Categorias e Habilidades do Sistema)
  useEffect(() => {
    loadCategories();

    if (isEdit) {
      setMode("create"); // Edição é sempre manipulação direta
      loadSkillDetails();
    } else {
      loadSystemSkills();
    }
  }, [skillId]);

  const loadCategories = async () => {
    try {
      const response = await api.get("/categorias?size=100");
      setCategories(response.data.content);
    } catch (error) {
      console.log("Erro ao carregar categorias", error);
    }
  };

  const loadSystemSkills = async () => {
    try {
      const response = await api.get("/habilidades?size=100");
      setSystemSkills(response.data.content);
    } catch (error) {
      console.log("Erro ao carregar habilidades do sistema", error);
    }
  };

  const loadSkillDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/habilidades/${skillId}`);
      setNome(response.data.nome);
      setDescricao(response.data.descricao);
      // Define a categoria selecionada baseada no que veio da API
      if (response.data.categoria) {
        setSelectedCategory({
          id: response.data.categoria.id,
          nome: response.data.categoria.nome,
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userInfo?.id) return;
    setLoading(true);

    try {
      // EDIÇÃO
      if (isEdit) {
        if (!selectedCategory) {
          Alert.alert("Atenção", "A categoria é obrigatória.");
          setLoading(false);
          return;
        }
        await api.put(`/habilidades/${skillId}`, {
          nome,
          descricao,
          categoriaId: selectedCategory.id,
        });
        Alert.alert("Sucesso", "Habilidade atualizada!");
      }

      // CRIAR NOVA
      else if (mode === "create") {
        if (!nome || !selectedCategory) {
          Alert.alert("Atenção", "Nome e Categoria são obrigatórios.");
          setLoading(false);
          return;
        }

        // Cria a habilidade globalmente
        const createResponse = await api.post("/habilidades", {
          nome,
          descricao,
          categoriaId: selectedCategory.id,
        });

        // Associa ao usuário
        await api.post(`/usuarios/${userInfo.id}/habilidades`, {
          habilidadeId: createResponse.data.id,
        });
        Alert.alert("Sucesso", "Nova habilidade criada e adicionada!");
      }

      // SELECIONAR EXISTENTE
      else {
        if (!selectedSkill) {
          Alert.alert("Atenção", "Selecione uma habilidade da lista.");
          setLoading(false);
          return;
        }
        await api.post(`/usuarios/${userInfo.id}/habilidades`, {
          habilidadeId: selectedSkill.id,
        });
        Alert.alert("Sucesso", "Habilidade adicionada ao seu perfil!");
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);
      const msg = error.response?.data?.message || "Não foi possível salvar.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedCategory(item);
        setCategoryModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  const renderSkillItem = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedSkill(item);
        setSkillModalVisible(false);
      }}
    >
      <Text style={styles.modalItemText}>{item.nome}</Text>
      <Text style={styles.modalItemSub}>{item.categoria?.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Abas de Seleção (Apenas na Inclusão) */}
      {!isEdit && (
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === "select" && styles.activeTab]}
            onPress={() => setMode("select")}
          >
            <Text
              style={[
                styles.tabText,
                mode === "select" && styles.activeTabText,
              ]}
            >
              Buscar Existente
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === "create" && styles.activeTab]}
            onPress={() => setMode("create")}
          >
            <Text
              style={[
                styles.tabText,
                mode === "create" && styles.activeTabText,
              ]}
            >
              Criar Nova
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- FORMULÁRIO: BUSCAR EXISTENTE --- */}
      {mode === "select" && !isEdit ? (
        <View style={styles.formArea}>
          <Text style={styles.label}>Habilidade:</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setSkillModalVisible(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedSkill ? selectedSkill.nome : "Toque para buscar..."}
            </Text>
            <Feather name="search" size={20} color="#666" />
          </TouchableOpacity>

          {selectedSkill && (
            <View style={styles.selectedInfo}>
              <Text style={styles.infoText}>
                Categoria: {selectedSkill.categoria?.nome}
              </Text>
              <Text style={styles.infoText}>
                Descrição: {selectedSkill.descricao || "-"}
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* --- FORMULÁRIO: CRIAR / EDITAR --- */
        <View style={styles.formArea}>
          <Text style={styles.label}>Nome da Habilidade *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: React Native"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Ex: Framework Mobile"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Categoria *</Text>
          {/* Botão que abre o Modal de Categorias */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedCategory
                ? selectedCategory.nome
                : "Selecione uma categoria..."}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>

      {/* --- MODAL DE HABILIDADES --- */}
      <Modal
        visible={skillModalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buscar Habilidade</Text>
            <TouchableOpacity onPress={() => setSkillModalVisible(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={systemSkills}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderSkillItem}
            contentContainerStyle={{ padding: 20 }}
          />
        </SafeAreaView>
      </Modal>

      {/* --- MODAL DE CATEGORIAS --- */}
      <Modal
        visible={categoryModalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione a Categoria</Text>
            <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCategoryItem}
            contentContainerStyle={{ padding: 20 }}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 6 },
  activeTab: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { color: "#666", fontWeight: "bold" },
  activeTabText: { color: "#2E7D32" },
  formArea: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  selectButtonText: { fontSize: 16, color: "#333" },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  selectedInfo: {
    backgroundColor: "#F0F4F8",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  infoText: { color: "#555", marginBottom: 5 },

  // Estilos dos Modais
  modalContainer: { flex: 1, backgroundColor: "#FFF" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalItemText: { fontSize: 16, color: "#333" },
  modalItemSub: { fontSize: 14, color: "#2E7D32", marginTop: 2 },
});
