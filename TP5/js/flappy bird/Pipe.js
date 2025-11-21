"use strict";

export class Pipe {
	constructor(gameEl, startX, options = {}) {
		this.gameEl = gameEl;
		this.x = startX;
		this.segmentWidth = 75; // ancho de cada pieza de tubo
		this.segmentHeight = 98; // alto de cada pieza de tubo
		this.slots = 5; // cantidad total de posibles segmentos verticales
		this.gapIndex = (options.gapIndex !== undefined) ? options.gapIndex : Math.floor(Math.random() * this.slots);

		this.elem = document.createElement('div');
		this.elem.className = 'pipe-column';
		this.elem.style.position = 'absolute';
		this.elem.style.left = Math.round(this.x) + 'px';
		this.elem.style.top = '0px';
		this.elem.style.width = this.segmentWidth + 'px';
		this.elem.style.height = (this.segmentHeight * this.slots) + 'px';

		// Crear las piezas del tubo (cada una usa la clase .pipe definida en CSS).
		for (let i = 0; i < this.slots; i++) {
			if (i === this.gapIndex) continue; // dejar el hueco
			const seg = document.createElement('div');
			seg.className = 'pipe';
			seg.style.position = 'absolute';
			seg.style.left = '0px';
			seg.style.top = (i * this.segmentHeight) + 'px';

			// Selección aleatoria de imagen por segmento según probabilidades:
			// 50% normal-pipe, 20% circular-valve-pipe, 20% glass-pipe, 10% broken-pipe
			const rand = Math.random() * 100;
			let imgName;
			if (rand < 50) imgName = 'normal-pipe.png';
			else if (rand < 70) imgName = 'circular-valve-pipe.png';
			else if (rand < 90) imgName = 'glass-pipe.png';
			else imgName = 'broken-pipe.png';

			// Rutas relativas al HTML: 'images/Flappy Bird/Pipes/...'
			seg.style.backgroundImage = `url("images/Flappy Bird/Pipes/${imgName}")`;
			this.elem.appendChild(seg);
		}

		this.gameEl.appendChild(this.elem);
	}

	// Actualiza la posición horizontal del conjunto de tubos.
	// dt: factor relativo a 60fps (igual que en GameController), speed: px por "frame".
	update(dt, speed) {
		this.x -= (speed * dt);
		if (this.elem) this.elem.style.left = Math.round(this.x) + 'px';
	}

	// Método de compatibilidad (llamable desde fuera si se quiere separar lógica/DOM)
	render() {
		if (this.elem) this.elem.style.left = Math.round(this.x) + 'px';
	}

	getX() {
		return this.x;
	}

	getGapIndex() {
		return this.gapIndex;
	}

	// Elimina el DOM asociado
	destroy() {
		if (this.elem && this.elem.parentNode) this.elem.parentNode.removeChild(this.elem);
		this.elem = null;
	}
}