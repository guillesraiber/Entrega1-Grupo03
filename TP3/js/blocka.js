class PuzzleGame {
    constructor(imageIndex) {
        this.images = [
            'images/Peg solitaire/img-descriptiva-1.png',
            'images/Peg solitaire/img-descriptiva-2.png',
            'images/Peg solitaire/img-descriptiva-3.png',
        ]
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.pieces = [];
        this.timerInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPlaying = false;
        this.imageLoaded = false;
        
        this.initElements();
        this.initEvents();
        this.loadImage(imageIndex);
    }

    initElements() {
        this.startBtn = document.getElementById('startBtn');
        this.timerDisplay = document.getElementById('timer');
        this.gameWindow = document.getElementById('gameWindow');
        this.successMessage = document.getElementById('successMessage');
        this.finalTimeDisplay = document.getElementById('finalTime');
    }

    initEvents() {
        this.startBtn.addEventListener('click', () => this.showStartScreen());
    }

    loadImage(imageIndex) {
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
            this.startBtn.disabled = false;
            this.setupCanvas();
        };
        this.image.src = this.images[imageIndex];
    }

    setupCanvas() {
        const size = Math.min(this.image.width, this.image.height);
        this.canvas.width = size;
        this.canvas.height = size;
        
        this.ctx.drawImage(
            this.image,
            (this.image.width - size) / 2,
            (this.image.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
        );
    }

    showStartScreen() {
        this.gameWindow.querySelector('.start-screen').style.display = 'block';
        this.canvas.style.display = 'none';
        if (this.gameWindow.querySelector('.puzzle-container')) {
            this.gameWindow.querySelector('.puzzle-container').remove();
        }
    
        if (!this.imageLoaded){ return;}

        this.gameWindow.querySelector('.start-screen').style.display = 'none';
        this.successMessage.style.display = 'none';
        this.isPlaying = true;
        this.startBtn.disabled = true;

        this.createPuzzlePieces();
        this.startTimer();
    }

    createPuzzlePieces() {
        this.pieces = [];
        const pieceSize = this.canvas.width / 2;

        const container = document.createElement('div');
        container.className = 'puzzle-container';
        
        const maxSize = Math.min(300, this.canvas.width);
        container.style.width = maxSize + 'px';
        container.style.height = maxSize + 'px';

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceSize;
                pieceCanvas.height = pieceSize;
                
                const pieceCtx = pieceCanvas.getContext('2d');
                pieceCtx.drawImage(
                    this.canvas,
                    col * pieceSize,
                    row * pieceSize,
                    pieceSize,
                    pieceSize,
                    0,
                    0,
                    pieceSize,
                    pieceSize
                );

                const rotations = [0, 90, 180, 270];
                const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

                const piece = {
                    canvas: pieceCanvas,
                    rotation: randomRotation,
                    correctRotation: 0,
                    row: row,
                    col: col
                };

                const pieceDiv = document.createElement('div');
                pieceDiv.className = 'puzzle-piece';
                pieceDiv.appendChild(pieceCanvas);
                pieceDiv.style.transform = `rotate(${randomRotation}deg)`;

                pieceDiv.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.rotatePiece(piece, pieceDiv, -90);
                });

                pieceDiv.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.rotatePiece(piece, pieceDiv, 90);
                });

                container.appendChild(pieceDiv);
                this.pieces.push({ piece, div: pieceDiv });
            }
        }

        if (this.gameWindow.querySelector('.puzzle-container')) {
            this.gameWindow.querySelector('.puzzle-container').remove();
        }
        this.gameWindow.appendChild(container);
    }

    rotatePiece(piece, div, degrees) {
        if (!this.isPlaying) return;

        piece.rotation = (piece.rotation + degrees) % 360;
        if (piece.rotation < 0) piece.rotation += 360;

        div.style.transform = `rotate(${piece.rotation}deg)`;

        setTimeout(() => this.checkWin(), 400);
    }

    checkWin() {
        const allCorrect = this.pieces.every(({ piece }) => 
            piece.rotation === piece.correctRotation
        );

        if (allCorrect && this.isPlaying) {
            this.winGame();
        }
    }

    winGame() {
        this.isPlaying = false;
        this.stopTimer();
        
        this.finalTimeDisplay.textContent = this.timerDisplay.textContent;
        this.successMessage.style.display = 'block';
        
        setTimeout(() => {
            this.startBtn.disabled = false;
        }, 2000);
    }

    startTimer() {
        this.startTime = Date.now();
        this.elapsedTime = 0;
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 100);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        const seconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        this.timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }
}

// Inicializar el juego con una imagen precargada
// Para cambiar la imagen, poneruna URL diferente
const game = new PuzzleGame(0);