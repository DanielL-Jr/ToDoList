const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const tasks = require("../database/tasks");
const users = require("../database/users");
const jwt = require("jsonwebtoken");
const jsonwebtoken = require("../database/jwt");
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Redireciona da raiz para login caso não esteja autenticado
app.get("/", (req, res) => {
  const token = req.cookies.authToken;

  if (token == null) return res.redirect("/login");

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.redirect("/login");

    req.user = user;
    return res.redirect("/tarefas");
  });
});

// Middleware, autorização antes de cada requisição
// Executa e continua, por isso é middle, que é no meio
const autenticarUsuario = (req, res, next) => {
  const token = req.cookies.authToken;

  if (token == null) return res.status(401).send("Token inválido");

  const authenticatedToken = jsonwebtoken.verificarToken(token);
  if (authenticatedToken == null) {
    return res.status(401).send("Token inválido");
  } else {
    // Altera a requisição que o navegador mandou
    req.user_id = authenticatedToken.user_id;
    next();
  }
};

app.get("/tarefas", autenticarUsuario, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/tarefas.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/login.html"));
});

app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/cadastro.html"));
});

// CRUD Tarefas
// Cria uma nova tarefa
app.post("/tasks", autenticarUsuario, async (req, res) => {
  // Pega os dados da requisição e monta um objeto, ou registro
  // O que dita o usuário da tarefa é o req.user_id que o middleware alterou
  const dados = {
    user_id: req.user_id,
    inicio: req.body.inicio,
    fim: req.body.fim,
    descricao: req.body.descricao,
    status: req.body.status,
  };
  const { error } = await tasks.criarTarefa(dados);
  if (error) {
    res.status(500).send(`Erro ao cadastrar tarefa: ${error}`);
  }
  res.status(201).send("Nova Tarefa Cadastrada com Sucesso!");
});

// Retorna todas as tarefas de um user
app.get("/tasks", autenticarUsuario, async (req, res) => {
  const user_id = req.user_id;
  const { data, error } = await tasks.lerTarefas(user_id);
  if (error) {
    res.status(500).send(`Erro ao consultar tabela: ${error}`);
  } else {
    res.status(200).json(data);
  }
});

// Atualiza qualquer atributo de uma tarefa
app.put("/tasks", autenticarUsuario, async (req, res) => {
  const tarefa = {
    id: req.body.id,
    inicio: req.body.inicio,
    fim: req.body.fim,
    descricao: req.body.descricao,
    status: req.body.status,
  };
  const { error } = await tasks.atualizarTarefa(tarefa);
  if (error) {
    res.status(500).send(`Erro ao atualizar tarefa: ${error}`);
  } else {
    res.status(200).send("Tarefa Atualizada com Sucesso!");
  }
});

// Altera o status de uma tarefa
app.patch("/tasks", autenticarUsuario, async (req, res) => {
  const { estado, id } = req.body;
  const { error } = await tasks.trocarEstado(estado, id);
  if (error) {
    res.status(500).send(`Erro ao atualizar tabela: ${error}`);
  } else {
    res.status(200).send("Tarefa Atualizada com Sucesso!");
  }
});

// Deleta uma única tarefa
app.delete("/tasks/:id", autenticarUsuario, async (req, res) => {
  const { id } = req.params;
  const { error } = await tasks.deletarTarefa(id);
  if (error) {
    res.status(500).send(`Erro ao deletar tarefa: ${error}`);
  } else {
    res.status(200).send(`Tarefa Deletada com Sucesso!`);
  }
});

// Criar usuário
// Não precisa de auth
app.post("/users", async (req, res) => {
  // Monta um registro com as informações da requisição
  const dados = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    birthdate: req.body.birthdate,
  };

  const consulta = await users.criarUsuario(dados);

  if (consulta.error) {
    res.status(500).send(`Erro ao criar usuário: ${consulta.error}`);
  }
  res.status(201).send(`Usuário criado com sucesso`);
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await users.selecionarPorEmail(email);

  // Usuário não existe
  if(user == null) return res.status(404).send("Credenciais incorretas");

  // Senha incorreta
  const senhaCorreta = await users.verificarSenha(user, password);
  if (!senhaCorreta) return res.status(401).send("Credenciais incorretas");

  // Cria token de autenticação
  const token = jsonwebtoken.gerarToken(user.id);

  // Guarda no cookie do client/frontend
  res.cookie("authToken", token, {
    httpOnly: true, // O cookie não pode ser acessado pelo JavaScript (protege contra XSS)
    sameSite: "strict", // Protege contra CSRF (impede envio de cookies entre sites diferentes)
    maxAge: 7200000, // Tempo de expiração do cookie (2 horas, em milissegundos)
  });
  res.status(200).send("Login bem-sucedido");
});

// Verifica se os dados do cadastro de conta são válidos
app.post("/users/verify", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  let user = await users.selecionarPorUsername(username);
  const data = {};
  if (user) {
    data.username = "Indisponível";
  }
  user = await users.selecionarPorEmail(email);
  if (user) {
    data.email = "Indisponível";
  }
  res.status(200).json(data);
});
app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
