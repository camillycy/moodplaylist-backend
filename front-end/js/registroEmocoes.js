document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("emocoesEmojis");
    const btnGerar = document.getElementById("gerarPlaylist");

    btnGerar.addEventListener("click", (event) => {
        event.preventDefault();

        const text = textarea.value.trim();
        if (!text) {
            alert("Digite o que você está sentindo!");
            return;
        }

        // Salva o texto para usar na tela de carregamento
        localStorage.setItem("emotionText", text);

        // Redireciona para a tela de carregamento
        window.location.href = "gerandoplaylist.html";
    });
});
