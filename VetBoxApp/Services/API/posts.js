const fs = require("fs");
const path = require("path");
const postsPath = path.join(__dirname, "../../utils/data/posts.json");
const usersPath = path.join(__dirname, "../../utils/data/userData.json");
const express = require("express");
const router = express.Router();

router.post("/posts", (req, res) => {
  const { userId, texto, imagem } = req.body;
  if (!userId || !texto) {
    return res.status(400).json({ message: "Texto e usuário são obrigatórios" });
  }

  // Lê os usuários
  let users = JSON.parse(fs.readFileSync(usersPath, "utf8") || "[]");
  const user = users.find(u => u.id === userId);

  if (!user) {
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
  };

  // Lê os posts existentes
  let posts = [];
  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, "utf8") || "[]");
  }
  posts.unshift(novoPost);
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

  // Salva nos dados do usuário
  users = users.map(u => {
    if (u.id === userId) {
      if (!u.dados) u.dados = {};
      if (!u.dados.posts) u.dados.posts = [];
      u.dados.posts.unshift(novoPost);
    }
    return u;
  });
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

  res.status(201).json({ message: "Post criado!", post: novoPost });
});
router.get("/posts", (req, res) => {
  let posts = [];
  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, "utf8") || "[]");
  }
  // Ordena do mais novo para o mais antigo
  posts.sort((a, b) => new Date(b.data) - new Date(a.data));
  res.status(200).json(posts);
});

module.exports = router;