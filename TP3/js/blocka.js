const images = document.querySelectorAll('.image-option');
const playButton = document.getElementById('play-button');
const levelSelect = document.getElementById('level-select');
const menuContainer = document.getElementById('game-menu');
let selectedImage = null;

// Manejar clic en imágenes
images.forEach(img => {
    img.addEventListener('click', () => {
        const imagePath = img.dataset.image;
        const level = parseInt(levelSelect.value);
        startGame(imagePath, level);
    });
});

// Manejar botón jugar con animación
playButton.addEventListener('click', () => {
    playRandomWithAnimation();
});

function playRandomWithAnimation() {
    let currentIndex = 0;
    const animationDuration = 500; // ms por imagen
    const totalCycles = 8; // número de ciclos completos
    let cycleCount = 0;

    const interval = setInterval(() => {
        // Remover clase de la imagen anterior
        images.forEach(img => img.classList.remove('animating'));
        
        // Agregar clase a la imagen actual
        images[currentIndex].classList.add('animating');
        
        currentIndex++;
        
        if (currentIndex >= images.length) {
            currentIndex = 0;
            cycleCount++;
        }

        if (cycleCount >= totalCycles) {
            clearInterval(interval);
            
            // Seleccionar imagen aleatoria final
            const randomIndex = Math.floor(Math.random() * images.length);
            images.forEach(img => img.classList.remove('animating'));
            images[randomIndex].classList.add('selected');
            
            // Iniciar juego después de un momento
            setTimeout(() => {
                const imagePath = images[randomIndex].dataset.image;
                const level = parseInt(levelSelect.value);
                startGame(imagePath, level);
            }, 600);
        }
    }, animationDuration);
}

function startGame(imagePath, level) {
    // Ocultar todos los elementos del menú
    menuContainer.classList.add('hidden');

    const gamePage = document.querySelector('.game-container');
    gamePage.classList.remove('hidden');
    // Crear instancia del juego
    const game = new PuzzleGame(imagePath, level);
}






const IMAGE_BANK = [
    'images/Peg solitaire/fenix-juego.png',
    'images/blocka/imagenUno.jpg',
    'images/blocka/imagenDos.png',
    'images/blocka/imagenTres.jpg',
    'images/blocka/imagenCuatro.jpg',
    'images/blocka/imagenCinco.jpeg',
    'images/blocka/imagen seis.jpg'
];
const FILTERS = [
    'grayscale(100%)', //Nivel 1: Escala de grises
    'sepia(100%) contrast(120%)', //Nivel 2: Sepia con contraste
    'invert(100%) blur(1.5px)',   //Nivel 3: Colores invertidos con desenfoque
];

