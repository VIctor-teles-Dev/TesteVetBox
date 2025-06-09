
const express = require("express");
const app = express();
const router = require("./login_criator.js");
const axios = require("axios");




app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.status(200).send("API funcionando!");
});


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});


