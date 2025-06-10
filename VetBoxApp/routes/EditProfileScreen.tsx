import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

export default function EditProfileScreen({ route, navigation }) {
  const { userId, nome, email, telefone } = route.params;
  const [newNome, setNewNome] = useState(nome);
  const [newEmail, setNewEmail] = useState(email);
  const [newTelefone, setNewTelefone] = useState(telefone);

  const handleSave = async () => {
    try {
      await axios.post("http://192.168.100.53:3000/profile/edit", {
        userId,
        nome: newNome,
        email: newEmail,
        telefone: newTelefone,
      });
      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      console.error("Erro ao atualizar perfil:", err);
      console.log({ userId, nome: newNome, email: newEmail, telefone: newTelefone });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        value={newNome}
        onChangeText={setNewNome}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="E-mail"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={newTelefone}
        onChangeText={setNewTelefone}
        placeholder="Telefone"
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#54B154", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#54B154", borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: "#54B154", borderRadius: 10, padding: 14, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: { alignItems: "center", padding: 10 },
  cancelButtonText: { color: "#54B154", fontSize: 16, textDecorationLine: "underline" },
});