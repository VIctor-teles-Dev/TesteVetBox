import axios from "axios";
import { VETBOX_APP_API_LOGIN } from "../.env";

export default class UserServices {
  constructor() {
    console.log("VETBOX_APP_API_LOGIN:", VETBOX_APP_API_LOGIN);
    this.axio = axios.create({
      baseURL: VETBOX_APP_API_LOGIN,
    });
  }
  async createUser(userData) {
    try {
      console.log("URL base:", this.axio.defaults.baseURL);
      console.log("Dados enviados:", userData);
      // Altere o endpoint para o correto de cadastro
      const { data } = await this.axio.post("/users", userData); // Exemplo: "/users"
      if (data && data.user) {
        return true;
      }
      return false;
    } catch (error) {
      // Log detalhado do erro
      console.log("Erro ao criar usuário:", error);
      if (error.response) {
        console.log("Erro response data:", error.response.data);
      }
      throw error;
    }
  }
}
