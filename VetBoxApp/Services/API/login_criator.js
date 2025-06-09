const express = require("express");
const router = express.Router();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const userDataPath = JSON.parse(
  fs.readFileSync("./utils/userData.json", "utf8")
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
  res.status(200).send({ message: "Login bem-sucedido!", user: { nome: user.nome, email: user.email } });
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
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha,
            dados: {}
        }; 
        const salt = bcrypt.genSaltSync(10);
        userData.senha = bcrypt.hashSync(senha, salt);
        userDataPath.push(userData); // Adiciona o novo usuário ao array
        const userDataJson = JSON.stringify(userDataPath, null, 2);
        fs.writeFileSync("./utils/userData.json", userDataJson, "utf8"); // Salva o array atualizado no arquivo JSON
        console.log("Usuário criado com sucesso:", userData);
        res.status(201).send({ message: "Usuário criado com sucesso!" });
    }
});



module.exports = router;