const formCadastro = document.getElementById("formCadastro");
formCadastro.addEventListener("submit", async () => {
  event.preventDefault();
  const username = document.getElementById("cadastro_username").value;
  const email = document.getElementById("cadastro_email").value;
  const senha = document.getElementById("cadastro_senha").value;
  const confirma_senha = document.getElementById("confirmar_senha").value;
  if (senha == confirma_senha) {
    await fetch("/users/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Verifica se o objeto está vazio
        if (Object.keys(data).length === 0) {
          cadastrarUsuario(); // Chama a função caso o objeto esteja vazio
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("Senhas devem ser iguais");
  }
});

async function cadastrarUsuario() {
    
  const username = document.getElementById("cadastro_username").value;
  const email = document.getElementById("cadastro_email").value;
  const senha = document.getElementById("cadastro_senha").value;
  const data = {
    name: document.getElementById("cadastro_nome_completo").value,
    username: username,
    email: email,
    password: senha,
    birthdate: document.getElementById("cadastro_data").value,
  };
  await fetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
}
