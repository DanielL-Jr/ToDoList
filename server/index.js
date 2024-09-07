const express = require("express");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const tasks = require("../database/tasks");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html/tarefas.html"));
});

// Cria uma nova tarefa
app.post("/tasks", async (req, res) => {
  const dados = {
    user_id: req.body.user_id,
    inicio: req.body.inicio,
    fim: req.body.fim,
    descricao: req.body.descricao,
    status: req.body.status,
  };
  const {error} = await tasks.criarTarefa(dados);
  if(error){
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

app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
