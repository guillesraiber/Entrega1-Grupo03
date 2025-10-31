import { GameController } from "./GameController.js";

let game = null;

document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const selectedTheme = parseInt(btn.dataset.theme);
        iniciarJuego(selectedTheme);
    });
});

function iniciarJuego(themeIndex) {
    // oculto el selector de temas
    document.querySelector(".theme-selector").classList.add("hidden");
    document.querySelector(".instructions").classList.add("hidden");

    mostrarElementosDelJuego();

    game = new GameController(themeIndex);

    document.querySelector(".btn-restart").addEventListener("click", () => {
        game.restart();
    });
};

// le saco el atributo hidden a los elementos del juego
function mostrarElementosDelJuego() {
    document.querySelectorAll(".hidden:not(.theme-selector):not(.instructions)").forEach(elem => {
        elem.classList.remove("hidden");
    });
}