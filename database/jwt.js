const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const gerarToken = (user_id) => {
  return jwt.sign({ user_id }, SECRET_KEY, { expiresIn: "2h" }); // O token expira em 1 hora
};

// Função para verificar o JWT
const verificarToken = (token) => {
  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Token é válido, e você pode acessar os dados nele
    console.log("Token verificado com sucesso:", decoded);

    return decoded; // Retorna o conteúdo decodificado do token
  } catch (error) {
    // Ocorreu um erro ao verificar o token (por exemplo, expiração ou assinatura inválida)
    console.error("Erro ao verificar o token:", error.message);
    return null; // Retorna null ou pode lançar um erro personalizado
  }
};

module.exports = { gerarToken, verificarToken };
