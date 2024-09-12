const supabase = require("./connection");
const bcrypt = require("bcrypt");

const criarUsuario = async (user_data) => {
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(user_data.password, saltRounds);
  console.log(hashedPassword);

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
    .then(({ error }) => {
      if (error) {
        console.error("Erro ao criar usuário:", error);
      } else {
        console.log("Usuário criado com sucesso!");
      }
    });

  return consulta;
};

const selecionarPorEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();
  if (error) {
    // Se houver um erro na consulta, registre o erro e retorne null
    console.error("Erro ao selecionar usuário: ", error);
    return null;
  } else if (!data) {
    // Se não houver dados retornados, registre um aviso e retorne null
    console.warn("Usuário não encontrado.");
    return null;
  } else {
    // Caso contrário, retorne os dados do usuário
    console.log("Usuário selecionado com sucesso.");
    return data;
  }
};


const alterarUsuario = async () => {};

const alterarSenha = async () => {};

const deletarUsuario = async () => {};

module.exports = {
  criarUsuario,
  selecionarPorEmail,
  alterarUsuario,
  alterarSenha,
  deletarUsuario,
};
