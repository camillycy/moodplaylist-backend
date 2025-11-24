document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        console.warn("Usuário não logado.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/recomendacao/ultima/${userId}`);
        
        if (!res.ok) {
            console.log("Nenhuma playlist encontrada.");
            return;
        }

        const playlist = await res.json();
        renderUltimaPlaylist(playlist);

    } catch (error) {
        console.error("Erro ao carregar última playlist:", error);
    }
});

function renderUltimaPlaylist(playlist) {
    const container = document.getElementById("ultimaPlaylist");

    const capa = playlist.recommendations[0]?.image || "./img/default-cover.png";

    container.innerHTML = `
        <div class="playlistItem">
            <img src="${capa}" alt="Capa da playlist">
            <p>${playlist.mood.toUpperCase()}</p>
            <p>${playlist.recommendations.length} músicas</p>
            <a href="${playlist.recommendations[0].url}" target="_blank">
                <span class="material-symbols-outlined">play_arrow</span>
            </a>
        </div>
    `;
}
