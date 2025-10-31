import { GameModel } from "./GameModel.js";
import { GameView } from "./GameView.js";

export class GameController {
    constructor() {
        this.model = new GameModel();
        this.view = new GameView('gameCanvas');
        this.selectedPeg = null;
        this.isDragging = false;
        this.dragX = 0;
        this.dragY = 0;
        this.validMoves = [];
        this.timer = 0;
        this.timerInterval = null;
        
        setTimeout(() => {
            this.setupEventListeners();
            this.render();
            this.startTimer();    
        }, 1500);
        
    }

    setupEventListeners() {
        this.view.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.view.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.view.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(e) {
        const rect = this.view.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const pos = this.view.getBoardPosition(mouseX, mouseY);

        if (this.model.hasPeg(pos.row, pos.col)) {
            this.selectedPeg = pos;
            this.isDragging = true;
            this.dragX = mouseX;
            this.dragY = mouseY;
            this.validMoves = this.model.getValidMoves(pos.row, pos.col);
            this.render();
        }
    }

    handleMouseMove(e) {
        if (this.isDragging && this.selectedPeg) {
            const rect = this.view.canvas.getBoundingClientRect();
            this.dragX = e.clientX - rect.left;
            this.dragY = e.clientY - rect.top;
            this.render();
        }
    }

    handleMouseUp(e) {
        if (this.isDragging && this.selectedPeg) {
            const rect = this.view.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const pos = this.view.getBoardPosition(mouseX, mouseY);

            const moveSuccess = this.model.makeMove(
                this.selectedPeg.row, 
                this.selectedPeg.col, 
                pos.row, 
                pos.col
            );

            if (moveSuccess) {
                this.view.updatePegsCount(this.model.pegsRemaining);
                
                // Verificar fin del juego
                if (!this.model.hasAnyValidMoves()) {
                    this.endGame();
                }
            }

            this.selectedPeg = null;
            this.isDragging = false;
            this.validMoves = [];
            this.render();
        }
    }

    render() {
        this.view.drawBoard(this.model);
        
        // Dibujar fichas excepto la que está siendo arrastrada
        for (let row = 0; row < this.model.boardSize; row++) {
            for (let col = 0; col < this.model.boardSize; col++) {
                if (this.model.hasPeg(row, col)) {
                    if (!this.selectedPeg || 
                        this.selectedPeg.row !== row || 
                        this.selectedPeg.col !== col) {
                        const x = col * this.view.cellSize + this.view.cellSize / 2;
                        const y = row * this.view.cellSize + this.view.cellSize / 2;
                        this.view.drawPeg(x, y);
                        console.log("imagen loaded: " + this.view.pegBallImageLoaded);
                    }
                }
            }
        }

        // Dibujar hints si hay una ficha seleccionada
        if (this.selectedPeg && this.validMoves.length > 0) {
            this.view.drawHints(this.validMoves);
        }

        // Dibujar ficha siendo arrastrada
        if (this.isDragging && this.selectedPeg) {
            this.view.drawDraggingPeg(this.dragX, this.dragY);
        }
    }

    startTimer() {
        this.timer = 0;
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('timerDisplay').textContent = display;
    }

    endGame() {
        clearInterval(this.timerInterval);
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.view.showGameOver(this.model.pegsRemaining, timeStr);
    }

    restart() {
        clearInterval(this.timerInterval);
        this.model.reset();
        this.selectedPeg = null;
        this.isDragging = false;
        this.validMoves = [];
        this.view.updatePegsCount(this.model.pegsRemaining);
        this.view.hideGameOver();
        this.startTimer();
        this.render();
    }
}