document.addEventListener("DOMContentLoaded", async () => {
  // ============================
  // Elementos do perfil
  // ============================
  const updateImgBtn = document.querySelector(".update-img");
  const fileInput = document.getElementById("profileImageInput");
  const profileImg = document.getElementById("profileImg");
  const saveBtn = document.getElementById("saveProfilePicBtn");

  const userNameEl = document.getElementById("userName");
  const userId = localStorage.getItem("userId");

  const emailContainer = document.getElementById("dados-email");
  const emailInput = document.getElementById("inputEmail");

  const inputSenhaAtual = document.getElementById("inputSenhaAtual");
  const iconAtualOff = document.getElementById("iconAtualOff");
  const iconAtualOn = document.getElementById("iconAtualOn");

  const inputSenhaNova = document.getElementById("inputSenhaNova");
  const iconNovaOff = document.getElementById("iconNovaOff");
  const iconNovaOn = document.getElementById("iconNovaOn");

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  let selectedFile = null;

  // ============================
  // 1️⃣ Carregar perfil do usuário
  // ============================
  const loadUserProfile = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`);
      if (!res.ok) throw new Error("Erro ao buscar usuário");

      const data = await res.json();

      profileImg.src = data.profilePicture 
        ? `${data.profilePicture}?t=${Date.now()}` 
        : "./img/user-icon.png";

      if (data.name) userNameEl.textContent = data.name;
      if (data.email) emailInput.value = data.email;

    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      alert("Não foi possível carregar os dados do perfil");
    }
  };
  await loadUserProfile();

  // ============================
  // 2️⃣ Selecionar imagem
  // ============================
  updateImgBtn?.addEventListener("click", () => fileInput.click());

  fileInput?.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    selectedFile = file;
    profileImg.src = URL.createObjectURL(file);
  });


  // ============================
// 2.1️⃣ Apagar foto de perfil
// ============================
const deleteImgBtn = document.querySelector(".delete-img");

deleteImgBtn?.addEventListener("click", async () => {
  if (!confirm("Deseja remover sua foto de perfil?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/users/profile-picture`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao remover foto");
      return;
    }

    // Atualiza a imagem do avatar
profileImg.src = "img/user-icon.png " + Date.now();

    // Remove imagem selecionada para upload (se existir)
    selectedFile = null;
    fileInput.value = "";

    alert("Foto removida com sucesso!");

  } catch (err) {
    console.error("Erro ao remover foto:", err);
    alert("Erro ao remover foto");
  }
});

  // ============================
  // 3️⃣ Salvar foto + senha
  // ============================
  saveBtn?.addEventListener("click", async () => {
    try {
      let imageUrl = null;
      const oldPassword = inputSenhaAtual.value.trim();
      const newPassword = inputSenhaNova.value.trim();

      // ---- Salvar imagem ----
      if (selectedFile) {
        try {
          const formData = new FormData();
          formData.append("profile", selectedFile);

          const uploadResponse = await fetch("http://localhost:3000/upload-profile", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadResponse.json();
          if (!uploadResponse.ok) throw new Error(uploadData.error || "Erro ao enviar imagem");

          // Atualizar foto do usuário
          const updateResponse = await fetch("http://localhost:3000/api/users/update-profile-picture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, imageUrl: uploadData.url }),
          });

          const updateData = await updateResponse.json();
          if (!updateResponse.ok) throw new Error(updateData.error || "Erro ao atualizar perfil");

          imageUrl = updateData.profilePicture;

        } catch (err) {
          console.error("Erro ao atualizar foto:", err);
          alert("Erro ao atualizar foto, mas continuando...");
        }
      }

      // ---- Atualizar senha ----
      if (oldPassword && newPassword) {
        try {
          const response = await fetch("http://localhost:3000/api/users/update-email-password", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, oldPassword, newPassword }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Erro ao atualizar senha");

          inputSenhaAtual.value = "";
          inputSenhaNova.value = "";

        } catch (err) {
          console.error("Erro ao atualizar senha:", err);
          alert("Erro ao atualizar senha, mas continuando...");
        }
      }

      // ---- Mensagem final ----
      if (imageUrl && oldPassword && newPassword) alert("Foto e senha atualizadas com sucesso!");
      else if (imageUrl) alert("Foto salva com sucesso!");
      else if (oldPassword && newPassword) alert("Senha atualizada com sucesso!");
      else alert("Nenhuma alteração feita.");

      if (imageUrl) profileImg.src = `${imageUrl}?t=${Date.now()}`;

    } catch (err) {
      console.error("Erro geral ao salvar perfil:", err);
      alert("Erro ao salvar perfil");
    }
  });

  // ============================
  // 4️⃣ Edição do e-mail
  // ============================
  emailContainer?.addEventListener("click", () => {
    emailInput.focus();
    emailInput.select();
  });

  emailInput?.addEventListener("change", async () => {
    const newEmail = emailInput.value.trim();
    if (!newEmail) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/update-email/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (!response.ok) alert(data.error || "Erro ao atualizar e-mail");
      else alert("E-mail atualizado com sucesso!");

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar e-mail");
    }
  });

  // ============================
  // 5️⃣ Mostrar/Ocultar senha
  // ============================
  const togglePassword = (input, offIcon, onIcon) => {
    offIcon?.addEventListener("click", () => {
      input.type = "text";
      offIcon.style.display = "none";
      onIcon.style.display = "inline-block";
    });
    onIcon?.addEventListener("click", () => {
      input.type = "password";
      onIcon.style.display = "none";
      offIcon.style.display = "inline-block";
    });
  };

  togglePassword(inputSenhaAtual, iconAtualOff, iconAtualOn);
  togglePassword(inputSenhaNova, iconNovaOff, iconNovaOn);
});
