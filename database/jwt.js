const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const gerarToken = (user_id) => {
  return jwt.sign({ user_id }, SECRET_KEY, { expiresIn: "2h" }); // O token expira em 1 hora
};

module.exports = { gerarToken };
