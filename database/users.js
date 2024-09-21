const supabase = require("./connection");
const bcrypt = require("bcrypt");

const criarUsuario = async (user_data) => {
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(user_data.password, saltRounds);

  // Inserir hashedPassword no banco de dados
  const consulta = await supabase
    .from("users")
    .insert([
      {
        name: user_data.name,
        username: user_data.username,
        email: user_data.email,
        password: hashedPassword,
        birthdate: user_data.birthdate,
      },
    ])
    .select();

  if (consulta.error) {
    console.error("Erro ao criar usuário:", consulta.error);
  } else {
    console.log("Usuário criado com sucesso!");
  }
  return consulta;
};

const selecionarPorEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (error) {
    // Se houver um erro na consulta, registre o erro e retorne null
    console.error("Erro ao selecionar usuário: ", error);
    return error;
  } else if (data.length === 0) {
    // Se não houver dados retornados, registre um aviso e retorne null
    //console.warn("Usuário não encontrado.");
    return null;
  } else {
    // Caso contrário, retorne os dados do usuário
    //console.log("Usuário selecionado com sucesso.");
    return data[0]; // Retorna o primeiro resultado
  }
};

const selecionarPorUsername = async (username) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username);

  if (error) {
    // Se houver um erro na consulta, registre o erro e retorne null
    console.error("Erro ao selecionar usuário: ", error);
    return error;
  } else if (data.length === 0) {
    // Se não houver dados retornados, registre um aviso e retorne null
    //console.warn("Usuário não encontrado.");
    return null;
  } else {
    // Caso contrário, retorne os dados do único usuário encontrado
    console.log("Usuário selecionado com sucesso.");
    return data[0]; // Retorne o único resultado encontrado
  }
};

const verificarSenha = async (user, password) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) return true;
  else return false;
};

const alterarUsuario = async () => {};

const alterarSenha = async () => {};

const deletarUsuario = async () => {};

module.exports = {
  criarUsuario,
  selecionarPorEmail,
  selecionarPorUsername,
  verificarSenha,
  alterarUsuario,
  alterarSenha,
  deletarUsuario,
};
