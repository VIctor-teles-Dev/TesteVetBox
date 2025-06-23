import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function FeedScreen({ route }) { // 1. Aceite a prop 'route'
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // 2. Obtenha o ID do usuário logado dos parâmetros da rota
  const actualUserId = route?.params?.userId;

  // 3. Estado para armazenar os detalhes do perfil do usuário logado
  const [loggedInUserProfile, setLoggedInUserProfile] = useState({
    id: null,
    nome: "Usuário", // Nome padrão enquanto carrega
    fotoPerfil: null,
  });

  // 4. Busque os detalhes do perfil do usuário logado quando actualUserId mudar
  useEffect(() => {
    if (actualUserId) {
      axios.get(`http://192.168.100.53:3000/profile?userId=${actualUserId}`)
        .then(res => {
          setLoggedInUserProfile(res.data);
        })
        .catch(err => console.error("Erro ao buscar perfil do usuário logado:", err));
    }
  }, [actualUserId]);

  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  // Added options parameter with isInitialLoad and silentError
  const fetchPosts = async (options: { isInitialLoad?: boolean, silentError?: boolean } = {}): Promise<boolean> => {
    const { isInitialLoad = false, silentError = false } = options;
    try {
      const res = await axios.get("http://192.168.100.53:3000/posts");
      // Mapeia os posts para incluir a informação se o usuário logado curtiu
      const processedPosts = res.data.map(post => ({
        ...post,
        likedByMe: post.likedBy ? post.likedBy.includes(actualUserId) : false, // Use actualUserId
        likesCount: post.likesCount || 0,
        commentsList: post.commentsList || [],
      }));
      setPosts(processedPosts);

      const initialInputs: { [key: number]: string } = {};
      processedPosts.forEach((post: any) => {
        initialInputs[post.id] = "";
      });
      setCommentInputs(initialInputs);
      return true;
    } catch (error) {
      if (!silentError) {
        console.error("Erro ao buscar posts. Detalhes do erro:");
        if (axios.isAxiosError(error)) {
          console.error("Mensagem:", error.message);
          console.error("Código:", error.code);
          console.error("Config:", JSON.stringify(error.config, null, 2));
          if (error.request) console.error("Request:", JSON.stringify(error.request, null, 2));
          if (error.response) console.error("Response:", JSON.stringify(error.response.data, null, 2));
          console.error("Stack:", error.stack);
        } else {
          console.error("Erro não Axios:", error);
        }
      } else {
        console.warn("Fetch posts failed silently after an action. Detalhes:", error.message, error.code);
      }
      if (isInitialLoad) { // Only clear posts if it was an initial load attempt and it failed
        setPosts([]);
      }
      return false;
    }
  };

  // Helper function to process a single post from the server
  const processSinglePost = (postFromServer, currentUserId) => {
    if (!postFromServer) return null;
    return {
      ...postFromServer,
      likedByMe: postFromServer.likedBy ? postFromServer.likedBy.includes(currentUserId) : false,
      likesCount: postFromServer.likesCount || 0,
      commentsList: postFromServer.commentsList || [],
    };
  };
  useFocusEffect(
    useCallback(() => {
      fetchPosts({ isInitialLoad: true, silentError: false });
    }, [actualUserId]) // Dependa de actualUserId
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts({ silentError: false }) // Not silent on manual refresh
      .finally(() => setRefreshing(false));
  }, [actualUserId]); // Dependa de actualUserId

  const handleLike = async (postId: number) => {
    if (!actualUserId) { // Verifique se o usuário está logado
      console.warn("Tentativa de curtir sem estar logado.");
      // alert("Você precisa estar logado para curtir."); // Removido
      return;
    }

    // Store original state for potential rollback
    const originalPosts = posts;
    const postIndex = originalPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    // Optimistic update
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const likedByMe = !post.likedByMe;
          const likesCount = likedByMe ? (post.likesCount || 0) + 1 : (post.likesCount || 0) - 1;
          return { ...post, likedByMe, likesCount: Math.max(0, likesCount) };
        }
        return post;
      })
    );

    try {
      // Atualiza o estado localmente para feedback imediato
      const response = await axios.post(`http://192.168.100.53:3000/posts/${postId}/like`, {
        userId: actualUserId, // Use actualUserId
      });
      // Action successful. Update the specific post with server data.
      const serverPostResponse = response.data.post;
      const processedServerPost = processSinglePost(serverPostResponse, actualUserId);
      if (processedServerPost) {
        setPosts(prevPosts =>
          prevPosts.map(p => (p.id === postId ? processedServerPost : p))
        );
      }
    } catch (error) {
      console.error(`Erro ao curtir o post ${postId}. Detalhes do erro:`);
      if (axios.isAxiosError(error)) {
        console.error("Mensagem:", error.message);
        console.error("Código:", error.code);
        console.error("Config:", JSON.stringify(error.config, null, 2));
        if (error.request) console.error("Request:", JSON.stringify(error.request, null, 2));
        if (error.response) console.error("Response:", JSON.stringify(error.response.data, null, 2));
        console.error("Stack:", error.stack);
      } else {
        console.error("Erro não Axios ao curtir:", error);
      }
      // Reverter a atualização local em caso de erro
      setPosts(originalPosts);
      // alert("Erro ao curtir o post. Tente novamente."); // Removido
      // Attempt a non-silent fetch to resync after error
      fetchPosts({ silentError: false })
        .catch(e => console.error("Secondary fetch after like error also failed.", e));
    }
  };

  const handleCommentInput = (postId: number, text: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleAddComment = async (postId: number) => {
    if (!actualUserId || !loggedInUserProfile?.id) { // Verifique se o usuário está logado e o perfil foi carregado
      console.warn("Tentativa de comentar sem estar logado ou perfil não carregado.");
      // alert("Você precisa estar logado para comentar."); // Removido
      return;
    }
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const originalPosts = posts; // For rollback
    const originalCommentInputText = commentInputs[postId]; // Save for potential rollback

    const newComment = {
      userId: actualUserId,
      nome: loggedInUserProfile.nome, // Use o nome do perfil carregado
      fotoPerfil: loggedInUserProfile.fotoPerfil, // Use a foto do perfil para atualização otimista
      texto: text,
      data: new Date().toISOString(),
    };

    try {
      // Atualiza o estado localmente
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, commentsList: [newComment, ...(post.commentsList || [])] };
          }
          return post;
        })
      );
      setCommentInputs(prev => ({ ...prev, [postId]: "" })); // Clear input optimistically

      const response = await axios.post(`http://192.168.100.53:3000/posts/${postId}/comment`, {
        userId: actualUserId, // Use actualUserId
        // O backend irá buscar nome e foto pelo userId, não precisa enviar nomeUsuario
        textoComentario: text,
      });
      // Action successful. Update the specific post with server data.
      const serverPostResponse = response.data.post;
      const processedServerPost = processSinglePost(serverPostResponse, actualUserId);
      if (processedServerPost) {
        setPosts(prevPosts =>
          prevPosts.map(p => (p.id === postId ? processedServerPost : p))
        );
      }
    } catch (error) {
      console.error(`Erro ao adicionar comentário ao post ${postId}. Detalhes do erro:`);
      if (axios.isAxiosError(error)) {
        console.error("Mensagem:", error.message);
        console.error("Código:", error.code);
        console.error("Config:", JSON.stringify(error.config, null, 2));
        if (error.request) console.error("Request:", JSON.stringify(error.request, null, 2));
        if (error.response) console.error("Response:", JSON.stringify(error.response.data, null, 2));
        console.error("Stack:", error.stack);
      } else {
        console.error("Erro não Axios ao comentar:", error);
      }
      // Rollback: Restore original posts and the comment input text
      setPosts(originalPosts);
      setCommentInputs(prev => ({ ...prev, [postId]: originalCommentInputText }));
      // alert("Erro ao adicionar comentário. Tente novamente."); // Removido
      fetchPosts({ silentError: false })
        .catch(e => console.error("Secondary fetch after comment error also failed.", e));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image
          source={
            item.fotoPerfil
              ? { uri: `data:image/jpeg;base64,${item.fotoPerfil}` }
              : require("../assets/User.png")
          }
          style={styles.profilePic}
        />
        <Text style={styles.username}>{item.nome || "Usuário"}</Text>
      </View>
      {item.imagem && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
          style={styles.postImage}
        />
      )}
      <Text style={styles.postText}>{item.texto}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id)}
        >
          <Text style={[styles.actionText, item.likedByMe && styles.liked]}>
            {item.likedByMe ? "♥" : "♡"} {item.likesCount || 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Você pode adicionar lógica para focar no TextInput aqui se desejar
          }}
        >
          <Text style={styles.actionText}>💬 {item.commentsList?.length || 0}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commentSection}>
        <FlatList
          data={item.commentsList}
          keyExtractor={(comment, idx) => comment.data + idx.toString()} // Usar algo mais único se possível
          renderItem={({ item: comment}) => (
            <View style={styles.commentContainer}>
              <Image
                source={
                  comment.fotoPerfil
                    ? { uri: `data:image/jpeg;base64,${comment.fotoPerfil}` }
                    : require("../assets/User.png") // Imagem padrão
                }
                style={styles.commentProfilePic}
              />
              <View style={styles.commentBubble}>
                <Text style={styles.commentUsername}>{comment.nome || "Usuário"}</Text>
                <Text style={styles.commentText}>{comment.texto}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={null}
        />
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Comente algo..."
            placeholderTextColor="#54B15499"
            value={commentInputs[item.id]}
            onChangeText={(text) => handleCommentInput(item.id, text)}
            onSubmitEditing={() => handleAddComment(item.id)}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleAddComment(item.id)}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#54B154"]}
            tintColor="#54B154"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum post encontrado.</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  feedContent: {
    padding: 0,
    paddingTop: 24,
    paddingBottom: 40,
  },
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: 24,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#54B15433",
    shadowColor: "#54B154",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginHorizontal: 16,
    elevation: 2,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#f7fff9",
    borderBottomWidth: 1,
    borderBottomColor: "#54B15422",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    marginTop: 4,
  },
  commentProfilePic: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginTop: 2,
  },
  profilePic: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#54B154",
    backgroundColor: "#eafbe7",
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    color: "#54B154",
    letterSpacing: 0.2,
  },
  postImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#f7fff9",
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 0,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#54B15433",
  },
  postText: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#f7fff9",
    fontWeight: "400",
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    letterSpacing: 0.1,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 16,
    gap: 16,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 17,
    color: "#54B154",
    fontWeight: "bold",
  },
  liked: {
    color: "#e74c3c",
  },
  commentSection: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  commentBubble: {
    backgroundColor: "#f7fff9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#54B15422",
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#54B154",
    marginBottom: 2,
  },
  commentText: {
    color: "#222",
    fontSize: 14,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 2,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderColor: "#54B15455",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#222",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#54B154",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: "#54B154",
    fontSize: 17,
    opacity: 0.7,
  },
});