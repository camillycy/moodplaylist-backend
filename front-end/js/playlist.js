const API_URL = "http://localhost:3000/api/spotify";

document.addEventListener("DOMContentLoaded", async () => {
  const moodElem = document.getElementById("mood");
  const typeElem = document.getElementById("type");
  const recommendationsDiv = document.getElementById("recommendations");
  const btnBack = document.getElementById("back-btn");

  // Pegamos o que foi salvo no localStorage
  const saved = localStorage.getItem("tempPlaylist");

  if (!saved) {
    recommendationsDiv.innerHTML = `<p>❌ Nenhuma playlist encontrada.</p>`;
    return;
  }

  const playlistData = JSON.parse(saved);
  localStorage.removeItem("tempPlaylist");

  const playlist = playlistData.playlist;

  if (!playlist || !playlist.recommendations || playlist.recommendations.length === 0) {
    recommendationsDiv.innerHTML = `<p>❌ Nenhuma playlist recebida.</p>`;
    return;
  }

  moodElem.textContent = `Humor detectado: ${playlist.mood}`;
  typeElem.textContent = `Tipo: ${playlist.type}`;

  recommendationsDiv.innerHTML = "";

  // Pega apenas a primeira recomendação
  const rec = playlist.recommendations[0];
  const card = document.createElement("div");
  card.classList.add("music-card");

  card.innerHTML = `
    <img src="${rec.image ?? 'default.jpg'}" alt="Capa" class="music-image">
    <div>
      <h3>${rec.name}</h3>
      <a href="${rec.url}" target="_blank">Abrir no Spotify</a>
    </div>
  `;
  recommendationsDiv.appendChild(card);

  btnBack.addEventListener("click", () => {
    window.location.href = "home.html";
  });
});
