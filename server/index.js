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
})


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

app.patch("/tasks", async (req, res) => {
  const {estado, id} = req.body;
  const {error} = await tasks.trocarEstado(estado, id);
  if(error){
    res.status(500).send(`Erro ao atualizar tabela: ${error}`);
  }else{
    res.status(200).send("Tarefa Atualizada com Sucesso!");
  }
})

app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
