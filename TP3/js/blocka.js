
goToMenu();

function goToMenu() {
    const images = document.querySelectorAll('.image-option');
    const playButton = document.getElementById('play-button');
    const levelSelect = document.getElementById('level-select');
    const menuContainer = document.getElementById('game-menu');
    const gamePage = document.querySelector('.game-container');
    let selectedImage = null;

    // Manejar clic en imágenes
    images.forEach(img => {
        img.addEventListener('click', () => {
            const imageIndex = img.dataset.image;
            const level = parseInt(levelSelect.value);
            startGame(imageIndex, level);
        });
    });

    // Manejar botón jugar con animación
    playButton.addEventListener('click', () => {
        playRandomWithAnimation();
    });

    function playRandomWithAnimation() {
        let currentIndex = 0;
        const animationDuration = 300; // ms por imagen
        const totalCycles = 2; // número de ciclos completos
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
                    images[randomIndex].classList.remove('selected');
                }, 1000);
            }
        }, animationDuration);
    }

    function startGame(imagePath, level) {
        // Ocultar todos los elementos del menú
        menuContainer.classList.add('hidden');

        gamePage.classList.remove('hidden');
        // Crear instancia del juego
        const game = new PuzzleGame(imagePath, level);
    }

}







const IMAGE_BANK = [
    'images/blocka/imagenUno.jpg',
    'images/blocka/imagenDos.png',
    'images/blocka/imagenTres.jpg',
    'images/blocka/imagenCuatro.jpg',
    'images/blocka/imagenCinco.jpeg',
    'images/blocka/imagenSeis.jpg'
];







// JUEGO BLOCKA