class PuzzleGame {
    constructor(imageIndex, level = 1) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.pieces = [];
        this.timerInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPlaying = false;
        this.imageLoaded = false;
        this.gridSize = 2; // Default grid size
        this.level = level;
        
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
        this.pieceSelect = document.getElementById('pieceSelect');
        // Asegurar que el botón comience deshabilitado hasta que la imagen termine de cargar
        if (this.startBtn) {
            this.startBtn.disabled = true;
        }
        // Si no hay una selección válida en pieceSelect, marcar como "required" en el DOM
        if (this.pieceSelect) {
            // Añadir una opción vacía si no existe para forzar elección
            if (!this.pieceSelect.querySelector('option[value=""]')) {
                const placeholder = document.createElement('option');
                placeholder.value = '';
                placeholder.textContent = '-- Seleccioná cantidad --';
                placeholder.selected = true;
                placeholder.disabled = true;
                this.pieceSelect.insertBefore(placeholder, this.pieceSelect.firstChild);
            }
            // Resetear selección al iniciar cada nivel para forzar que el usuario elija
            this.pieceSelect.value = '';
        }
    }

    initEvents() {
        if (this.startBtn) {
            // Usar onclick para evitar acumular listeners entre instancias
            this.startBtn.onclick = () => this.showStartScreen();
        }
        if (this.pieceSelect) {
            // Usar onchange (sobrescribe el anterior) para forzar selección por nivel
            this.pieceSelect.onchange = (e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) {
                    this.gridSize = val / 2;
                    // Habilitar startBtn solo si la imagen ya cargó y la selección es válida
                    if (this.imageLoaded && this.startBtn) this.startBtn.disabled = false;
                } else {
                    if (this.startBtn) this.startBtn.disabled = true;
                }
            };
        }
    }

    loadImage(imagePath) {
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
            // Sólo habilitar startBtn si el usuario ya eligió la cantidad de piezas
            const hasValidSelection = this.pieceSelect && this.pieceSelect.value && !isNaN(parseInt(this.pieceSelect.value));
            if (hasValidSelection && this.startBtn) this.startBtn.disabled = false;
            // Dibujar imagen para preparar las piezas (pero no mostrarla)
            this.setupCanvas();
            // El canvas se usa sólo como buffer; mantenerlo oculto para que no se muestre junto a las piezas
            if (this.canvas) this.canvas.style.display = 'none';
        };
        this.image.onerror = () => {
            console.error('Error cargando la imagen:', imagePath);
        };
        // Asignar la fuente fuera del onload para que comience la carga
        this.image.src = imagePath;
    }

    setupCanvas() {
        const targetSize = 1024;
        this.canvas.width = targetSize;
        this.canvas.height = targetSize;

        const img = this.image;
        const ctx = this.ctx;

        // Limpiamos el canvas
        ctx.clearRect(0, 0, targetSize, targetSize);

        // Calculamos cómo recortar la imagen para que quede cuadrada (centrada)
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;

        // Dibujamos el área central recortada al tamaño cuadrado del canvas
        ctx.drawImage(img, sx, sy, side, side, 0, 0, targetSize, targetSize);
    }

    applyFilter(filterStyle) {
        this.canvas.style.filter = filterStyle;
    }

    showStartScreen() {
        if (!this.imageLoaded) {
            alert("La imagen todavía se está cargando. Espera un momento y vuelve a intentar.");
        return;
    }
        this.gameWindow.querySelector('.start-screen').style.display = 'none';
        // Ocultar el canvas original: mostraremos sólo el contenedor de piezas
        this.canvas.style.display = 'none';

        this.successMessage.style.display = 'none';
        this.isPlaying = true;
        this.startBtn.disabled = true;

        // aplicar filtro según nivel
        this.applyFilter(FILTERS[this.level - 1] || 'none');

        // crear piezas (se mostrarán en lugar del canvas) y arrancar
        this.createPuzzlePieces();
        this.startTimer();
    }

    createPuzzlePieces() {
        this.pieces = [];
        const pieceSize = this.canvas.width / this.gridSize;
        // Si ya existe un contenedor, reutilizarlo (evitar duplicados)
        let container = this.gameWindow.querySelector('.puzzle-container');
        if (container) {
            // limpiar contenido previo
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.className = 'puzzle-container';
        }
        container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        const maxSize = Math.min(300, this.canvas.width);
        container.style.width = maxSize + 'px';
        container.style.height = maxSize + 'px';
        // Asegurar que el contenedor sea visible y herede el filtro aplicado al canvas
        container.style.display = 'grid';
        // Aplicar filtro visual al contenedor (no al canvas-buffer)
        container.style.filter = this.canvas ? (this.canvas.style.filter || 'none') : 'none';

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceSize;
                pieceCanvas.height = pieceSize;
                
                const pieceCtx = pieceCanvas.getContext('2d');
                if (this.level >= 3) {
                    const randomFilter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
                    pieceCtx.filter = randomFilter;
                }
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
        // quitar filtro al completar
        this.canvas.style.filter = 'none';

        // avanzar de nivel si hay más
        if (this.level < 4) {
            setTimeout(() => {
                alert(`Nivel ${this.level} completado. ¡Pasando al nivel ${this.level + 1}!`);
                const nextLevel = this.level + 1;
                const newImage = getRandomImage();
                const newGame = new PuzzleGame(newImage, nextLevel);
            }, 2000);
        } else {
            setTimeout(() => {
                alert("🎉 ¡Felicitaciones! Completaste todos los niveles.");
                if (this.startBtn) this.startBtn.disabled = true;
            }, 2000);
        }
        
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

// función auxiliar para seleccionar una imagen aleatoria
function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * IMAGE_BANK.length);
    return IMAGE_BANK[randomIndex];
}