document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    if (!emailInput || !passwordInput) return alert("Campos não encontrados");

    const data = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        // Salva o ID do usuário e outros dados no localStorage
        localStorage.setItem("userId", result.user._id);
        localStorage.setItem("userName", result.user.name || "");
        localStorage.setItem("userEmail", result.user.email);

        alert("Login bem-sucedido!");
        window.location.href = "home.html"; // ou perfil.html se quiser redirecionar direto
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao realizar login");
    }
  });
});
