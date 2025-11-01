import { GameModel } from "./GameModel.js";
import { GameView } from "./GameView.js";

export class GameController {
    constructor() {
        this.model = new GameModel();
        this.view = new GameView('gameCanvas');
        this.selectedPeg = null;
        this.selectedImageIndex = null;
        this.isDragging = false;
        this.dragX = 0;
        this.dragY = 0;
        this.validMoves = [];
        this.timer = 0;
        this.timerInterval = null;
        this.animationFrame = null;
        // bind loop for RAF
        this.loop = this.loop.bind(this);
        
        setTimeout(() => {
            this.setupEventListeners();
            this.render();
            this.startTimer();
            // se empieza el loop de rendering cuando se arrastra una ficha
        }, 1000);
        
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
            // guardar índice de imagen de la ficha seleccionada para mantenerla constante
            this.selectedImageIndex = (typeof this.model.getPegImageIndex === 'function') ? this.model.getPegImageIndex(pos.row, pos.col) : null;
            this.isDragging = true;
            this.dragX = mouseX;
            this.dragY = mouseY;
            this.validMoves = this.model.getValidMoves(pos.row, pos.col);
            // empiezo render loop cuando arrastro
            this.startRenderLoop();
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
                
                if (!this.model.hasAnyValidMoves()) {
                    this.endGame();
                }
            }

            this.selectedPeg = null;
            this.selectedImageIndex = null;
            this.isDragging = false;
            this.validMoves = [];
            // paro el render loop porque pare de arrastrar
            this.stopRenderLoop();
            this.render();
        }
    }

    render(timestamp) {

        this.view.drawBoard(this.model);

        for (let row = 0; row < this.model.boardSize; row++) {
            for (let col = 0; col < this.model.boardSize; col++) {
                if (this.model.hasPeg(row, col)) {
                    // di se esta arrastrando esta ficha, saltearla (se dibuja como dragging)
                    if (this.isDragging && this.selectedPeg && this.selectedPeg.row === row && this.selectedPeg.col === col) {
                        continue;
                    }
                    const x = col * this.view.cellSize + this.view.cellSize / 2;
                    const y = row * this.view.cellSize + this.view.cellSize / 2;
                    const imgIdx = (typeof this.model.getPegImageIndex === 'function') ? this.model.getPegImageIndex(row, col) : null;
                    this.view.drawPeg(x, y, imgIdx);
                }
            }
        }

        // dibujar hints si hay una ficha seleccionada
        if (this.selectedPeg && this.validMoves.length > 0) {
            this.view.drawHints(this.validMoves, timestamp);
        }

        // dibujar ficha siendo arrastrada
        if (this.isDragging && this.selectedPeg) {
            this.view.drawDraggingPeg(this.dragX, this.dragY, this.selectedImageIndex);
        }
    }

    // requestAnimationFrame loop para animar hints hasta cuando el mouse no se mueve
    loop(timestamp) {
        // paso el timestamp para que el render sepa cuando y que animar
        this.render(timestamp);
        this.animationFrame = requestAnimationFrame(this.loop);
    }

    startRenderLoop() {
        if (!this.animationFrame) {
            this.animationFrame = requestAnimationFrame(this.loop);
        }
    }

    stopRenderLoop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
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
        // paro el renderloop cuando termina el juego (por las dudas)
        this.stopRenderLoop();
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.view.showGameOver(this.model.pegsRemaining, timeStr);
    }

    endGameToMenu() {
        this.endGame();

        this.model.reset();
        this.selectedPeg = null;
        this.isDragging = false;
        this.validMoves = [];
        this.view.updatePegsCount(this.model.pegsRemaining);
        this.view.hideGameOver();

        this.view.clearCanvas();
    }

    restart() {
        clearInterval(this.timerInterval);
        // paro el render loop por las dudas
        this.stopRenderLoop();
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