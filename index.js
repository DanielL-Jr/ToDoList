const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const lerTarefas = require("./database/tasks");

const app = express();

app.use(express.json());

app.get("/tasks", async (req, res) => {
  const { user_id } = req.body;
  const { data, error } = await lerTarefas(user_id);
  if (error) {
    res.status(500).send("Erro ao consultar tabela: ", error);
  } else {
    res.status(200).json(data);
  }
});

app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
