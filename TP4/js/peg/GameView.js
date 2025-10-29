
export class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cellSize = 50;
        this.pegRadius = 18;
        this.hintPositions = [];
    }

    drawBoard(model) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar tablero
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;

                if (model.board[row][col] !== 0) {
                    // Dibujar celda
                    this.ctx.fillStyle = '#8B7355';
                    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                    
                    this.ctx.strokeStyle = '#6B5345';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                    // Dibujar hueco
                    const centerX = x + this.cellSize / 2;
                    const centerY = y + this.cellSize / 2;
                    this.ctx.fillStyle = '#4A3525';
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, this.pegRadius, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    drawPegs(model) {
        for (let row = 0; row < model.boardSize; row++) {
            for (let col = 0; col < model.boardSize; col++) {
                if (model.hasPeg(row, col)) {
                    const x = col * this.cellSize + this.cellSize / 2;
                    const y = row * this.cellSize + this.cellSize / 2;
                    this.drawPeg(x, y);
                }
            }
        }
    }

    drawPeg(x, y) {
        // Ficha roja
        this.ctx.fillStyle = '#DC143C';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pegRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Borde
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Brillo
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(x - 10, y - 10, 12, 0, Math.PI * 2);
        this.ctx.fill();
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

    drawDraggingPeg(x, y) {
        this.drawPeg(x, y);
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
}