"use strict";

export class Player {
  constructor(initialY = 200) {
    this.x = 0;
    this.y = initialY;
    this.vy = 0;
    this.gravity = 0.40;
    this.flapStrength = 9;
    this.width = 44;
    this.height = 34;
  }

  // aplicar gravedad
  applyGravity(dt) {
    this.vy += this.gravity * dt;
  }

  // actualizar posicion en y
  updatePosition(dt) {
    this.y += this.vy * dt;
  }

  // limita la posicion del personaje al limite de la pantalla
  constrainToGameBounds(gameHeight) {
    this.y = Math.max(0, Math.min(gameHeight - this.height, this.y));
  }

  // aleteo
  flap() {
    this.vy = -this.flapStrength;
  }

  // reinicia posicion y velocidad de caida
  reset(initialY = 200) {
    this.y = initialY;
    this.vy = 0;
  }

  // la rotación del jugador en base a su velocidad vertical
  getTilt() {
    return Math.max(-45, Math.min(45, this.vy * 3));
  }
}
