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

export default function FeedScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState<{ [key: number]: number }>({});
  const [liked, setLiked] = useState<{ [key: number]: boolean }>({});
  const [comments, setComments] = useState<{ [key: number]: string[] }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://192.168.100.53:3000/posts");
      setPosts(res.data);
      // Inicializa likes e comentários para cada post
      const initialLikes: { [key: number]: number } = {};
      const initialLiked: { [key: number]: boolean } = {};
      const initialComments: { [key: number]: string[] } = {};
      const initialInputs: { [key: number]: string } = {};
      res.data.forEach((post: any) => {
        initialLikes[post.id] = 0;
        initialLiked[post.id] = false;
        initialComments[post.id] = [];
        initialInputs[post.id] = "";
      });
      setLikes(initialLikes);
      setLiked(initialLiked);
      setComments(initialComments);
      setCommentInputs(initialInputs);
    } catch {
      setPosts([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().finally(() => setRefreshing(false));
  }, []);

  const handleLike = (postId: number) => {
    setLiked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    setLikes((prev) => ({
      ...prev,
      [postId]: prev[postId] + (liked[postId] ? -1 : 1),
    }));
  };

  const handleCommentInput = (postId: number, text: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: text,
    }));
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), text],
    }));
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
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
          <Text style={[styles.actionText, liked[item.id] && styles.liked]}>
            {liked[item.id] ? "♥" : "♡"} {likes[item.id] || 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Foca no campo de comentário (opcional)
          }}
        >
          <Text style={styles.actionText}>💬 {comments[item.id]?.length || 0}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.commentSection}>
        <FlatList
          data={comments[item.id]}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item: comment }) => (
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>{comment}</Text>
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