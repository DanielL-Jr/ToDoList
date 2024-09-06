const tabelaTarefasPedentes = document.getElementById("tabelaTarefasPendentes");
const tabelaTarefasFeitas = document.getElementById("tabelaTarefasFeitas");

function formatarData(data) {
  const date = new Date(data);

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
} 

function adicionarLinha(data) {
  let linha = document.createElement("tr");
  let coluna1 = document.createElement("td");
  let coluna2 = document.createElement("td");
  let coluna3 = document.createElement("td");
  let coluna4 = document.createElement("td");
  let coluna5 = document.createElement("td");
  let action1 = document.createElement("button");
  let action2 = document.createElement("button");

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.checked = data.feita;
  coluna1.appendChild(checkbox);

  coluna2.textContent = data.descricao;
  coluna3.textContent = formatarData(data.inicio);
  coluna4.textContent = formatarData(data.fim);

  action1.textContent = "Editar";
  action2.textContent = "Excluir";

  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  linha.appendChild(coluna3);
  linha.appendChild(coluna4);

  coluna5.appendChild(action1);
  coluna5.appendChild(action2);
  linha.appendChild(coluna5);
  if (data.feita) {
    tabelaTarefasFeitas.appendChild(linha);
  } else {
    tabelaTarefasPedentes.appendChild(linha);
  }
}

async function pegarDados() {
  const userId = 2;
  await fetch(`http://localhost:8080/tasks/${userId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((dados) => {
      dados.forEach((dado) => {
        adicionarLinha(dado);
      });
    })
    .catch((error) => {
      console.error("Erro: ", error);
    });
}

pegarDados();
