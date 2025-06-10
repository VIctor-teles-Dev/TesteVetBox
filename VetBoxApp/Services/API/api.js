
const express = require("express");
const app = express();
const router = require("./login_criator.js");
const auth = require("./middlewares/auth.js");
const postsRouter = require("./posts.js");



app.use(express.json({ limit: "10mb" })); // or higher if needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(router);
app.use( postsRouter);

app.get("/", auth, (req, res) => {
  res.status(200).send({
   email: req.user.email,
    nome: req.user.nome,
    telefone: req.user.telefone,
    dados: req.user.dados,
    token: req.user.token,
  });
});


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});


