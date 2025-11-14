import { GameController } from "./GameController.js";

// lista de elementos que quiero mostrar mientras esta el juego
const selectorsInGame = [
    '.moves',
    '.timer',
    '.game-info-buttons',
    '#gameCanvas',
    '.game-over'
];

// lista de elementos que quiero mostrar mientras esta el menu
const selectorsInMenu = [
    '#in-game-title',
    '.instructions'
];

// comenzar juego
document.querySelector("#play-btn").addEventListener("click", () => {
    
    hideMenuElems();

    showGameElems();
    
    const game = new GameController();
    document.querySelectorAll(".btn-restart").forEach(btn => {
        btn.addEventListener("click", () => {
            game.restart();
        });
    });

    // volver al menu
    document.querySelector(".btn-go-to-menu").addEventListener("click", () => {
        
        game.endGameToMenu();
        hideGameElems();
        showMenuElems();
    });
});

function hideMenuElems() {

    selectorsInMenu.forEach(sel => {
        document.querySelectorAll(sel).forEach(elem => elem.classList.add('hidden'));
    });
}

// le saco el atributo hidden a los elementos del juego
function showGameElems() {

    selectorsInGame.forEach(sel => {
        document.querySelectorAll(sel).forEach(elem => elem.classList.remove('hidden'));
    });
}

function showMenuElems() {
    selectorsInMenu.forEach(sel => {
        document.querySelectorAll(sel).forEach(elem => elem.classList.remove('hidden'));
    });
}

function hideGameElems() {
    selectorsInGame.forEach(sel => {
        document.querySelectorAll(sel).forEach(elem => elem.classList.add('hidden'));
    });
}