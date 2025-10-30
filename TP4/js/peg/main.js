import { GameController } from "./GameController.js";

document.querySelector(".instructions").addEventListener("click", () => {
    
    // oculto instrucciones
    document.querySelector(".instructions").style.display = "none";

    mostrarElementosDelJuego();
    
    const game = new GameController();
    document.querySelector(".btn-restart").addEventListener("click", () => {
        game.restart();
    });
});

// le saco el atributo hidden a los elementos del juego
function mostrarElementosDelJuego() {
    const elementosHidden = document.querySelectorAll('.hidden');

    elementosHidden.forEach(elem => {
    elem.classList.remove('hidden');
    })

}