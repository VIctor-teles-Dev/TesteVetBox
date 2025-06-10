import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { StyleSheet } from "react-native";

export default function ForgotPassword({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Esqueci minha senha</Text>
      <Text style={styles.description}>
        Digite seu e-mail para receber instruções de recuperação de senha.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => Alert.alert("Instruções enviadas para o e-mail!")}
      >
        <Text style={styles.buttonText}>Enviar Instruções</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#54B154",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#54B154",
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
