const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", () => {
  event.preventDefault();
  fazerLogin();
});

async function fazerLogin() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");

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
    .then((response) => response.text())
    .then((token) => {
      console.log(token);
      localStorage.setItem("authToken", token);
    })
    .catch((error) => {
      console.error(error);
    });
}
