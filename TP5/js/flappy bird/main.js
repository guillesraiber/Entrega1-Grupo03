"use strict";

import { GameController } from "./GameController.js";


const playButton = document.querySelector('#play-btn');

// Mantener la instancia actual para poder eliminarla al reiniciar
let currentController = null;

function startNewGame() {
  // limpiar instancia previa si existe
  if (currentController && typeof currentController.dispose === 'function') {
    currentController.dispose();
  }
  document.querySelector('.game-stats').classList.remove('hidden');
  document.querySelector('.instructions').classList.add('hidden');
  currentController = new GameController();
}

playButton.addEventListener('click', () => {
  startNewGame();
});

// botón de reinicio dentro del overlay de game over
const restartBtn = document.querySelector('.btn-restart');
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    // ocultar overlay de game over
    const gameOverEl = document.querySelector('#gameOver');
    if (gameOverEl) gameOverEl.classList.add('hidden');
    // iniciar nueva partida
    startNewGame();
  });
}



// Si se aprieta 3 veces el pescado en el manu, explota
const playerElem = document.querySelector('#flappyPlayer');
let hitCount = 0;
playerElem.addEventListener('click', () => {
    if (hitCount <= 3) {
        hurtPlayer();
    } else {
        hitCount = 0;
        explotePlayer();
    }
    hitCount++;
});

function explotePlayer() {
    if (!playerElem.classList.contains("dead")) {

      playerElem.classList.add("dead");
      setTimeout(() => {
        playerElem.classList.remove("dead");
      }, 1000);
      
    }
}

function hurtPlayer() {
    if (!playerElem.classList.contains("hit")) {

      playerElem.classList.add("hit");
      setTimeout(() => {
        playerElem.classList.remove("hit");
      }, 300);

    }
}