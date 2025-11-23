"use strict";

export class Interactable {
  // type: 'coin' | 'heart'
  constructor(gameEl, startX, type = 'coin') {
    this.gameEl = gameEl;
    this.x = startX;
    this.type = type;
    this.width = 40;
    this.height = 40;
    this._collected = false;

    this.elem = document.createElement('div');
    this.elem.className = 'interactable interactive-icon';
    // agregar clase especifica para el estilo (usa las clases existentes)
    if (this.type === 'coin') this.elem.classList.add('coin-icon');
    else if (this.type === 'heart') this.elem.classList.add('health-icon');

    this.elem.style.position = 'absolute';
    this.elem.style.left = Math.round(this.x) + 'px';
    // colocar en Y aleatoria dentro del gameEl
    const maxTop = this.gameEl ? (this.gameEl.clientHeight - this.height) : (window.innerHeight - this.height);
    const top = Math.max(0, Math.floor(Math.random() * Math.max(1, maxTop)));
    this.y = top;
    this.elem.style.top = Math.round(this.y) + 'px';
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';

    if (this.gameEl) this.gameEl.appendChild(this.elem);
  }

  update(dt, speed) {
    this.x -= (speed * dt);
    if (this.elem) this.elem.style.left = Math.round(this.x) + 'px';
  }

  getX() { return this.x; }
  getY() { return this.y; }

  destroy() {
    if (this.elem && this.elem.parentNode) this.elem.parentNode.removeChild(this.elem);
    this.elem = null;
  }
}
