const emailValidation = (email) => {
  return email?.toString().includes("@") && email.includes(".");
};

const telefoneValidation = (telefone) => {
  return telefone?.toString().length >= 10 && telefone?.toString().length <= 11;
};

const senhaValidation = (senha) => {
  return senha?.toString().length >= 6;
};

const nomeValidation = (nome) => {
  return nome?.toString().length > 2;
};

export const validateForm = (nome, email, telefone, senha) => {
  if (!nome || !nomeValidation(nome)) {
    return "O nome é obrigatório.";
  }
  if (!email || !emailValidation(email)) {
    return "O e-mail é inválido.";
  }
  if (!telefone || !telefoneValidation(telefone)) {
    return "O telefone deve ter entre 10 e 11 dígitos.";
  }
  if (!senha || !senhaValidation(senha)) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  return null; // Formulário válido
};
