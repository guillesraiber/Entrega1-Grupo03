"use strict";

import { GameController } from "./GameController.js";


// Si se aprieta al pescado en el manu, explota
const playerElem = document.querySelector('#flappyPlayer');
let hitCount = 0;
playerElem.addEventListener('click', () => {
    if (hitCount < 3) {
        hitPlayer();
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

function hitPlayer() {
    if (!playerElem.classList.contains("hit")) {

      playerElem.classList.add("hit");
      setTimeout(() => {
        playerElem.classList.remove("hit");
      }, 300);

    }
}

const playButton = document.querySelector('#play-btn');

playButton.addEventListener('click', () => {

    document.querySelector('.instructions').style.display = 'none';
    new GameController();

});