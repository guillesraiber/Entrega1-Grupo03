"use strict";

import { Player } from "./Player.js";

// Crea la instancia de FlappyBird cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  new FlappyBird();
});

class FlappyBird {
  constructor() {
    // Config y estado
    this.cfg = { worldSpeed: 2.4 };
    this.player = new Player(200);
    this.worldX = 0;
    this.running = false;
    this.lastTs = null;

    this.startElements();

    this.init();

    // Auto-start the game so input (flap) and physics are active immediately
    this.play();
    this.flap();
  }

  startElements() {
    this.playBtn = document.getElementById('play-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.playerElem = document.getElementById('flappyPlayer');
    // Try id first, fall back to class selector (HTML uses class="game-window")
    this.gameEl = document.getElementById('game-window') || document.querySelector('.game-window');
  }

  init() {
    // Entrada: flap
    window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); this.flap(); }});
    window.addEventListener('mousedown', () => this.flap());
    window.addEventListener('touchstart', e => { e.preventDefault(); this.flap(); }, { passive:false });

    // // Botones
    // this.playBtn.addEventListener('click', () => this.play());
    // this.stopBtn.addEventListener('click', () => this.stop());

    // start loop
    requestAnimationFrame((ts) => this.loop(ts));

  }

  // Realiza el flap (salto)
  flap() {
    if (!this.running) return;
    this.player.flap();
  }

  // Inicia el juego
  play() {
    this.running = true;
    this.lastTs = null;
    this.worldX = 0;
    this.player.reset(170);
  }

  // Detiene el juego
  stop() {
    this.running = false;
  }

  // Actualiza la posición visual del jugador
  updatePlayerDom() {
    if (!this.playerElem || !this.gameEl) return;
    const screenLeft = Math.round(this.gameEl.clientWidth * 0.2);
    this.playerElem.style.left = screenLeft + 'px';
    this.playerElem.style.top = Math.round(this.player.y) + 'px';
    const tilt = this.player.getTilt();
    this.playerElem.style.transform = `rotate(${tilt}deg)`;
  }

  // Loop principal (siempre corriendo para evitar dependencia de start instantáneo)
  loop(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min((ts - this.lastTs)/16.6667, 4);
    this.lastTs = ts;

    if (this.running) {

      // física jugador
      this.player.applyGravity(dt);
      this.player.updatePosition(dt);
      // límites: use game element height if available, otherwise fallback to window height
      const gameHeight = this.gameEl ? this.gameEl.clientHeight : window.innerHeight;
      this.player.constrainToGameBounds(gameHeight);
    }


    this.updatePlayerDom();
    requestAnimationFrame((ts) => this.loop(ts));
  }
}