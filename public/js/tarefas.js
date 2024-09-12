const tabelaTarefasPedentes = document.getElementById("tabelaTarefasPendentes");
const tabelaTarefasFeitas = document.getElementById("tabelaTarefasFeitas");

const formularioCadastro = document.getElementById("formAdicionarTarefa");
formularioCadastro.addEventListener("submit", () => {
  event.preventDefault();
  cadastrarTarefa();
});

function pegarUserId() {
  // Provisório, ainda não tem autenticação
  return 2;
}

async function cadastrarTarefa() {
  const descricao = document.getElementById("cadastroDescricao");
  const status = document.getElementById("cadastroStatus");
  const user_id = pegarUserId();

  const inicio = document.getElementById("cadastroInicio");
  const fim = document.getElementById("cadastroFim");

  // Convertendo data e hora para UTC
  const inicioDate = new Date(inicio.value);
  const fimDate = new Date(fim.value);
  const inicioUTC = inicioDate.toISOString();
  const fimUTC = fimDate.toISOString();

  console.log(inicioUTC);
  console.log(fimUTC);

  const dados = {
    user_id: user_id,
    descricao: descricao.value,
    inicio: inicioUTC,
    fim: fimUTC,
    status: status.checked,
  };
  await fetch("/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  limparTabelas();
  await pegarDados();
}

async function deletarTarefa(id) {
  await fetch(`/tasks/${id}`, {
    method: "DELETE",
    headers: {},
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  limparTabelas();
  await pegarDados();
}

function formatarData(data) {
  // Cria um objeto Date com a string UTC recebida
  const dataUTC = new Date(data);

  // Obtém as horas e minutos no horário local
  const hours = String(dataUTC.getHours()).padStart(2, "0");
  const minutes = String(dataUTC.getMinutes()).padStart(2, "0");

  // Retorna o horário no formato HH:MM no fuso horário local
  return `${hours}:${minutes}`;
}

function adicionarLinha(tarefa) {
  // Criando estrutura html da tabela
  let linha = document.createElement("tr");
  let coluna_status = document.createElement("td");
  let coluna_descricao = document.createElement("td");
  let coluna_inicio = document.createElement("td");
  let coluna_fim = document.createElement("td");
  let coluna_actions = document.createElement("td");

  let action1 = document.createElement("button");
  let action2 = document.createElement("button");

  // Preenchendo as informações de cada coluna
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("task_id", tarefa.id);
  checkbox.checked = tarefa.feita;
  checkbox.addEventListener("change", () => trocarEstado(checkbox));
  coluna_status.style.display = "flex";
  coluna_status.style.justifyContent = "center";
  coluna_status.style.alignItems = "center";
  coluna_status.appendChild(checkbox);

  coluna_descricao.textContent = tarefa.descricao;
  coluna_inicio.textContent = formatarData(tarefa.inicio);
  coluna_fim.textContent = formatarData(tarefa.fim);

  action1.textContent = "Editar";

  action2.textContent = "Excluir";
  action2.setAttribute("class", tarefa.id);
  action2.addEventListener("click", () => {
    deletarTarefa(action2.className);
  });

  // Montando a linha
  linha.appendChild(coluna_status);
  linha.appendChild(coluna_descricao);
  linha.appendChild(coluna_inicio);
  linha.appendChild(coluna_fim);

  coluna_actions.appendChild(action1);
  coluna_actions.appendChild(action2);
  linha.appendChild(coluna_actions);

  // Decisão de em qual tabela adicionar a linha montada
  if (tarefa.feita) {
    tabelaTarefasFeitas.appendChild(linha);
  } else {
    tabelaTarefasPedentes.appendChild(linha);
  }
}

// Limpa a tabela antes de fazer uma nova consulta para atualizar a tabela
function limparTabelas() {
  // Seleciona as tabelas pelo ID
  const tabelaTarefasPendentes = document.getElementById(
    "tabelaTarefasPendentes"
  );
  const tabelaTarefasFeitas = document.getElementById("tabelaTarefasFeitas");

  // Remove todas as linhas da tabela, exceto o cabeçalho
  limparTabela(tabelaTarefasPendentes);
  limparTabela(tabelaTarefasFeitas);
}

function limparTabela(tabela) {
  // Remove todas as linhas, exceto a primeira (cabeçalho)
  while (tabela.rows.length > 1) {
    tabela.deleteRow(1); // Remove a segunda linha (índice 1)
  }
}

// Altera o status da tarefa no BD
async function trocarEstado(checkbox) {
  const task_id = checkbox.getAttribute("task_id");
  const estado = checkbox.checked;
  await fetch("/tasks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: task_id,
      estado: estado,
    }),
  })
    .then((response) => response.text())
    .then((data) => console.log(data));
  limparTabelas();
  await pegarDados();
}

async function pegarDados() {
  const userId = 2;
  await fetch(`http://localhost:8080/tasks/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((tarefas) => {
      tarefas.forEach((tarefa) => {
        adicionarLinha(tarefa);
      });
    })
    .catch((error) => {
      console.error("Erro: ", error);
    });
}

pegarDados();
