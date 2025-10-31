
export class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 50;
        this.pegRadius = 20;
        this.hintPositions = [];
        // Lista de posibles imágenes para las fichas (se elegirán aleatoriamente)
        this.imageSources = [
            'images/Juego-Peg-Solitaire/chispa-clara.png',
            'images/Juego-Peg-Solitaire/chispa-intermedia.png',
            'images/Juego-Peg-Solitaire/chispa-oscura.png',
        ];

        // Arreglo de objetos Image y estado de carga
        this.ballImages = [];
        this.ballImagesLoaded = [];
        this.loadedImagesCount = 0;
        this.preparePegImages();
    }

    drawBoard(model) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar tablero
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                if (model.board[row][col] !== 0) {
                    // dibujar celda #8B7355
                    this.ctx.fillStyle = '#696e70ff';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

                    // bordes de celda #6B5345
                    this.ctx.strokeStyle = '#3f4549ff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                    // dibujar hueco #4A3525
                    const centerX = x + this.cellSize / 2;
                    const centerY = y + this.cellSize / 2;
                    this.ctx.fillStyle = '#3f4549ff';
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, this.pegRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    drawPegs(model) {
        // Intentamos dibujar las fichas; si no hay imágenes cargadas, drawPeg usará el fallback
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                if (model.hasPeg(row, col)) {
                    const x = col * this.cellSize + this.cellSize / 2;
                    const y = row * this.cellSize + this.cellSize / 2;
                    // Pedimos al modelo el índice de imagen asociado a esta ficha (puede ser null)
                    const imgIdx = (typeof model.getPegImageIndex === 'function') ? model.getPegImageIndex(row, col) : null;
                    this.drawPeg(x, y, imgIdx);
                }
            }
        }
    }

    // imageIndex (opcional): si se proporciona y la imagen está cargada, la usamos.
    drawPeg(x, y, imageIndex = null) {
        const diameter = this.pegRadius * 2;

        // Si nos pasaron un índice de imagen y está cargado, dibujarlo exactamente
        if (imageIndex !== null && this.ballImagesLoaded[imageIndex] && this.ballImages[imageIndex]) {
            const img = this.ballImages[imageIndex];
            this.ctx.drawImage(img, x - this.pegRadius, y - this.pegRadius, diameter, diameter);
            return;
        }

        // Si no se pasó índice o la imagen no está disponible, elegimos aleatoriamente entre las cargadas
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

        // Fallback: si no hay imágenes cargadas, dibujar una ficha simple como círculo
        this.ctx.fillStyle = '#d6b37aff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pegRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#8b5a2bff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawHints(validMoves) {
        this.hintPositions = [];
        validMoves.forEach(move => {
            const x = move.toCol * this.cellSize + this.cellSize / 2;
            const y = move.toRow * this.cellSize + this.cellSize / 2;
            
            // Hint amarillo
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.pegRadius, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#FFA500';
            this.ctx.lineWidth = 4;
            this.ctx.stroke();

            this.hintPositions.push({ row: move.toRow, col: move.toCol });
        });
    }

    drawDraggingPeg(x, y, imageIndex = null) {
        // Dibujar la ficha que se está arrastrando con su índice de imagen (si se proporcionó)
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

    showGameOver(pegsRemaining, time) {
        const modal = document.getElementById('gameOver');
        const message = document.getElementById('gameOverMessage');
        
        if (pegsRemaining === 1) {
            message.innerHTML = `🎉 ¡Perfecto! Completaste el juego con 1 ficha.<br>Tiempo: ${time}`;
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
        // Pre-cargar todas las imágenes definidas en imageSources
        this.imageSources.forEach((src, idx) => {
            const img = new Image();
            img.src = src;
            this.ballImages[idx] = img;
            this.ballImagesLoaded[idx] = false;
            img.onload = () => {
                this.ballImagesLoaded[idx] = true;
                this.loadedImagesCount++;
            };
            // No hacemos nada especial en onerror; el fallback en drawPeg cubrirá el caso
        });
    }
}