const tabelaTarefasPedentes = document.getElementById("tabelaTarefasPendentes");
const tabelaTarefasFeitas = document.getElementById("tabelaTarefasFeitas");

const formularioCadastro = document.getElementById("formAdicionarTarefa");
formularioCadastro.addEventListener("submit", () => {
  event.preventDefault();
  cadastrarTarefa();
});

function pegarUserId(){
  // Provisório, ainda não tem autenticação
  return 2;
}

async function cadastrarTarefa() {
  const descricao = document.getElementById("cadastroDescricao");
  const inicio = document.getElementById("cadastroInicio");
  const fim = document.getElementById("cadastroFim");
  const status = document.getElementById("cadastroStatus");
  const user_id = pegarUserId();

  const dados = {
    user_id: user_id,
    descricao: descricao.value,
    inicio: inicio.value,
    fim: fim.value,
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

function formatarData(data) {
  const date = new Date(data);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function adicionarLinha(tarefa) {
  // Criando estrutura html da tabela
  let linha = document.createElement("tr");
  let coluna1 = document.createElement("td");
  let coluna2 = document.createElement("td");
  let coluna3 = document.createElement("td");
  let coluna4 = document.createElement("td");
  let coluna5 = document.createElement("td");

  let action1 = document.createElement("button");
  let action2 = document.createElement("button");

  // Preenchendo as informações de cada coluna
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", tarefa.id);
  checkbox.checked = tarefa.feita;
  checkbox.addEventListener("change", () => trocarEstado(checkbox));
  coluna1.appendChild(checkbox);

  coluna2.textContent = tarefa.descricao;
  coluna3.textContent = formatarData(tarefa.inicio);
  coluna4.textContent = formatarData(tarefa.fim);

  action1.textContent = "Editar";
  action2.textContent = "Excluir";

  // Montando a linha
  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  linha.appendChild(coluna3);
  linha.appendChild(coluna4);

  coluna5.appendChild(action1);
  coluna5.appendChild(action2);
  linha.appendChild(coluna5);

  // Decisão de em qual tabela adicionar a linha montada
  if (tarefa.feita) {
    tabelaTarefasFeitas.appendChild(linha);
  } else {
    tabelaTarefasPedentes.appendChild(linha);
  }
}

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
  const id = checkbox.id;
  const estado = checkbox.checked;
  await fetch("/tasks", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
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
