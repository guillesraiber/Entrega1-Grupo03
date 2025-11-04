
export class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 50;
        this.pegRadius = 20;
        this.hintPositions = [];

        // lista de imagenes posibles para las fichas (se eligen aleatoriamente)
        this.imageSources = [
            'images/Juego-Peg-Solitaire/chispa-clara.png',
            'images/Juego-Peg-Solitaire/chispa-intermedia.png',
            'images/Juego-Peg-Solitaire/chispa-oscura.png',
        ];

        // arreglo de objetos Image y estado de carga
        this.ballImages = [];
        this.ballImagesLoaded = [];
        this.loadedImagesCount = 0;
        this.preparePegImages();
    }

    drawBoard(model) {
        this.clearCanvas();

        // dibujar tablero
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                if (model.board[row][col] !== 0) {
                    // color del tablero
                    this.ctx.fillStyle = '#3C4F68';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

                    // bordes divisores del tablero
                    this.ctx.strokeStyle = '#212C39';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                    // agujeros de las fichas
                    const centerX = x + this.cellSize / 2;
                    const centerY = y + this.cellSize / 2;
                    this.ctx.fillStyle = '#1B232D';
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, this.pegRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    drawPegs(model) {
        // se intentan dibujar las fichas, si no hay imágenes cargadas, drawPeg usa el "por si acaso"
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                if (model.hasPeg(row, col)) {
                    const x = col * this.cellSize + this.cellSize / 2;
                    const y = row * this.cellSize + this.cellSize / 2;
                    // se pide al modelo el indice de imagen asociado a esta ficha (puede ser null)
                    const imgIdx = (typeof model.getPegImageIndex === 'function') ? model.getPegImageIndex(row, col) : null;
                    this.drawPeg(x, y, imgIdx);
                }
            }
        }
    }

    // imageIndex opcional, si se proporciona y la imagen está cargada, se usa
    drawPeg(x, y, imageIndex = null) {
        const diameter = this.pegRadius * 2;

        // si se pasa el indice de imagen y esta cargado, dibujarlo
        if (imageIndex !== null && this.ballImagesLoaded[imageIndex] && this.ballImages[imageIndex]) {
            const img = this.ballImages[imageIndex];
            this.ctx.drawImage(img, x - this.pegRadius, y - this.pegRadius, diameter, diameter);
            return;
        }

        // si no se paso indice o la imagen no está disponible, elegimos aleatoriamente entre las cargadas
        const availableIndexes = this.ballImagesLoaded
            .map((loaded, idx) => loaded ? idx : -1)
            .filter(idx => idx >= 0);

        if (availableIndexes.length > 0) {
            const randomIdx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
            const img = this.ballImages[randomIdx];
            if (img) {
                this.ctx.drawImage(img, x - this.pegRadius, y - this.pegRadius, diameter, diameter);
                return;
            }
        }

        // "por si acaso", si no hay imagenes cargadas, dibujar una ficha simple como círculo
        this.ctx.fillStyle = '#d6b37aff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pegRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#8b5a2bff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // validMoves: array de movimientos, timestamp opcional (ms) para animacion
    drawHints(validMoves, timestamp = null) {
        this.hintPositions = [];

        // si no se pasó timestamp usar performance.now() si está disponible
        const t = (typeof timestamp === 'number') ? timestamp : (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const period = 1500; // 1.5 segundos
        const phase = (t % period) / period;
        // pulso suave - sin wave normalizada 0..1
        const wave = 0.5 + 0.5 * Math.sin(phase * 2 * Math.PI);

        // alpha para el brillo y blur para la dispersion
        const minAlpha = 0.15;
        const maxAlpha = 0.95;
        const alpha = minAlpha + (maxAlpha - minAlpha) * wave;
        const minBlur = 5;
        const maxBlur = 30;
        const blur = minBlur + (maxBlur - minBlur) * wave;

        validMoves.forEach(move => {
            const x = move.toCol * this.cellSize + this.cellSize / 2;
            const y = move.toRow * this.cellSize + this.cellSize / 2;

            // sombra/halo para crear el glow
            this.ctx.shadowColor = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.shadowBlur = blur;

            // círculo de relleno con alpha variable
            this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pegRadius, 0, Math.PI * 2);
            this.ctx.fill();

            // borde con mayor contraste (sin tanta sombra)
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = `rgba(255, 165, 0, ${0.6 * alpha})`;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();

            this.hintPositions.push({ row: move.toRow, col: move.toCol });
        });
    }

    drawDraggingPeg(x, y, imageIndex = null) {
        // dibujar la ficha que se está arrastrando con su indice de imagen (si se proporcionó)
        this.drawPeg(x, y, imageIndex);
    }

    getBoardPosition(mouseX, mouseY) {
        const col = Math.floor(mouseX / this.cellSize);
        const row = Math.floor(mouseY / this.cellSize);
        return { row, col };
    }

    updatePegsCount(count) {
        document.getElementById('pegsCount').textContent = count;
    }

    // timeExpired indica si la partida terminó por agotamiento del tiempo
    showGameOver(pegsRemaining, time, timeExpired = false) {
        const modal = document.getElementById('gameOver');
        const message = document.getElementById('gameOverMessage');

        if (timeExpired) {
            // mensaje específico cuando se pierde por tiempo
            message.innerHTML = `Se acabó el tiempo, Perdiste.<br>Fichas restantes: ${pegsRemaining}<br>Tiempo: ${time}`;
        } else if (pegsRemaining === 1) {
            message.innerHTML = `¡Perfecto! Completaste el juego.<br>Tiempo: ${time}`;
        } else {
            message.innerHTML = `No hay más movimientos posibles.<br>Fichas restantes: ${pegsRemaining}<br>Tiempo: ${time}`;
        }

        modal.classList.add('show');
    }

    hideGameOver() {
        let message = document.getElementById('gameOver');
        if (message) {
            if (message.classList.contains('show')) {
                message.classList.remove('show');
            }
        }    
            
    }

    preparePegImages() {
        // pre-cargar todas las imágenes definidas en imageSources
        this.imageSources.forEach((src, idx) => {
            const img = new Image();
            img.src = src;
            this.ballImages[idx] = img;
            this.ballImagesLoaded[idx] = false;
            img.onload = () => {
                this.ballImagesLoaded[idx] = true;
                this.loadedImagesCount++;
            };
            // no se hace nada especial en onerror, esta el "por si acaso" en drawPeg por si acaso 
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}