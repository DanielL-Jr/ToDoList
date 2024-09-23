const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", () => {
  event.preventDefault();
  fazerLogin();
});

async function fazerLogin() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  // Requisição feita por JavaScript
  await fetch("/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((response) => {
      if (response.ok) {
        // Redireciona manualmente no frontend
        window.location.href = "/tarefas";
      } else {
        response.text().then((text) => alert(text));
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
