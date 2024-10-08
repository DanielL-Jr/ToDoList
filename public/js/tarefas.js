const tabelaTarefasPedentes = document.getElementById("tabelaTarefasPendentes");
const tabelaTarefasFeitas = document.getElementById("tabelaTarefasFeitas");

const formularioCadastro = document.getElementById("formAdicionarTarefa");
formularioCadastro.setAttribute("tipo", "cadastrar");
formularioCadastro.addEventListener("submit", () => {
  event.preventDefault();
  const botao = document.getElementById("btnSubmit");
  if (botao.value == "Adicionar") {
    cadastrarTarefa();
  } else {
    const task_id = formularioCadastro.getAttribute("task_id");
    atualizarTarefa(task_id);
  }
});
function limparFormulario() {
  const descricao = document.getElementById("cadastroDescricao");
  const dataInicio = document.getElementById("cadastroInicio");
  const dataFim = document.getElementById("cadastroFim");
  const status = document.getElementById("cadastroStatus");

  descricao.value = "";
  dataInicio.value = "";
  dataFim.value = "";
  status.checked = false;
}

async function cadastrarTarefa() {
  const descricao = document.getElementById("cadastroDescricao");
  const status = document.getElementById("cadastroStatus");

  const inicio = document.getElementById("cadastroInicio");
  const fim = document.getElementById("cadastroFim");

  // Convertendo data e hora para UTC
  const inicioDate = new Date(inicio.value);
  const fimDate = new Date(fim.value);
  const inicioUTC = inicioDate.toISOString();
  const fimUTC = fimDate.toISOString();

  const dados = {
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
  limparFormulario();
  limparTabelas();
  await pegarDados();
}

async function atualizarTarefa(task_id) {
  const descricao = document.getElementById("cadastroDescricao");
  const status = document.getElementById("cadastroStatus");

  const inicio = document.getElementById("cadastroInicio");
  const fim = document.getElementById("cadastroFim");

  // Convertendo data e hora para UTC
  const inicioDate = new Date(inicio.value);
  const fimDate = new Date(fim.value);
  const inicioUTC = inicioDate.toISOString();
  const fimUTC = fimDate.toISOString();

  const tarefa = {
    id: task_id,
    descricao: descricao.value,
    inicio: inicioUTC,
    fim: fimUTC,
    status: status.checked,
  };

  await fetch("/tasks", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarefa),
  })
    .then((response) => response.text())
    .then(async (data) => {
      console.log(data);
      formCadastrar();
      limparTabelas();
      await pegarDados();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Função para converter o valor para o formato yyyy-MM-ddThh:mm
function formatarParaDatetimeLocal(data) {
  const date = new Date(data); // Cria um objeto Date a partir da string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formEditar(task_id) {
  const titulo = document.getElementById("tituloTarefa");
  const botao = document.getElementById("btnSubmit");
  formularioCadastro.setAttribute("tipo", "editar");
  formularioCadastro.setAttribute("task_id", task_id);

  titulo.textContent = "Editar Tarefa";
  botao.value = "Editar";

  // Seleciona a linha (tr) com base no atributo task_id
  const tr = document.querySelector(`tr[task="${task_id}"]`);

  // Seleciona todas as tds dentro da tr
  const tds = tr.querySelectorAll("td");

  // Seleciona todos os campos do formulário
  const descricao = document.getElementById("cadastroDescricao");
  const inicio = document.getElementById("cadastroInicio");
  const fim = document.getElementById("cadastroFim");
  const status = document.getElementById("cadastroStatus");

  // Itera sobre todas as tds
  tds.forEach((td) => {
    // Acessa o conteúdo de cada td
    const coluna = td.getAttribute("data-coluna");

    switch (coluna) {
      case "Descricao":
        descricao.value = td.textContent;
        break;
      case "Inicio":
        inicio.value = td.getAttribute("inicio");
        break;
      case "Fim":
        fim.value = td.getAttribute("fim");
        break;
      case "Checkbox":
        const checkbox = td.querySelector("input");
        status.checked = checkbox.checked;
        break;
    }
  });
}

function formCadastrar() {
  
  const titulo = document.getElementById("tituloTarefa");
  const botao = document.getElementById("btnSubmit");
  
  formularioCadastro.setAttribute("tipo", "cadastrar");
  formularioCadastro.setAttribute("task_id", "");

  titulo.textContent = "Cadastrar Tarefa";
  botao.value = "Adicionar";
  limparFormulario();
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

function calcularDuracao(inicio, fim) {
  // Cria objetos Date para as duas datas fornecidas
  const data1Obj = new Date(inicio);
  const data2Obj = new Date(fim);

  // Obtém os timestamps das datas
  const timestamp1 = data1Obj.getTime();
  const timestamp2 = data2Obj.getTime();

  // Calcula a diferença em milissegundos
  const diferencaMs = Math.abs(timestamp2 - timestamp1);

  // Converte a diferença para diferentes unidades
  const diferencaSegundos = Math.floor(diferencaMs / 1000);
  const diferencaMinutos = Math.floor(diferencaSegundos / 60);
  const diferencaHoras = Math.floor(diferencaMinutos / 60);
  const diferencaDias = Math.floor(diferencaHoras / 24);

  // Calcula o resto para cada unidade de tempo
  const restoHoras = diferencaHoras % 24;
  const restoMinutos = diferencaMinutos % 60;

  // Cria uma lista para armazenar as partes não vazias da string
  const partes = [];

  // Adiciona as partes apenas se o valor for maior que zero
  if (diferencaDias > 0) {
    partes.push(`${diferencaDias} dias`);
  }
  if (restoHoras > 0 || partes.length > 0) {
    // Exibe horas se houver dias ou horas
    partes.push(`${restoHoras} horas`);
  }
  if (restoMinutos > 0 || partes.length > 0) {
    // Exibe minutos se houver horas ou minutos
    partes.push(`${restoMinutos} minutos`);
  }

  // Junta as partes com vírgulas e retorna a string
  return partes.join(", ");
}

function adicionarLinha(tarefa) {
  // Criando estrutura html da tabela
  let linha = document.createElement("tr");
  linha.setAttribute("task", tarefa.id);

  let coluna_status = document.createElement("td");
  let coluna_descricao = document.createElement("td");
  let coluna_inicio = document.createElement("td");
  let coluna_fim = document.createElement("td");
  let coluna_duracao = document.createElement("td");
  let coluna_actions = document.createElement("td");

  let action1 = document.createElement("button");
  let action2 = document.createElement("button");

  // Preenchendo as informações de cada coluna
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("task_id", tarefa.id);
  checkbox.checked = tarefa.feita;
  checkbox.addEventListener("change", () => trocarEstado(checkbox));
  coluna_status.setAttribute("data-coluna", "Checkbox");
  coluna_status.style.display = "flex";
  coluna_status.style.justifyContent = "center";
  coluna_status.style.alignItems = "center";
  coluna_status.appendChild(checkbox);

  coluna_descricao.textContent = tarefa.descricao;
  coluna_descricao.setAttribute("data-coluna", "Descricao");

  coluna_inicio.textContent = formatarData(tarefa.inicio);
  coluna_inicio.setAttribute(
    "inicio",
    formatarParaDatetimeLocal(tarefa.inicio)
  );
  coluna_inicio.setAttribute("data-coluna", "Inicio");

  coluna_fim.textContent = formatarData(tarefa.fim);
  coluna_fim.setAttribute("fim", formatarParaDatetimeLocal(tarefa.fim));
  coluna_fim.setAttribute("data-coluna", "Fim");

  let duracao = calcularDuracao(tarefa.inicio, tarefa.fim);
  coluna_duracao.textContent = duracao;

  action1.textContent = "Editar";
  action1.setAttribute("task", tarefa.id);
  action1.addEventListener("click", () => {
    formEditar(action1.getAttribute("task"));
  });

  action2.textContent = "Excluir";
  action2.setAttribute("task", tarefa.id);
  action2.addEventListener("click", () => {
    deletarTarefa(action2.getAttribute("task"));
  });

  // Montando a linha
  linha.appendChild(coluna_status);
  linha.appendChild(coluna_descricao);
  linha.appendChild(coluna_inicio);
  linha.appendChild(coluna_fim);
  linha.appendChild(coluna_duracao);

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
  await fetch(`/tasks`, {
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
