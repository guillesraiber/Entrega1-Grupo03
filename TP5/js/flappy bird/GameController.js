"use strict";

import { Player } from "./Player.js";

// creo el juago cuando se carga la pagina
document.addEventListener('DOMContentLoaded', () => {
  new FlappyBird();
});

class FlappyBird {
  constructor() {
    this.player = new Player(200);
    this.worldX = 0;
    this.running = false;
    this.lastTs = null;

    this.startElements();

    this.init();

    // this.play();
  }

  startElements() {
    this.playBtn = document.querySelector('#play-btn');
    this.stopBtn = document.querySelector('#stop-btn');
    this.playerElem = document.querySelector('#flappyPlayer');
    this.gameEl = document.querySelector('#game-window');
  }

  init() {
    // lo que hace que se aletee
    window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); this.flap(); }});
    this.gameEl.addEventListener('mousedown', () => this.flap());
    // toque como si fuera tactil/celular
    this.gameEl.addEventListener('touchstart', e => { e.preventDefault(); this.flap(); }, { passive:false });

    // // Botones
    // this.playBtn.addEventListener('click', () => this.play());
    // this.stopBtn.addEventListener('click', () => this.stop());

    // empezar loop
    requestAnimationFrame((ts) => this.loop(ts));

  }

  // aleteo
  flap() {
    if (!this.running) return;
    this.player.flap();
  }

  // empezar
  play() {
    this.running = true;
    this.lastTs = null;
    this.worldX = 0;
    this.player.reset(200);
    
    // aletea al empezar para que no caiga automaticamente
    this.flap();
  }

  // frenar el juego
  stop() {
    this.running = false;
  }

  // actualiza posicion del jugador
  updatePlayerDom() {
    if (!this.playerElem || !this.gameEl) return;
    const screenLeft = Math.round(this.gameEl.clientWidth * 0.1);
    this.playerElem.style.left = screenLeft + 'px';
    this.playerElem.style.top = Math.round(this.player.y) + 'px';
    const tilt = this.player.getTilt();
    this.playerElem.style.transform = `rotate(${tilt}deg)`;
  }

  // loop principal de actualizacion del juegp
  loop(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min((ts - this.lastTs)/16.6667, 4);
    this.lastTs = ts;

    if (this.running) {

      // física jugador
      this.player.applyGravity(dt);
      this.player.updatePosition(dt);
      // límites: use game element height si esta, si no usa el windowHeight
      const gameHeight = this.gameEl ? this.gameEl.clientHeight : window.innerHeight;
      this.player.constrainToGameBounds(gameHeight);
    
          // actualiza posicion del jugaodr en pantalla
      this.updatePlayerDom();
      requestAnimationFrame((ts) => this.loop(ts));
    }


  }
}