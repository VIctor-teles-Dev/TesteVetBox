import axios from "axios";

export default class UserServices {
  constructor() {
    this.axio = axios.create({
      baseURL: "http://192.168.100.53:3000", 
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async createUser(userData) {
    try {
      // Envia para o endpoint correto
      const { data } = await this.axio.post("/create", userData);
      // Se quiser tratar o retorno, adapte aqui
      if (data && data.message === "Usuário criado com sucesso!") {
        return true;
      }
      return false;
    } catch (error) {
      console.log("Erro ao criar usuário:", error);
      if (error.response) {
        console.log("Erro response data:", error.response.data);
      }
      throw error;
    }
  }
}
