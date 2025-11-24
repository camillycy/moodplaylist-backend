const btnMenu = document.getElementById("openMenu");

let menuLoaded = false;
let menuOverlay = null;
let menuBackdrop = null;

async function loadMenu() {
    if (menuLoaded) return;

    try {
        const response = await fetch("menu.html");
        const html = await response.text();

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        menuOverlay = tempDiv.querySelector(".menu-overlay");
        menuBackdrop = tempDiv.querySelector(".menu-backdrop");

        document.body.appendChild(menuOverlay);
        document.body.appendChild(menuBackdrop);

   

        // clicar no backdrop fecha
        menuBackdrop.addEventListener("click", closeMenu);

        const logoutBtn = menuOverlay.querySelector("#logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        closeMenu();
        localStorage.clear(); // remove userId e tudo mais

        setTimeout(() => {
            window.location.href = "index.html"; // redireciona após animação
        }, 250);
    });
}


        // LÓGICA — botão HOME
        const goHomeBtn = menuOverlay.querySelector("#goHome");
        if (goHomeBtn) {
            goHomeBtn.addEventListener("click", () => {
                closeMenu();
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 250); // tempo da animação opcional
            });
        }

        menuLoaded = true;

        // CARREGAR OS DADOS DO USUÁRIO ASSIM QUE O MENU EXISTIR
        await preencherMenuComUsuario();

    } catch (err) {
        console.error("Erro ao carregar menu.html:", err);
    }
}

async function preencherMenuComUsuario() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`);
        const user = await res.json();

        const imgMenu = menuOverlay.querySelector("#menuProfileImg");
        const nameMenu = menuOverlay.querySelector("#menuUserName");

        // Atualiza imagem
        if (user.profilePicture) {
            imgMenu.src = `${user.profilePicture}?t=${Date.now()}`;
        }

        // Atualiza nome
        if (user.name) nameMenu.textContent = user.name;

    } catch (err) {
        console.error("Erro ao carregar dados do usuário no menu:", err);
    }
}


async function openMenu() {
    await loadMenu();
    if (!menuOverlay || !menuBackdrop) return;

    menuOverlay.classList.add("active");
    menuBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";

    btnMenu.classList.add("active");
}

function closeMenu() {
    if (!menuOverlay || !menuBackdrop) return;

    menuOverlay.classList.remove("active");
    menuBackdrop.classList.remove("active");
    document.body.style.overflow = "";

    btnMenu.classList.remove("active");
}

btnMenu?.addEventListener("click", () => {
    if (btnMenu.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }
});

// ESC fecha menu
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
});
