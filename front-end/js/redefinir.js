// redefinir.js

document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetBtn");
  const resetEmail = document.getElementById("resetEmail");
  const messageDiv = document.getElementById("message");

  resetBtn.addEventListener("click", async () => {
    alert("E-mail enviado!")
    const email = resetEmail.value.trim();
    if (!email) {
      messageDiv.textContent = "Por favor, digite um e-mail válido.";
      messageDiv.classList.add("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/send-temp-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        messageDiv.textContent = data.error || "Erro ao enviar senha provisória.";
        messageDiv.classList.add("error");
      } else {
        messageDiv.textContent = "Senha provisória enviada! Verifique seu e-mail.";
        messageDiv.classList.remove("error");
      }

    } catch (err) {
      console.error(err);
      messageDiv.textContent = "Erro ao enviar senha provisória.";
      messageDiv.classList.add("error");
    }
  });
});