class PuzzleGame {
    constructor(imageIndex, level = 0) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.pieces = [];
        this.timerInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPlaying = false;
        this.imageLoaded = false;
        this.goToMenu = null;
        this.nextLevel = null;
        this.gridSize = 2; // Default grid size
        this.level = level;
        this.imageIndex = imageIndex;
        this.isCountdown = false;
        this.helpUsed = false; //  ayudita
        this.helpPenaltySeconds = 0; // total de penalizacion por ayudita(s)
        this.maxTimeSeconds = this.getMaxTimeForLevel(this.level); // null or seconds
        
        
        this.initElements();
        this.initEvents();
        this.loadImage();
        this.startBtn.disabled = false;
    }

    initElements() {
        this.gameWindow = document.getElementById('gameWindow');
        this.levelNumber = document.getElementById('level-number');
        
        this.startBtn = document.getElementById('startBtn');
        this.nextLevel =  document.getElementById('next-level');
        this.goToMenu = document.getElementById('go-to-menu');
        this.retryLevel = document.getElementById('retry-level');
        this.retryMenu = document.getElementById('retry-menu');

        this.timerDisplay = document.getElementById('timer');
        this.finalTimeDisplay = document.getElementById('finalTime');

        this.successMessage = document.getElementById('successMessage');
        this.message = document.querySelector('#success-title');
        this.timeoutMsg = document.getElementById('timeoutMessage');
        
        this.pieceSelect = document.getElementById('pieceSelect');

        this.helpBtn = document.getElementById('helpBtn');
        
        // Ocultar ayudita si no es nivel 4, 5 o 6
        if (this.helpBtn) {
            if (this.level >= 4 && this.level <= 6) {
                this.helpBtn.style.display = 'inline-block';
            } else {
                this.helpBtn.style.display = 'none';
            }
        }
        
        // Asegurar que el botón comience deshabilitado hasta que la imagen termine de cargar
        if (this.startBtn) {
            this.startBtn.disabled = true;
        }

        this.setLevel();
    }

    initEvents() {
        if (this.startBtn) {
            // Usar onclick para evitar acumular listeners entre instancias
            this.startBtn.onclick = () => this.showStartScreen();
        }

        if (this.goToMenu) {
            this.goToMenu.onclick = () => {
                this.resetToMenuValues();
                goToMenu();
            }
        }

        if (this.nextLevel) {
            this.nextLevel.onclick = () => this.playNextLevel();
        }

        if (this.retryLevel) {
            this.retryLevel.onclick = () => this.playNextLevel();
        }

        if (this.retryMenu) {
            this.retryMenu.onclick = () => {
                this.resetValues();
                this.resetToMenuValues();
                this.timeoutMsg.classList.remove('hidden');
                goToMenu();
            };
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

        this.setupHelpButton();
    }
   setupHelpButton() {
    const helpBtn = document.getElementById("helpBtn");
    if (!helpBtn) return;

    // Ocultar o mostrar según el nivel
    if (this.level >= 4 && this.level <= 6) {
        helpBtn.style.display = "inline-block";
    } else {
        helpBtn.style.display = "none";
        return;
    }

    // Clonar para evitar listeners duplicados
    const newBtn = helpBtn.cloneNode(true);
    helpBtn.parentNode.replaceChild(newBtn, helpBtn);

    // Guardar referencia
    this.helpBtn = newBtn;

    // Estado inicial: deshabilitado hasta que se cargue la imagen
    this.helpBtn.disabled = true;
    this.helpBtn.classList.remove("help-active", "help-used", "help-yellow", "locked");

    // Click listener
    this.helpBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!this.isPlaying) {
            alert("Comenzá el juego primero para usar la ayudita.");
            return;
        }
        if (this.helpUsed) return;
        this.useHelp();
    });
}


    loadImage() {
        this.image = new Image();

        this.image.onload = () => {

            this.imageLoaded = true;

            // Dibujar imagen para preparar las piezas (pero no mostrarla)
            this.setupCanvas();

            // El canvas se usa sólo como buffer, mantenerlo oculto para que no se muestre junto a las piezas
            try {
                const filterFn = this.getFilterFunctionForLevel(this.level);
                if (filterFn) filterFn(this.ctx, this.canvas.width, this.canvas.height);
            } catch (err) {
                console.error('Error aplicando filtro por nivel:', err);
            }
            
            // El canvas se usa sólo como buffe, mantenerlo oculto para que no se muestre junto a las piezas
            if (this.canvas) this.canvas.style.display = 'none';
        };
        this.image.onerror = () => {
            console.error('Error cargando la imagen:', IMAGE_BANK[this.imageIndex]);
        };

        // Asignar la fuente fuera del onload para que comience la carga
        this.image.src = IMAGE_BANK[this.imageIndex];
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

    resetValues() {
        this.ctx = null;
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.pieces = [];
    }

    applyFilter(filterStyle) {
        this.canvas.style.filter = filterStyle;
    }

   showStartScreen() {
    let imgAnterior = document.querySelector('.original-img-container');
    if (imgAnterior) imgAnterior.remove();

    if (!this.imageLoaded) {
        alert("La imagen del juego todavía se está cargando. Espera un momento y vuelve a intentar.");
        return;
    }

            if (this.helpBtn && this.level >= 4 && this.level <= 6) {
            this.helpBtn.style.display = 'inline-block';
            this.helpBtn.disabled = false;
        }

    this.setLevel();

    const startScreen = this.gameWindow.querySelector('.start-screen');
    if (startScreen) startScreen.style.display = 'none';
    if (this.canvas) this.canvas.style.display = 'none';

    this.successMessage.style.display = 'none';
    this.isPlaying = true;

    this.startBtn.textContent = 'Menu principal';
    this.startBtn.onclick = () => {
        this.resetToMenuValues();
        goToMenu();
    }

    this.createPuzzlePieces();
    this.setTimerMode();
    this.resetTimer();

    // Reset ayudita
    this.helpUsed = false;
    this.helpPenaltySeconds = 0;
    this.maxTimeSeconds = this.getMaxTimeForLevel(this.level);

    this.setupHelpButton();

    // Si aplica ayudita, habilitar al inicio del juego
    if (this.helpBtn && this.level >= 4 && this.level <= 6) {
        this.helpBtn.style.display = 'inline-block';
        this.helpBtn.disabled = false;
    }

    window.currentGame = this;
    this.startTimer();
}

    playNextLevel() {
        this.resetValues();
        const imgAnterior = document.querySelector('.original-img-container');
        if (imgAnterior) imgAnterior.remove();

        if (!this.imageLoaded) {
            alert("La imagen del juego todavía se está cargando. Espera un momento y vuelve a intentar.");
            return;
        }

        if(!this.timeoutMsg.classList.contains('hidden')){
            this.timeoutMsg.classList.add('hidden');
        }

        this.setLevel();

        const startScreen = this.gameWindow.querySelector('.start-screen');
        if (startScreen) startScreen.style.display = 'none';
        if (this.canvas) this.canvas.style.display = 'none';
        this.successMessage.style.display = 'none';
        this.isPlaying = true;

        this.helpUsed = false;
        this.helpPenaltySeconds = 0;

        this.setupHelpButton();

        if (this.helpBtn && this.level >= 4 && this.level <= 6) {
            this.helpBtn.style.display = 'inline-block';
            this.helpBtn.disabled = false;
        }

        window.currentGame = this;
        this.createPuzzlePieces();
        this.setTimerMode();

        this.resetTimer();
        this.startTimer();
    }

    setLevel() {
        this.levelNumber.textContent = `Nivel ${this.level}`;
    }


    createPuzzlePieces() {
        this.pieces = [];
        const pieceSize = this.canvas.width / this.gridSize;
         let allCorrect = true;
        let wrongPieceIndex = -1;
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

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const pieceCanvas = document.createElement('canvas');
                pieceCanvas.width = pieceSize;
                pieceCanvas.height = pieceSize;
                
                const pieceCtx = pieceCanvas.getContext('2d');
                if (this.level >= 4) {
                    const randomFilter = this.getRandomPieceCSSFilter(this.level);
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
                    col: col,
                    locked: false // si la ayudita la fija, locked = true

                };
                if (piece.rotation !== piece.correctRotation) {
                    allCorrect = false;
                    wrongPieceIndex = this.pieces.length;
                }
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
          if (allCorrect && this.pieces.length > 0) {
            // Elijo la última pieza y la roto 90 grados
            const { piece, div } = this.pieces[wrongPieceIndex >= 0 ? wrongPieceIndex : this.pieces.length - 1];
            piece.rotation = 90;
            div.style.transform = `rotate(90deg)`;
        }

        if (this.gameWindow.querySelector('.puzzle-container')) {
            this.gameWindow.querySelector('.puzzle-container').remove();
        }
        this.gameWindow.appendChild(container);
    }

    rotatePiece(piece, div, degrees) {
        if (!this.isPlaying) return;
        // no rotar si la pieza fue fijada por la ayudita
        if (piece.locked) return;

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

        let displayTime;

        if (this.isCountdown) {
            // Evitar que timeLeft sea undefined
            const timeLeftSafe = (typeof this.timeLeft === 'number') ? this.timeLeft : this.maxTimeSeconds;
            const tiempoUsado = this.maxTimeSeconds - timeLeftSafe + this.helpPenaltySeconds;
            const minutes = Math.floor(tiempoUsado / 60);
            const seconds = tiempoUsado % 60;
            displayTime = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        } else {
            displayTime =  this.timerDisplay.textContent;
        }

        this.finalTimeDisplay.textContent = displayTime;

        // Resaltar piezas correctas
        this.pieces.forEach(({ piece, div }) => {
            if (piece.rotation === piece.correctRotation) {
                div.classList.add('win-green');
            }
        });

        setTimeout(() => {
            if (this.level < 6) { 
                this.showWinMessage();
            } else {
                this.showOriginalImg();
                this.goToMenu.textContent = 'Volver al menu';
                this.nextLevel.style.display = 'none';
                this.message.textContent = '¡Juego completado!';
                this.successMessage.style.display = 'block';

                // Ocultar ayudita
                if (this.helpBtn) {
                    this.helpBtn.style.display = 'none';
                }
            }
        }, 500);
    }

    showWinMessage() {
        this.showOriginalImg();
        this.successMessage.style.display = 'block';
        // Ocultar ayudita
        if (this.helpBtn) {
            this.helpBtn.style.display = 'none';
        }
        // Preparar siguiente nivel
        this.level += 1;
        this.imageIndex += 1;
        if (this.imageIndex > (IMAGE_BANK.length - 1)) {
            this.imageIndex = 0;
        }

        this.imageLoaded = false;
        this.loadImage();
    }

   startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

        this.startTime = Date.now();

        this.timerInterval = setInterval(() => {
            if (!this.isPlaying) return;

            if (this.isCountdown) {
                this.timeLeft--;

                if (this.timeLeft <= 0) {
                    this.timeLeft = 0;
                    this.timerDisplay.textContent = "00:00";
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                    this.loseLevel(); // muestra el cartel al llegar a 0
                    return;
                }

                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                // Colores visuales
                if (this.timeLeft <= 10) {
                    this.timerDisplay.style.color = '#ff3333';
                } else if (this.timeLeft <= this.maxTimeSeconds / 2) {
                    this.timerDisplay.style.color = '#ff9933';
                } else {
                    this.timerDisplay.style.color = '#00cc66';
                }
            } else {
                // modo sin límite (niveles 1–3)
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    }


    updateTimer() {
        if (!this.startTime) return;
        const now = Date.now();
        this.elapsedTime = now - this.startTime;
        const penaltyMs = (this.helpPenaltySeconds || 0) * 1000;

        if (this.maxTimeSeconds) {
            // cuenta regresiva: tiempo restante = max - elapsed - penalty
            const elapsedTotalSeconds = Math.floor((this.elapsedTime + penaltyMs) / 1000);
            let remaining = this.maxTimeSeconds - elapsedTotalSeconds;
            // evitar negativos
            if (remaining < 0) remaining = 0;

            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            this.timerDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

            if (elapsedTotalSeconds >= this.maxTimeSeconds) {
                // detener interval para evitar múltiples llamadas
                this.stopTimer();
                // marcar pérdida (se ejecuta después de un pequeño delay para que usuario vea 00:00)
                setTimeout(() => this.loseLevel(), 200);
            }

        } else {
            // tiempo transcurrido (incluye penalidad)
            const totalElapsedMs = this.elapsedTime + penaltyMs;
            const secondsTotal = Math.floor(totalElapsedMs / 1000);
            const minutes = Math.floor(secondsTotal / 60);
            const seconds = secondsTotal % 60;
            this.timerDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    resetTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        if (this.isCountdown) {
            this.timeLeft = this.maxTimeSeconds;
            this.elapsedTime = 0;
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.timerDisplay.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
        } else {
            this.elapsedTime = 0;
            this.startTime = null;
            this.timerDisplay.textContent = '00:00';
        }
    }

    setTimerMode() {
        // Niveles 4 a 6 = temporizador que resta
            if (this.level >= 4 && this.level <= 6) {
            this.isCountdown = true;
            this.maxTimeSeconds = this.getMaxTimeForLevel(this.level);
            this.timeLeft = this.maxTimeSeconds; // inicializa countdown
        } else {
            this.isCountdown = false;
            this.maxTimeSeconds = null;
            this.timeLeft = null;
        }
    }

    showOriginalImg() {
        this.gameWindow.querySelector('.puzzle-container').remove();

        let imgOriginalContenedor = document.createElement('div');
        imgOriginalContenedor.className = 'original-img-container';

        let imgOriginal = document.createElement('img');
        imgOriginal.src = IMAGE_BANK[this.imageIndex];
        imgOriginal.alt = 'Imagen de juego';

        imgOriginalContenedor.appendChild(imgOriginal);
        this.gameWindow.appendChild(imgOriginalContenedor);
    }

    resetToMenuValues() {
        this.isPlaying = false;
        this.stopTimer();
        this.resetTimer();

        const puzzleContainer = this.gameWindow.querySelector('.puzzle-container');
        if (puzzleContainer) puzzleContainer.remove();

        const originalImg = document.querySelector('.original-img-container');
        if (originalImg) originalImg.remove();

        this.message.textContent = '¡Completado!';
        this.successMessage.style.display = 'none';
        const timeoutMsg = document.getElementById('timeoutMessage');
        if (timeoutMsg) timeoutMsg.classList.add('hidden');

        this.startBtn.textContent = 'Comenzar';
        document.querySelector('.game-container').classList.add('hidden');
        document.getElementById('game-menu').classList.remove('hidden');
        
        const startScreen = document.querySelector('.start-screen');
        if (startScreen) startScreen.style.display = 'block';
    }



    // <----- Filtros de manipulacion de pixeles en canvas -----> 

    applyGrayscale(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    applyBrightness(ctx, width, height, increment = 30) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] + increment);     // R
            data[i + 1] = Math.min(255, data[i + 1] + increment); // G
            data[i + 2] = Math.min(255, data[i + 2] + increment); // B
        }
        ctx.putImageData(imageData, 0, 0);
    }

    applySepia(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // fórmula clásica del efecto sepia
            const newR = (0.393 * r) + (0.769 * g) + (0.189 * b);
            const newG = (0.349 * r) + (0.686 * g) + (0.168 * b);
            const newB = (0.272 * r) + (0.534 * g) + (0.131 * b);

            data[i]     = Math.min(255, newR);
            data[i + 1] = Math.min(255, newG);
            data[i + 2] = Math.min(255, newB);
            // data[i + 3] = alpha (sin cambios)
        }

        ctx.putImageData(imageData, 0, 0);
    }

    applyNegative(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];       // R
            data[i + 1] = 255 - data[i + 1]; // G
            data[i + 2] = 255 - data[i + 2]; // B
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Devuelve la función que aplica el filtro por manipulación de píxeles según el nivel
    getFilterFunctionForLevel(level) {
        switch (level) {
            case 1: return (ctx, w, h) => this.applyGrayscale(ctx, w, h);
            case 2: return (ctx, w, h) => this.applySepia(ctx, w, h);
            case 3: return (ctx, w, h) => this.applyNegative(ctx, w, h);
            case 4: return (ctx, w, h) => this.applyBrightness(ctx, w, h, 40);
            default: return null;
        }
    }

    // Para las piezas, devolvemos filtros CSS aleatorios compatibles con canvas context.filter
     getCSSFilterForLevel(level) {
        switch (level) {
            case 1: return 'grayscale(100%)';
            case 2: return 'sepia(100%) contrast(120%)';
            case 3: return 'invert(100%) blur(1.5px)';
            case 4: return 'sepia(60%) brightness(110%)';
            default: return 'none';
        }
    }

    getRandomPieceCSSFilter(level) {
        // Para niveles >=3 aplicamos random alguna variación entre niveles superiores
        if (level >= 3) {
            const options = [this.getCSSFilterForLevel(3), this.getCSSFilterForLevel(4)];
            return options[Math.floor(Math.random() * options.length)];
        }
        return this.getCSSFilterForLevel(level);
    }


    
    // función auxiliar para seleccionar una imagen aleatoria
    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * IMAGE_BANK.length);
        return randomIndex;
    }
      // Devuelve segundos máximos para niveles con límite de tiempo (null si sin límite)
    getMaxTimeForLevel(level) {
        switch (level) {
            case 4: return 60; // 1 minuto
            case 5: return 45; // 45 segundos
            case 6: return 30;  // 30 segundos
            default: return null;
        }
    }

    // Aplicar la ayudita: fijar correctamente una subimagen y añadir 5s de penalidad
    useHelp() {
        if (this.helpUsed) return;

        const candidates = this.pieces.filter(({ piece }) => piece.rotation !== piece.correctRotation && !piece.locked);
        if (candidates.length === 0) return;

        const pick = candidates[Math.floor(Math.random() * candidates.length)];

        pick.piece.rotation = pick.piece.correctRotation;
        pick.piece.locked = true;
        pick.div.style.transform = `rotate(${pick.piece.rotation}deg)`;
        pick.div.classList.add('locked');
        pick.div.classList.add('help-yellow');

        this.helpUsed = true;
        if (this.helpBtn) {
            this.helpBtn.disabled = true;
            this.helpBtn.classList.add('help-used');
        }

        if (this.isCountdown) {
            this.timeLeft -= 5; // restar 5 segundos una sola vez
            if (this.timeLeft < 0) this.timeLeft = 0;
        } else {
            this.helpPenaltySeconds += 5; // para cronómetro ascendente, sumar penalidad al elapsed
        }

        setTimeout(() => this.checkWin(), 200);
    }

    // Si el tiempo se agota
    loseLevel() {
        this.isPlaying = false;
        this.stopTimer();

        this.showOriginalImg();
        // Ocultar ayudita
        if (this.helpBtn) {
            this.helpBtn.style.display = 'none';
        }

        this.timeoutMsg.classList.remove('hidden'); // mostrar cartel
    }
}
    
