const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const tasks = require("../database/tasks");
const users = require("../database/users");
const jwt = require("../database/jwt");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/tarefas.html"));
});

// Cria uma nova tarefa
app.post("/tasks", async (req, res) => {
  // Pega os dados da requisição e monta um objeto, ou registro
  const dados = {
    user_id: req.body.user_id,
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
app.get("/tasks/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { data, error } = await tasks.lerTarefas(user_id);
  if (error) {
    res.status(500).send(`Erro ao consultar tabela: ${error}`);
  } else {
    res.status(200).json(data);
  }
});

// Atualiza qualquer atributo de uma tarefa
app.put("/tasks", async (req, res) => {
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
app.patch("/tasks", async (req, res) => {
  const { estado, id } = req.body;
  const { error } = await tasks.trocarEstado(estado, id);
  if (error) {
    res.status(500).send(`Erro ao atualizar tabela: ${error}`);
  } else {
    res.status(200).send("Tarefa Atualizada com Sucesso!");
  }
});

// Deleta uma única tarefa
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await tasks.deletarTarefa(id);
  if (error) {
    res.status(500).send(`Erro ao deletar tarefa: ${error}`);
  } else {
    res.status(200).send(`Tarefa Deletada com Sucesso!`);
  }
});

app.post("/users", async (req, res) => {
  // Monta um registro com as informações da requisição
  const dados = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    birthdate: req.body.birthdate,
  };

  const { error } = await users.criarUsuario(dados);

  if (error) {
    res.status(500).send(`Erro ao criar usuário: ${error}`);
  }
  res.status(201).send(`Usuário criado com sucesso`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera que o token esteja no formato "Bearer TOKEN"

  if (token == null) return res.status(401).send('Token não fornecido');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send('Token inválido');

    req.user = user;
    next();
  });
};

app.post("/users/login", async (req, res) => {
  const {email, password} = req.body;

  const senhaCorreta = await users.verificarSenha(email, password);
  if(!senhaCorreta) res.status(401).send("Credenciais incorretas");

  const user = await users.selecionarPorEmail(email);
  const token = jwt.gerarToken(user.id);

  res.status(200).json(token);
})
app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
