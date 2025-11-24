document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.querySelector("#name"); // se quiser trocar para nome, pode criar outro input
    const emailInput = document.querySelector("#email");
    const confirmEmailInput = document.querySelector("#confirmEmail");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmePassword");
    const birthDateInput = document.querySelector("#date");

    if ( !nameInput||!emailInput || !confirmEmailInput || !passwordInput || !confirmPasswordInput || !birthDateInput) {
      alert("Erro: algum campo não encontrado");
      return;
    }

    const name = nameInput.value;
    const email = emailInput.value;
    const confirmEmail = confirmEmailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const birthDate = birthDateInput.value;

    if (email !== confirmEmail) {
      alert("Os emails não coincidem!");
      return;
    }

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    const data = { name, email, password, confirmPassword, birthDate };

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        alert(result.error || "Erro ao cadastrar usuário");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar usuário");
    }
  });
});
