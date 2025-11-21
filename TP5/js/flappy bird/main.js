"use strict";

import { GameController } from "./GameController.js";


// Si se aprieta al pescado en el manu, explota
const playerElem = document.querySelector('#flappyPlayer');

playerElem.addEventListener('click', () => {

    if (!playerElem.classList.contains("dead")) {

      playerElem.classList.add("dead");
      setTimeout(() => {
        playerElem.classList.remove("dead");
      }, 1000);
    }

});


const playButton = document.querySelector('#play-btn');

playButton.addEventListener('click', () => {

    document.querySelector('.instructions').style.display = 'none';
    new GameController();

});