const fs = require("fs").promises; // Usar a versão de promessas do fs
const path = require("path");
const postsPath = path.join(__dirname, "../../utils/data/posts.json");
const usersPath = path.join(__dirname, "../../utils/data/userData.json");
const express = require("express");
const router = express.Router();

// Função auxiliar para ler e parsear JSON de forma segura
async function readJsonFile(filePath, defaultData = []) {
  try {
    await fs.access(filePath); // Verifica se o arquivo existe
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent || JSON.stringify(defaultData));
  } catch (error) {
    if (error.code === 'ENOENT') { // Arquivo não existe
      return defaultData;
    }
    // Outros erros (permissão, JSON inválido, etc.)
    console.error(`Erro ao ler ou parsear o arquivo JSON ${filePath}:`, error);
    throw error; // Re-throw para ser tratado pelo handler da rota
  }
}

router.post("/posts", async (req, res) => { // Tornar a função async
  console.log("Recebida requisição POST /posts com body:", req.body);
  const { userId, texto, imagem } = req.body;
  if (!userId || !texto) {
    console.error("POST /posts - Erro: Texto e usuário são obrigatórios.");
    return res.status(400).json({ message: "Texto e usuário são obrigatórios" });
  }
  try {
    // Lê os usuários
    let users = await readJsonFile(usersPath, []);
    const user = users.find(u => u.id === userId);

    if (!user) {
      console.error(`POST /posts - Erro: Usuário com ID ${userId} não encontrado.`);
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Cria novo post com nome e fotoPerfil
    const novoPost = {
      id: Date.now(),
      userId,
      nome: user.nome,
      fotoPerfil: user.dados?.fotoPerfil || null,
      texto,
      imagem: imagem || null,
      data: new Date().toISOString(),
      likesCount: 0,
      likedBy: [],
      commentsList: [],
    };

    // Lê os posts existentes
    let posts = await readJsonFile(postsPath, []);
    posts.unshift(novoPost);
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

    // Salva nos dados do usuário
    users = users.map(u => {
      if (u.id === userId) {
        if (!u.dados) u.dados = {};
        if (!u.dados.posts) u.dados.posts = [];
        u.dados.posts.unshift(novoPost); // Adiciona o post completo
      }
      return u;
    });
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    console.log("POST /posts - Post criado com sucesso:", novoPost.id);
    res.status(201).json({ message: "Post criado!", post: novoPost });

  } catch (error) {
    console.error("POST /posts - Erro interno do servidor:", error);
    res.status(500).json({ message: "Erro interno ao criar post." });
  }
});

router.get("/posts", async (req, res) => { // Tornar a função async
  console.log("Recebida requisição GET /posts");
  try {
    let posts = await readJsonFile(postsPath, []);
    // Ordena do mais novo para o mais antigo
    posts.sort((a, b) => new Date(b.data) - new Date(a.data));
    console.log(`GET /posts - Retornando ${posts.length} posts.`);
    res.status(200).json(posts);
  } catch (error) {
    console.error("GET /posts - Erro interno do servidor:", error);
    res.status(500).json({ message: "Erro ao buscar posts." });
  }
});

router.post("/posts/:postId/like", async (req, res) => { // Tornar a função async
  const postId = parseInt(req.params.postId);
  const { userId } = req.body; // ID do usuário que está curtindo

  if (!userId) {
    console.error(`POST /posts/${postId}/like - Erro: userId é obrigatório.`);
    return res.status(400).json({ message: "userId é obrigatório" });
  }

  try {
    let posts = await readJsonFile(postsPath, []);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      console.error(`POST /posts/${postId}/like - Erro: Post não encontrado.`);
      return res.status(404).json({ message: "Post não encontrado" });
    }

    const post = posts[postIndex];
    if (!post.likedBy) post.likedBy = [];
    if (typeof post.likesCount !== 'number') post.likesCount = 0;

    const userIndexInLikedBy = post.likedBy.indexOf(userId);

    if (userIndexInLikedBy > -1) {
      // Usuário já curtiu, então descurtir
      post.likedBy.splice(userIndexInLikedBy, 1);
      post.likesCount = Math.max(0, post.likesCount - 1); // Garante que não seja negativo
      console.log(`POST /posts/${postId}/like - Usuário ${userId} descurtiu.`);
    } else {
      // Usuário não curtiu, então curtir
      post.likedBy.push(userId);
      post.likesCount++;
      console.log(`POST /posts/${postId}/like - Usuário ${userId} curtiu.`);
    }

    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
    res.status(200).json({ message: "Like atualizado!", post });

  } catch (error) {
    console.error(`POST /posts/${postId}/like - Erro interno do servidor:`, error);
    res.status(500).json({ message: "Erro ao processar like." });
  }
});

router.post("/posts/:postId/comment", async (req, res) => { // Tornar a função async
  const postId = parseInt(req.params.postId);
  const { userId, textoComentario } = req.body; // nomeUsuario não é mais necessário no body, pegaremos do userData.json
  console.log(`Recebida requisição POST /posts/${postId}/comment com body:`, req.body);

  if (!userId || !textoComentario) {
    console.error(`POST /posts/${postId}/comment - Erro: userId e textoComentario são obrigatórios.`);
    return res.status(400).json({ message: "userId e textoComentario são obrigatórios" });
  }

  try {
    // Lê os usuários para buscar nome e fotoPerfil
    let users = await readJsonFile(usersPath, []);
    const commentingUser = users.find(u => u.id === userId);

    if (!commentingUser) {
      console.error(`POST /posts/${postId}/comment - Erro: Usuário ${userId} do comentário não encontrado.`);
      return res.status(404).json({ message: "Usuário do comentário não encontrado" });
    }

    let posts = await readJsonFile(postsPath, []);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
      console.error(`POST /posts/${postId}/comment - Erro: Post não encontrado.`);
      return res.status(404).json({ message: "Post não encontrado" });
    }

    const post = posts[postIndex];
    if (!post.commentsList) {
      post.commentsList = [];
    }

    const novoComentario = {
      userId,
      nome: commentingUser.nome, // Pega o nome do usuário encontrado
      fotoPerfil: commentingUser.dados?.fotoPerfil || null, // Pega a foto de perfil
      texto: textoComentario,
      data: new Date().toISOString()
    };
    post.commentsList.unshift(novoComentario); // Adiciona no início para o mais recente aparecer primeiro

    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
    console.log(`POST /posts/${postId}/comment - Comentário adicionado pelo usuário ${userId}.`);
    res.status(201).json({ message: "Comentário adicionado!", comentario: novoComentario, post });

  } catch (error) {
    console.error(`POST /posts/${postId}/comment - Erro interno do servidor:`, error);
    res.status(500).json({ message: "Erro ao adicionar comentário." });
  }
});

module.exports = router;