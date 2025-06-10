import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params || {};
  const [profile, setProfile] = useState({
    nome: "",
    email: "",
    id: null,
    fotoPerfil: null,
    telefone: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  // Buscar dados do usuário ao abrir a tela
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://192.168.100.53:3000/profile?userId=${userId}`)
        .then((res) => {
          setProfile(res.data);
          if (res.data.fotoPerfil) {
            setProfileImage(`data:image/jpeg;base64,${res.data.fotoPerfil}`);
          }
        })
        .catch(() =>
          setProfile({ nome: "", email: "", id: null, fotoPerfil: null, telefone: "" })
        );
    }
  }, [userId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);

      await axios.post("http://192.168.100.53:3000/profile/image", {
        userId: userId,
        imagem: result.assets[0].base64,
      });

      // Atualize a imagem do perfil após upload
      const res = await axios.get(
        `http://192.168.100.53:3000/profile?userId=${userId}`
      );
      setProfile(res.data);
      if (res.data.fotoPerfil) {
        setProfileImage(`data:image/jpeg;base64,${res.data.fotoPerfil}`);
      }
    }
  };

  return (
    <LinearGradient colors={["#87CFEC", "#54B154"]} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../assets/User.png")
              }
              style={styles.profileImage}
            />
            {/* Ícone de edição pode ser adicionado aqui se desejar */}
          </TouchableOpacity>
          <Text style={styles.title}>{profile.nome}</Text>
          <Text style={styles.description}>{profile.email}</Text>
          <Text style={styles.tip}>Toque na foto para alterar</Text>
          <TouchableOpacity
  style={styles.editButton}
  onPress={() =>
    navigation.navigate("EditProfileScreen", {
      userId: profile.id,
      nome: profile.nome,
      email: profile.email,
      telefone: profile.telefone,
    })
  }
>
  <Text style={styles.editButtonText}>Editar Perfil</Text>
</TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 36,
    alignItems: "center",
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    width: 340,
    borderWidth: 2,
    borderColor: "#87CFEC",
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e6f7ef",
    borderWidth: 4,
    borderColor: "#54B154",
    shadowColor: "#87CFEC",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 8,
  },
  // editIconWrapper e editIcon podem ser removidos se não usar ícone
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#54B154",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 17,
    color: "#4a6e5a",
    marginBottom: 12,
    textAlign: "center",
  },
  tip: {
    color: "#87CFEC",
    marginTop: 4,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#54B154",
    paddingVertical: 12,
    paddingHorizontal: 38,
    borderRadius: 22,
    marginTop: 8,
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#87CFEC",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
