"use strict";

import { Player } from "./Player.js";
import { Pipe } from "./Pipe.js";

export class GameController {
  constructor() {
    this.player = new Player(200);
    this.worldX = 0;
    this.running = false;
    this.lastTs = null;

    // tubos (obstáculos)
    this.pipes = [];
    this.pipeSpacing = 400; // distancia entre columnas de tubos (ajustable)
    this.pipeSpeed = 2.5; // px por frame (usa el mismo dt que el jugador)
    this.lastPipeSpawn = 0;

    this.startElements();

    this.init();

    this.play();


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
    
    // limpiar tubos previos
    if (this.pipes && this.pipes.length) {
      this.pipes.forEach(p => p.destroy());
      this.pipes = [];
    }
    this.lastPipeSpawn = 0;
    // generar un primer conjunto de tubos un poco adelante
    if (this.gameEl) this.createPipe(this.gameEl.clientWidth + 50);

    // aletea al empezar para que no caiga automaticamente
    this.flap();
  }

  // crea y anexa un nuevo Pipe al juego
  createPipe(startX) {
    const pipe = new Pipe(this.gameEl, startX);
    this.pipes.push(pipe);
    return pipe;
  }

  killPlayer() {
    this.player.die();
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
    
      // actualizar posición del mundo (usa worldX para spawns)
      this.worldX += this.pipeSpeed * dt;

      // actualizar tubos: moverlos y eliminar los que salieron de pantalla
      if (this.pipes && this.pipes.length) {
        for (let i = this.pipes.length - 1; i >= 0; i--) {
          const p = this.pipes[i];
          p.update(dt, this.pipeSpeed);
          if (p.getX() + p.segmentWidth < 0) {
            p.destroy();
            this.pipes.splice(i, 1);
          }
        }
      }

      // spawnear nuevos tubos cuando la distancia se cumple
      if (this.worldX - this.lastPipeSpawn >= this.pipeSpacing) {
        const spawnX = this.gameEl ? this.gameEl.clientWidth : window.innerWidth;
        this.createPipe(spawnX + 10);
        this.lastPipeSpawn = this.worldX;
      }

      // actualiza posicion del jugaodr en pantalla
      this.updatePlayerDom();
      requestAnimationFrame((ts) => this.loop(ts));
    }


  }
}