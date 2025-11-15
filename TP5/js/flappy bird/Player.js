"use strict";

class Player {
  constructor(initialY = 170) {
    this.x = 0;
    this.y = initialY;
    this.vy = 0;
    this.gravity = 0.45;
    this.flap = -9;
    this.width = 44;
    this.height = 34;
  }

  // Aplica gravedad al jugador
  applyGravity(dt) {
    this.vy += this.gravity * dt;
  }

  // Actualiza la posición vertical del jugador
  updatePosition(dt) {
    this.y += this.vy * dt;
  }

  // Limita la posición del jugador dentro de los límites de la pantalla
  constrainToGameBounds(gameHeight) {
    this.y = Math.max(0, Math.min(gameHeight - this.height, this.y));
  }

  // Realiza el "flap" (salto)
  flap() {
    this.vy = this.flap;
  }

  // Reinicia la posición y velocidad del jugador
  reset(initialY = 170) {
    this.y = initialY;
    this.vy = 0;
  }

  // Retorna la rotación del jugador basada en su velocidad vertical
  getTilt() {
    return Math.max(-45, Math.min(45, this.vy * 3));
  }
}
