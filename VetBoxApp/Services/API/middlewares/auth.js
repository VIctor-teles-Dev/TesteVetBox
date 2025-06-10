const jwt = require("jsonwebtoken");
const fs = require("fs");
const userDataPath = JSON.parse(
  fs.readFileSync("./utils/data/userData.json", "utf8")
);

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Token não fornecido!" });
  }

  try {
    const token = authHeader.replace("Bearer", "").trim(); // Remove "Bearer" e espaços em branco
    jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY",
      (err, payload) => {
        if (err) {
          return res
            .status(401)
            .send({ message: "O usuário precisa estar logado" });
        }
        const { id } = payload;

        const user = userDataPath.find((user) => user.id === id);

        if (!user) {
          return res
            .status(404)
            .send({ message: "O usuário precisa estar logado" });
        }
        req.user = user; // Armazena o usuário no objeto de requisição
        next(); // Chama o próximo middleware ou rota
      }
    );
  } catch (error) {
    return res.status(500).send({ message: "Erro interno no servidor!" });
  }
};
