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
    this.player = new Player(170);
    this.worldX = 0;
    this.running = false;
    this.lastTs = null;

    this.startElements();

    // selección de capas con filtro (si falta alguna, no rompe)
    const rawLayers = [
      { selector: '.layer1', speed: 0.18 },
      { selector: '.layer2', speed: 0.36 },
      { selector: '.layer3', speed: 0.56 },
      { selector: '.layer4', speed: 0.78 },
      { selector: '.layer5', speed: 1.00 }
    ];
    this.layers = rawLayers.map(r => {
      const el = document.querySelector(r.selector);
      return el ? { el, speed: r.speed } : null;
    }).filter(Boolean);

    this.init();
  }

  startElements() {
    this.playBtn = document.getElementById('play-btn');
    this.stopBtn = document.getElementById('stop-btn');
    this.playerEl = document.getElementById('flappyPlayer');
    this.gameEl = document.getElementById('flappyGame');
  }

  init() {
    // Entrada: flap
    window.addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); this.flap(); }});
    window.addEventListener('mousedown', () => this.flap());
    window.addEventListener('touchstart', e => { e.preventDefault(); this.flap(); }, { passive:false });

    // Botones
    this.playBtn.addEventListener('click', () => this.play());
    this.stopBtn.addEventListener('click', () => this.stop());

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
    if (!this.playerEl || !this.gameEl) return;
    const screenLeft = Math.round(this.gameEl.clientWidth * 0.2);
    this.playerEl.style.left = screenLeft + 'px';
    this.playerEl.style.top = Math.round(this.player.y) + 'px';
    const tilt = this.player.getTilt();
    this.playerEl.style.transform = `rotate(${tilt}deg)`;
  }

  // Loop principal (siempre corriendo para evitar dependencia de start instantáneo)
  loop(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min((ts - this.lastTs)/16.6667, 4);
    this.lastTs = ts;

    if (this.running) {
      // avanzar mundo
      this.worldX += this.cfg.worldSpeed * dt;

      // física jugador
      this.player.applyGravity(dt);
      this.player.updatePosition(dt);
      // límites
      this.player.constrainToGameBounds(this.gameEl.clientHeight);
    }

    // actualizar parallax: fondo mueve background-position X (técnica del Tema5)
    this.layers.forEach(layer => {
      // Calculamos offset en px
      const offset = - Math.round(this.worldX * layer.speed);
      // Aplicamos a backgroundPositionX; si no soporta, usamos backgroundPosition
      try {
        layer.el.style.backgroundPositionX = offset + 'px';
      } catch (e) {
        layer.el.style.backgroundPosition = offset + 'px 0';
      }
    });

    this.updatePlayerDom();
    requestAnimationFrame((ts) => this.loop(ts));
  }
}