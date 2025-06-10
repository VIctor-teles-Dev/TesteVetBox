const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const userDataPath = JSON.parse(
  fs.readFileSync("./utils/data/userData.json", "utf8")
);
router.get("/login", (req, res) => {
  res.status(200).send({ message: "Bem-vindo ao serviço de login e criação de usuários!" });
}
);

router.post("/login", (req, res) => {
 const {email, senha} = req.body;
 if (!email || !senha) {
    return res.status(422).send({ message: "Todos os campos são obrigatórios!" });
  }

  const user = userDataPath.find((user) => user.email === email);
  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado!" });
  }

  const isPasswordValid = bcrypt.compareSync(senha, user.senha);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Senha incorreta!" });
  }

  // Se o login for bem-sucedido, você pode retornar os dados do usuário ou um token
  res.status(200).send({ message: "Login bem-sucedido!", user: { nome: user.nome, email: user.email, dados: user.dados, token: user.token, id: user.id, fotoPerfil: user.dados.fotoPerfil} });
  console.log("Usuário logado com sucesso:", user.nome);
});

router.post("/create", (req, res) => {
  // Aqui você pode processar os dados recebidos
  const { nome, email, telefone, senha } = req.body;
    if (!nome || !email || !telefone || !senha) {
        return res.status(422).send({ message: "Todos os campos são obrigatórios!" });
    }
    else if(userDataPath.find((user)=> user.nome === nome || user.email === email || user.telefone === telefone)) {
        // Verifica se o usuário já existe
        // Se o usuário já existir, retorna um erro
        return res.status(422).send({ message: "Usuário já cadastrado!" });
    }
    else{
        var userData = {
            id: Math.floor(Math.random() * 10000000), // Gera um ID aleatório
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha,
            dados: {}
        }; 
        userData.token = jwt.sign({ id: userData.id }, "SECRET_KEY", process.env.JWT_SECRET, {
            expiresIn: "1h" // Define o tempo de expiração do token
});
        const salt = bcrypt.genSaltSync(10);
        userData.senha = bcrypt.hashSync(senha, salt);
        userDataPath.push(userData); // Adiciona o novo usuário ao array
        const userDataJson = JSON.stringify(userDataPath, null, 2);
        fs.writeFileSync("./utils/data/userData.json", userDataJson, "utf8"); // Salva o array atualizado no arquivo JSON
        console.log("Usuário criado com sucesso:", userData);
        res.status(201).send({ message: "Usuário criado com sucesso!" });
    }
});


router.get("/profile", (req, res) => {
  const userId = Number(req.query.userId);
  if (!userId) return res.status(400).send({ message: "userId obrigatório" });

  const users = JSON.parse(fs.readFileSync("./utils/data/userData.json", "utf8"));
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).send({ message: "Usuário não encontrado" });

res.status(200).send({
  id: user.id,
  nome: user.nome,
  email: user.email,
  dados: user.dados,
  token: user.token,
  fotoPerfil: user.dados.fotoPerfil || null
});

});

router.post("/profile/image", (req, res) => {
  const { userId, imagem } = req.body;
  if (!userId || !imagem) {
    return res.status(400).send({ message: "Dados insuficientes." });
  }

  // Carrega os usuários
  const users = JSON.parse(fs.readFileSync("./utils/data/userData.json", "utf8"));
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  // Garante que user.dados existe
  if (!user.dados) user.dados = {};

  // Salva a foto de perfil dentro de dados
  user.dados.fotoPerfil = imagem;

  fs.writeFileSync("./utils/data/userData.json", JSON.stringify(users, null, 2), "utf8");
  res.status(200).send({ message: "Foto de perfil atualizada em dados!" });
});

router.post("/profile/edit", (req, res) => {
  const { userId, nome, email, telefone } = req.body;
  if (!userId || !nome || !email || !telefone) {
    return res.status(400).send({ message: "Dados insuficientes." });
  }

  const users = JSON.parse(fs.readFileSync("./utils/data/userData.json", "utf8"));
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  user.nome = nome;
  user.email = email;
  user.telefone = telefone;

  fs.writeFileSync("./utils/data/userData.json", JSON.stringify(users, null, 2), "utf8");
  res.status(200).send({ message: "Perfil atualizado com sucesso!", user });
});

module.exports = router;