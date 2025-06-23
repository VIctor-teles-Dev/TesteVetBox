import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { validateForm } from "../../utils/validation"; // Importa a função de validação
import UserServices from "../../Services/UserServices"; // Importa o serviço de usuário

const userServices = new UserServices(); // Instancia o serviço de usuário

// Função para formatar telefone no padrão (**)\*********
function formatTelefone(value) {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, "");
  // Aplica o padrão (**)*********
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 11)
    return `(${digits.slice(0, 2)})${digits.slice(2, 11)}`;
  return `(${digits.slice(0, 2)})${digits.slice(2, 11)}`;
}

export default function Create({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  // Simulação de "banco" local (apenas para exemplo)
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const salvarAlteracoes = async (event) => {
    // Verifica se todos os campos estão preenchidos
    if (!nome || !email || !telefone || !senha) {
      Alert.alert("Preencha todos os campos!");
      return() => {
        api.post("/create", {
          nome: nome,
          email: email,
          telefone: telefone,
          senha: senha,
        });
      }
    }
    // Validação dos campos
    if (!validarCampos(nome, email, telefone, senha)) {
      return;
    }
    // Exibe os dados do formulário no console
    console.log({ nome, email, telefone, senha });
    // Adiciona o novo usuário ao array local
    setUsuarios([...usuarios, { nome, email, telefone, senha }]);
    // Mostra um alerta de sucesso
    try {
      setLoading(true);
      const response = await userServices.createUser({
        nome: nome,
        email: email,
        telefone: telefone,
        senha: senha,
      });
      if (response === true) {
        Alert.alert("Sucesso", "Perfil criado com sucesso!");
      }
      console.log("Resposta do servidor:", response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // Mostra mensagem de erro detalhada se disponível
      let msg =
        "Ocorreu um erro ao criar o perfil. Tente novamente mais tarde.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msg += "\n" + error.response.data.message;
      } else if (error.message) {
        msg += "\n" + error.message;
      }
      Alert.alert("Erro", msg);
      // Limpa os campos
      setNome("");
      setEmail("");
      setTelefone("");
      setSenha("");
    }
  };
  const validarCampos = (nome, email, telefone, senha) => {
    const errorMessage = validateForm(nome, email, telefone, senha);
    if (errorMessage) {
      Alert.alert("Erro", errorMessage);
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/LogoVet.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>🌿 crie seu perfil 🌿</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Telefone"
        value={telefone}
        onChangeText={(text) => setTelefone(formatTelefone(text))}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={13} // (**)********* = 13 caracteres
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
      <View style={styles.LoginDiv}>
        <TouchableOpacity
          style={styles.Login}
          onPress={() => navigation.navigate("Inicio")}
        ></TouchableOpacity>
        <TouchableOpacity
          style={styles.Login}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.LoginText}>Faça login em vez disso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#54B154",
    textTransform: "capitalize",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#54B154",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  LoginDiv: {
    width: "50%",
    alignItems: "center",
    marginTop: 50,
  },
  Login: {
    width: "100%",

    alignItems: "center",
    marginTop: 10,
  },
  LoginText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    alignContent: "center",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
