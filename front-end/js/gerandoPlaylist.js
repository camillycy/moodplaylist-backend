
const AI_URL = "http://localhost:3000/test-ai";
const RECOMENDACAO_URL = "http://localhost:3000/api/recomendacao";

document.addEventListener("DOMContentLoaded", async () => {
    const text = localStorage.getItem("emotionText");
    const USER_ID = localStorage.getItem("userId");

    if (!text || !USER_ID) {
        alert("Erro: dados insuficientes!");
        return;
    }

    try {
        // 1️⃣ Envia texto para IA
        const aiResponse = await fetch(AI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        const aiData = await aiResponse.json();
        const emotion = aiData.emotion;

        // 2️⃣ Envia emoção + userId para recomendação
        const recResponse = await fetch(RECOMENDACAO_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emotion, userId: USER_ID }),
        });
        const recData = await recResponse.json();

        // 3️⃣ Salva playlist
        localStorage.setItem("tempPlaylist", JSON.stringify(recData));

        // Redireciona para playlist.html após carregamento
        setTimeout(() => {
            window.location.href = "playlist.html";
        }, 800); // tempo de transição suave
    } catch (err) {
        console.error(err);
        alert("Erro ao gerar playlist.");
    }
});
