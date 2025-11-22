"use strict";

import { Player } from "./Player.js";
import { Pipe } from "./Pipe.js";

export class GameController {
  constructor() {
    this.player = new Player(200);
    this.worldX = 0;
    this.running = false;
    this.lastTs = null;

    // vidas
    this.lives = 3;

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
    this.gameOverEl = document.querySelector('#gameOver');
    this.gameOverTitle = document.querySelector('#game-over-title');
    this.gameOverMessage = document.querySelector('#game-over-message');
    // health icons in the UI
    this.healthIcons = [
      document.querySelector('.health-icon-1'),
      document.querySelector('.health-icon-2'),
      document.querySelector('.health-icon-3')
    ];
  }

  init() {
    // lo que hace que se aletee: usar funciones enlazadas para poder removerlas luego
    this._onKeyDown = (e) => { if (e.code === 'Space') { e.preventDefault(); this.flap(); } };
    this._onMouseDown = () => this.flap();
    this._onTouchStart = (e) => { e.preventDefault(); this.flap(); };

    window.addEventListener('keydown', this._onKeyDown);
    if (this.gameEl) this.gameEl.addEventListener('mousedown', this._onMouseDown);
    // toque como si fuera tactil/celular
    if (this.gameEl) this.gameEl.addEventListener('touchstart', this._onTouchStart, { passive:false });

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
    // asegurar que el jugador esté visible
    if (this.playerElem) this.playerElem.classList.remove('hidden');
    // resetear iconos de vida visibles
    if (this.healthIcons && this.healthIcons.length) {
      this.healthIcons.forEach(h => { if (h) h.classList.remove('hidden'); });
    }
    
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

  // limpiar y eliminar listeners para poder crear una nueva instancia sin duplicados
  dispose() {
    // detener loop
    this.running = false;

    // remover listeners enlazados
    try { window.removeEventListener('keydown', this._onKeyDown); } catch (e) {}
    try { if (this.gameEl) this.gameEl.removeEventListener('mousedown', this._onMouseDown); } catch (e) {}
    try { if (this.gameEl) this.gameEl.removeEventListener('touchstart', this._onTouchStart); } catch (e) {}

    // destruir todos los pipes
    if (this.pipes && this.pipes.length) {
      this.pipes.forEach(p => { try { p.destroy(); } catch (e) {} });
      this.pipes = [];
    }

    // asegurar que el overlay de game over esté oculto y quitar pausa de fondos
    try { if (this.gameOverEl) this.gameOverEl.classList.add('hidden'); } catch (e) {}
    try { if (this.gameEl) this.gameEl.classList.remove('paused'); } catch (e) {}

    // restaurar elemento jugador si fue escondido
    try { if (this.playerElem) this.playerElem.classList.remove('hidden'); } catch (e) {}

    // quitar referencias pesadas
    this._onKeyDown = null;
    this._onMouseDown = null;
    this._onTouchStart = null;
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

  endGame() {
    // detener la lógica del juego (no seguir moviendo el mundo)
    this.running = false;

    // pausar animaciones de fondo
    if (this.gameEl) this.gameEl.classList.add('paused');

    // reproducir animación de muerte
    try { this.player.die(); } catch (e) {}

    // eliminar del DOM después de la animacion (usar 1s como duración de la animacion en Player)
    setTimeout(() => {
      this.playerElem.classList.add("hidden");
    }, 1000);

    // mostrar pantalla de game over con mensaje
    if (this.gameOverEl) { this.gameOverEl.classList.remove('hidden'); }
    if (this.gameOverTitle) this.gameOverTitle.textContent = 'Juego terminado';
    if (this.gameOverMessage) this.gameOverMessage.textContent = 'Perdiste las 3 vidas';
  }

  // loop principal de actualizacion del juegp
  loop(ts) {
    if (!this.lastTs) this.lastTs = ts;
    const dt = Math.min((ts - this.lastTs)/16.6667, 4);
    this.lastTs = ts;

    if (this.running) {

      // fisica jugador
      this.player.applyGravity(dt);
      this.player.updatePosition(dt);
      // limites: use game element height si esta, si no usa el windowHeight
      const gameHeight = this.gameEl ? this.gameEl.clientHeight : window.innerHeight;
      this.player.constrainToGameBounds(gameHeight);
    
      // actualizar posicion del mundo (usa worldX para el spawn)
      this.worldX += this.pipeSpeed * dt;

      // actualizar tubos: mover y eliminar los que salieron de pantalla
      if (this.pipes && this.pipes.length) {
        for (let i = this.pipes.length - 1; i >= 0; i--) {
          const pipe = this.pipes[i];
          pipe.update(dt, this.pipeSpeed);
          if (pipe.getX() + pipe.segmentWidth < 0) {
            pipe.destroy();
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

      // DETECCIÓN DE COLISIONES: comprobar cada pipe contra el jugador
      if (this.pipes && this.pipes.length) {
        const screenLeft = Math.round(this.gameEl.clientWidth * 0.1);
        const playerLeft = screenLeft;
        const playerTop = Math.round(this.player.y);
        const playerRight = playerLeft + this.player.width;
        const playerBottom = playerTop + this.player.height;

        for (let i = 0; i < this.pipes.length; i++) {
          const pipe = this.pipes[i];
          if (!pipe || pipe._collided) continue;
          const pipeLeft = pipe.getX();
          const pipeRight = pipeLeft + pipe.segmentWidth;

          // comprobar solapamiento horizontal
          if (playerRight > pipeLeft && playerLeft < pipeRight) {
            const gapTop = pipe.getGapIndex() * pipe.segmentHeight;
            const gapBottom = gapTop + pipe.segmentHeight;

            // si el jugador NO está dentro del hueco vertical es una colisión
            if (playerTop < gapTop || playerBottom > gapBottom) {
              // marcar para evitar múltiples impactos del mismo tubo
              pipe._collided = true;

              // quitar una vida y reproducir animación de golpe
              this.lives = Math.max(0, this.lives - 1);
              if (this.lives > 0) { this.player.hurtPlayer(); }

              // actualizar iconos de vida
              if (this.healthIcons && this.healthIcons.length) {
                const idxToHide = this.lives; // indice de vida a ocultar
                if (this.healthIcons[idxToHide]) this.healthIcons[idxToHide].classList.add('hidden');
              }

              // eliminar el pipe que colisionó (DOM + array)
              pipe.destroy();

              // eliminar del array y ajustar el índice para seguir iterando correctamente
              this.pipes.splice(i, 1);
              i--;

              // si no quedan vidas terminar juego
              if (this.lives <= 0) {
                this.endGame();
              
              // si quedan vidas
              } else {
                // resetear jugador al medio vertical
                const midY = Math.round((this.gameEl.clientHeight - this.player.height) / 2);
                this.player.reset(midY);
                this.updatePlayerDom();
                // hacerlo volar para dar mas tiempo a reaccion
                this.flap();
              }

            }
          }
        }
      }

      // actualiza posicion del jugaodr en pantalla
      this.updatePlayerDom();
      requestAnimationFrame((ts) => this.loop(ts));
    }


  }
}