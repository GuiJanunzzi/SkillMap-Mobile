import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  // Lista de Desenvolvedores
  const developers = [
    { name: "Guilherme Janunzi", rm: "558461", githubUser: "GuiJanunzzi" },
    { name: "Caike Dametto", rm: "558614", githubUser: "Dametto98" },
  ];

  // Pega dados do app.json
  const appVersion = Constants.expoConfig?.extra?.appVersion || "1.0.0";
  // Fallback se não estiver configurado no app.json
  const commitHash = Constants.expoConfig?.extra?.commitHash || "Dev Build";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo e Título */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/skillmap-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>O Futuro do Trabalho</Text>
        </View>

        {/* Card de Informações do App */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versão:</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Commit Hash:</Text>
            <Text style={styles.infoValue}>{commitHash}</Text>
          </View>
        </View>

        {/* Lista de Desenvolvedores */}
        <Text style={styles.developersTitle}>Desenvolvedores</Text>

        {developers.map((dev) => (
          <View key={dev.rm} style={styles.devCard}>
            <Image
              source={{ uri: `https://github.com/${dev.githubUser}.png` }}
              style={styles.devAvatar}
            />
            <View style={styles.devInfo}>
              <Text style={styles.devName}>{dev.name}</Text>
              <Text style={styles.devRm}>RM: {dev.rm}</Text>
              <Text style={styles.devGithub}>@{dev.githubUser}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  logoIcon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%",
    borderColor: "#DDD",
    borderWidth: 1,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  developersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  devCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderColor: "#DDD",
    borderWidth: 1,
    width: "100%",
    elevation: 1,
  },
  devAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: "#EEE",
  },
  devInfo: {
    flex: 1,
  },
  devName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  devRm: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  devGithub: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 2,
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: 20,
    marginBottom: 20,
  },
});
