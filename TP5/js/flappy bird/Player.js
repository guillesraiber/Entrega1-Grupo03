"use strict";

export class Player {
  constructor(initialY = 200) {
    this.x = 0;
    this.y = initialY;
    this.vy = 0;
    this.gravity = 0.37;
    this.flapStrength = 5.5;
    this.width = 44;
    this.height = 34;
    this.onGround = false;
    this.initElements();
  }

  initElements() {
    this.elem = document.querySelector('#flappyPlayer');
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
    const clampedY = Math.max(0, Math.min(gameHeight - this.height, this.y));
    const hitGround = clampedY >= (gameHeight - this.height);
    this.y = clampedY;
    if (hitGround) {
      // toca el piso
      this.vy = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }

  // aleteo
  flap() {
    this.vy = -this.flapStrength;
    this.onGround = false;

    if (this.elem && !this.elem.classList.contains("flap")) {
      this.elem.classList.add("flap");
      setTimeout(() => {
        this.elem.classList.remove("flap");
      }, 260);
    }
  }

  // reinicia posicion y velocidad de caida
  reset(initialY = 200) {
    this.y = initialY;
    this.vy = 0;
    this.onGround = false;
  }

  // la rotación del jugador en base a su velocidad vertical
  getTilt() {
    return Math.max(-45, Math.min(45, this.vy * 3));
  }

die(reason = "") {
  if (reason === 'groundTouch') {
    if (this.elem && !this.elem.classList.contains("ground-dead")) {
      this.elem.classList.add("ground-dead");
      setTimeout(() => {
        this.elem.classList.add("paused");
      }, 1000);
    }
  } else {
    if (this.elem && !this.elem.classList.contains("dead")) {
      this.elem.classList.add("dead");
      setTimeout(() => {
        this.elem.classList.remove("dead");
      }, 1000);
    }
  }

  }

  hurtPlayer() {
    if (this.elem && !this.elem.classList.contains("hit")) {

      this.elem.classList.add("hit");
      setTimeout(() => {
        this.elem.classList.remove("hit");
      }, 1000);

    }
}
}
