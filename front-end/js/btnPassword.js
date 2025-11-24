document.addEventListener("DOMContentLoaded", () => {
    // Senha
    const passwordInput = document.getElementById("password");
    const iconOffPassword = document.getElementById("iconOffPassword");
    const iconOnPassword = document.getElementById("iconOnPassword");

    iconOffPassword.addEventListener("click", () => {
        passwordInput.type = "text";
        iconOffPassword.style.display = "none";
        iconOnPassword.style.display = "inline";
    });

    iconOnPassword.addEventListener("click", () => {
        passwordInput.type = "password";
        iconOnPassword.style.display = "none";
        iconOffPassword.style.display = "inline";
    });

    // Confirmação de senha
    const confirmeInput = document.getElementById("confirmePassword");
    const iconOffConfirme = document.getElementById("iconOffConfirme");
    const iconOnConfirme = document.getElementById("iconOnConfirme");

    iconOffConfirme.addEventListener("click", () => {
        confirmeInput.type = "text";
        iconOffConfirme.style.display = "none";
        iconOnConfirme.style.display = "inline";
    });

    iconOnConfirme.addEventListener("click", () => {
        confirmeInput.type = "password";
        iconOnConfirme.style.display = "none";
        iconOffConfirme.style.display = "inline";
    });
});
