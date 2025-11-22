"use strict";

import { GameController } from "./GameController.js";


const playButton = document.querySelector('#play-btn');

playButton.addEventListener('click', () => {

  document.querySelector('.game-stats').classList.remove('hidden');
  document.querySelector('.instructions').classList.add('hidden');
  new GameController();

});



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