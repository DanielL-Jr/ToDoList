const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const lerTarefas = require("./database/tasks");

const app = express();

app.use(express.json());

app.listen(8080, () => console.log("Rodando servidor na porta 8080"));
