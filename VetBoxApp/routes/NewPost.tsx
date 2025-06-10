import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// Lembre-se de garantir que a fonte Poppins está instalada e configurada no projeto

export default function NewPost({ navigation, route }) {
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);

  // Supondo que você passe o userId via contexto, props ou route.params
  const { userId } = route.params || {};
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria foi negada!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      // Permite editar a imagem antes de selecionar
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].base64);
    }
  };

  const handlePost = async () => {
    if (!texto) return alert("Digite algo!");
    try {
      await axios.post("http://192.168.100.53:3000/posts", {
        userId: Number(userId),
        texto,
        imagem,
      });
      alert("Post criado!");
      setTexto("");
      setImagem(null);
      navigation.navigate("Feed");
    } catch (e) {
      alert("Erro ao criar post: ");
      console.log("Erro de conexão:", e);
    }
  };

  return (
    <View style={styles.background}>
      {/* Espaço para ilustração flat/outline */}
      <View style={styles.illustrationContainer}>
        {/* Exemplo: <PetFlatSVG width={90} height={90} /> */}
        {/* Ou use uma imagem local: */}
        {/* <Image source={require('../assets/pet-outline.png')} style={styles.illustration} /> */}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Novo Post</Text>
        <TextInput
          style={[styles.description, { borderColor: "#54B154" }]}
          placeholder="O que você está pensando?"
          placeholderTextColor="#54B154"
          multiline
          numberOfLines={4}
          value={texto}
          onChangeText={setTexto}
        />
        {imagem && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imagem}` }}
            style={[styles.previewImage, { borderColor: "#54B154" }]}
          />
        )}
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.button,
            styles.secondaryButton,
            { backgroundColor: "#fff", borderColor: "#54B154" },
          ]}
        >
          <Text style={[styles.secondaryButtonText, { color: "#54B154" }]}>
            Selecionar Imagem
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePost}
          style={[
            styles.button,
            { backgroundColor: "#54B154", borderColor: "#54B154" },
          ]}
        >
          <Text style={styles.buttonText}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#e6f7ef",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: Platform.OS === "android" ? 32 : 0,
  },
  illustration: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    tintColor: "#87CFEC",
    opacity: 0.8,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 28,
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#54B154",
    fontFamily: "Poppins-Bold",
    marginBottom: 18,
    letterSpacing: 0.5,
    textAlign: "center",
  },
  description: {
    borderColor: "#87CFEC",
    borderWidth: 2,
    borderRadius: 18,
    padding: 16,
    marginVertical: 14,
    minHeight: 90,
    textAlignVertical: "top",
    backgroundColor: "#f8fdfb",
    color: "#2d3a4b",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    letterSpacing: 0.2,
    width: "100%",
  },
  previewImage: {
    width: 220,
    height: 180,
    marginVertical: 12,
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#54B154",
    backgroundColor: "#f0faf6",
  },
  button: {
    backgroundColor: "#54B154",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 22,
    marginTop: 14,
    alignItems: "center",
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "#87CFEC",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#87CFEC",
    borderColor: "#54B154",
    marginBottom: 0,
    marginTop: 0,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 0.5,
  },
});
