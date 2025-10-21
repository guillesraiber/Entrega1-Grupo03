goToMenu(true);


function goToMenu(primeraVez) {
    const images = document.querySelectorAll('.image-option');
    const playButton = document.getElementById('play-button');
    const levelSelect = document.getElementById('level-select');
    const menuContainer = document.getElementById('game-menu');
    const gamePage = document.querySelector('.game-container');
    let selectedImage = null;

    if (!primeraVez) {
        gamePage.classList.add('hidden');  
        menuContainer.classList.remove('hidden');
        document.querySelector('.start-screen').style.display = 'block';
        document.querySelector('.puzzle-container').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }

    // Manejar clic en imágenes
    images.forEach(img => {
        img.addEventListener('click', () => {
            const imageIndex = img.dataset.image;
            const level = parseInt(levelSelect.value);
            startGame(imageIndex, level, false);
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
                    startGame(imagePath, level, true); // usar botón grande
                    images[randomIndex].classList.remove('selected');
                }, 1000);
            }
        }, animationDuration);
    }

    function startGame(imagePath, level, useBigStart) {
        menuContainer.classList.add('hidden');
        gamePage.classList.remove('hidden');
        // Crear instancia del juego
        const game = new PuzzleGame(imagePath, level, useBigStart);
        // Mostrar el botón grande SIEMPRE si useBigStart es true
        if (useBigStart) {
            game.showBigStartButton();
            // Asegurarse que el botón de volver al menú esté habilitado y con el texto correcto
            if (game.startBtn) {
                game.startBtn.disabled = false;
                game.startBtn.textContent = 'Volver al menú';
                game.startBtn.classList.remove('hidden');
            }
        }
    }

}

// JUEGO BLOCKA

const IMAGE_BANK = [
    'images/blocka/imagenUno.jpg',
    'images/blocka/imagenDos.png',
    'images/blocka/imagenTres.jpg',
    'images/blocka/imagenCuatro.jpg',
    'images/blocka/imagenCinco.jpeg',
    'images/blocka/imagenSeis.jpg'
];















class PuzzleGame {
    constructor(imageIndex, level = 1, useBigStart = false) {
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
        this.useBigStart = useBigStart; // si se usa el botón grande
        
        // Help / time-limit related
        this.helpUsed = false; // whether the player already used the ayudita
        this.helpPenaltySeconds = 0; // total penalty seconds added by ayudita(s)
        this.maxTimeSeconds = this.getMaxTimeForLevel(this.level); // null or seconds
        
        this.initElements();
        this.initEvents();
        this.loadImage();
        this.startBtn.disabled = false;
    }

    initElements() {
        this.startBtn = document.getElementById('startBtn');
        this.nextLevel =  document.getElementById('next-level');
        this.timerDisplay = document.getElementById('timer');
        this.gameWindow = document.getElementById('gameWindow');
        this.successMessage = document.getElementById('successMessage');
        this.finalTimeDisplay = document.getElementById('finalTime');
        this.pieceSelect = document.getElementById('pieceSelect');
        this.goToMenu = document.getElementById('go-to-menu');
        // New: ayudita button
        this.helpBtn = document.getElementById('helpBtn');
        this.bigStartContainer = document.getElementById('bigStartContainer');
        this.bigStartBtn = document.getElementById('bigStartBtn');
        // Asegurar que el botón comience deshabilitado hasta que la imagen termine de cargar
        if (this.startBtn) {
            this.startBtn.disabled = true;
        }
    }

    initEvents() {
        if (this.startBtn) {
            this.startBtn.onclick = () => {
                // Solo vuelve al menú, nunca inicia el juego
                this.isPlaying = false;
                this.stopTimer();
                goToMenu(false);
            };
        }

        if (this.goToMenu) {
            this.resetTimer()
            this.goToMenu.onclick = () => goToMenu(false);
        }

        if (this.nextLevel) {
            this.nextLevel.onclick = () => this.showStartScreen();
        }

        if (this.bigStartBtn) {
            this.bigStartBtn.onclick = () => {
                this.bigStartContainer.classList.add('hidden');
                this.showStartScreen();
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

        // Ayudita button: puede usarse una vez por partida
        if (this.helpBtn) {
            this.helpBtn.onclick = (e) => {
                e.preventDefault();
                // Si la partida ya empezó, permitir usarla también en juego
                if (!this.isPlaying) {
                    // si aún no hay partida, permitir marcar que se usará al iniciar
                    // pero implementación más simple: solo permitir durante juego
                    alert('La Ayudita se puede usar una vez durante la partida. Comienza el juego y luego pulsa Ayudita.');
                    return;
                }
                if (this.helpUsed) return;
                this.useHelp();
            };
        }
    }

    loadImage() {
        this.image = new Image();
        this.image.onload = () => {
        this.imageLoaded = true;

        // this.startBtn.disabled = false;

        // Dibujar imagen para preparar las piezas (pero no mostrarla)
        this.setupCanvas();

        // El canvas se usa sólo como buffer, mantenerlo oculto para que no se muestre junto a las piezas
        try {
            const filterFn = this.getFilterFunctionForLevel(this.level);
            if (filterFn) filterFn(this.ctx, this.canvas.width, this.canvas.height);
        } catch (err) {
            console.error('Error aplicando filtro por nivel:', err);
        }
        
        // El canvas se usa sólo como buffer; mantenerlo oculto para que no se muestre junto a las piezas
        if (this.canvas) this.canvas.style.display = 'none';
        };
        this.image.onerror = () => {
            console.error('Error cargando la imagen:', imagePath);
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

    applyFilter(filterStyle) {
        this.canvas.style.filter = filterStyle;
    }

    showBigStartButton() {
        if (this.bigStartContainer) {
            this.bigStartContainer.classList.remove('hidden');
        }
        if (this.bigStartBtn) {
            this.bigStartBtn.disabled = false;
            this.bigStartBtn.style.display = 'block';
        }
    }

    hideBigStartButton() {
        if (this.bigStartContainer) {
            this.bigStartContainer.classList.add('hidden');
        }
        if (this.bigStartBtn) {
            this.bigStartBtn.style.display = 'none';
        }
    }

    showStartScreen() {
        if (!this.imageLoaded) {
            alert("La imagen del juego todavía se está cargando. Espera un momento y vuelve a intentar.");
            return;
        }
        this.gameWindow.querySelector('.start-screen').style.display = 'none';

        // Ocultar el canvas original: sólo se muestra el contenedor de piezas
        this.canvas.style.display = 'none';

        this.successMessage.style.display = 'none';
        this.isPlaying = true;
        // El botón de volver al menú nunca debe estar deshabilitado durante la partida
        if (this.startBtn) {
            this.startBtn.disabled = false;
            this.startBtn.textContent = 'Volver al menú';
        }

        this.loadImage()
        
        // crear piezas (se mostrarán en lugar del canvas) y arrancar
        this.createPuzzlePieces(); 
        this.resetTimer();
        // reset help state for this run
        this.helpUsed = false;
        this.helpPenaltySeconds = 0;
        // recompute max time for current level
        this.maxTimeSeconds = this.getMaxTimeForLevel(this.level);
        // enable/help button state
        if (this.helpBtn) this.helpBtn.disabled = false;
        this.startTimer();

        this.hideBigStartButton();

        // Cambiar el texto del botón 'Comenzar' a 'Volver al menú' cuando se está jugando
        if (this.startBtn) {
            this.startBtn.textContent = 'Volver al menú';
        }

        // Mostrar tiempo límite si aplica
        if (this.maxTimeSeconds && this.timerDisplay) {
            let info = document.getElementById('timer-limit-info');
            if (!info) {
                info = document.createElement('div');
                info.id = 'timer-limit-info';
                info.style.fontSize = '1rem';
                info.style.color = '#e67e22';
                info.style.marginTop = '4px';
                this.timerDisplay.parentNode.insertBefore(info, this.timerDisplay.nextSibling);
            }
            const min = Math.floor(this.maxTimeSeconds / 60);
            const sec = this.maxTimeSeconds % 60;
            info.textContent = `Tiempo límite: ${min > 0 ? min + 'm ' : ''}${sec}s`;
            info.style.display = 'block';
        } else {
            const info = document.getElementById('timer-limit-info');
            if (info) info.style.display = 'none';
        }
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
                let randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

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

        // Si todas las piezas quedaron correctas, forzar una mal rotada
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

        this.finalTimeDisplay.textContent = this.timerDisplay.textContent;
        
        // Agregar contorno verde a todas las piezas correctas
        this.pieces.forEach(({ piece, div }) => {
            if (piece.rotation === piece.correctRotation) {
                div.classList.add('win-green');
            }
        });

        setTimeout(() => {
            this.successMessage.style.display = 'block';
        }, 2000);

        this.level += 1;
        this.imageIndex += 1;

        if (this.imageIndex >= IMAGE_BANK.length) {
            this.imageIndex = 0;
        }
        // avanzar de nivel si hay más
        if (this.level <= 6) {
            setTimeout(() => {
                if (this.startBtn) {
                    this.startBtn.disabled = false;
                    this.startBtn.textContent = 'Comenzar';
                }
            }, 3000);
        } else {
            setTimeout(() => {
                alert("🎉 ¡Felicitaciones! Completaste todos los niveles.");
                if (this.startBtn) this.startBtn.disabled = true;
                goToMenu(false);
            }, 3000);
        }

        // Restaurar el texto del botón para el próximo juego
        if (this.startBtn) {
            this.startBtn.textContent = 'Comenzar';
        }
    }

    startTimer() {
        this.timerDisplay.textContent = '00:00';
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

    resetTimer() {
        this.timerDisplay.textContent = '00:00';
        this.startTime = null;
        this.elapsedTime = 0;
    }

    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        // incluir el penalty de ayuda en el tiempo mostrado
        const totalElapsedMs = this.elapsedTime + (this.helpPenaltySeconds * 1000);
        const seconds = Math.floor(totalElapsedMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        this.timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

        // Si existe un tiempo máximo para el nivel, comprobar si se agotó
        if (this.maxTimeSeconds) {
            const elapsedSeconds = Math.floor(totalElapsedMs / 1000);
            if (elapsedSeconds >= this.maxTimeSeconds) {
                // tiempo agotado -> perder el nivel
                this.loseLevel();
            }
        }
    }

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
        // ajustar tiempos según tu diseño
        switch (level) {
            case 4: return 180; // 3 minutos
            case 5: return 120; // 2 minutos
            case 6: return 90;  // 1.5 minutos
            default: return null;
        }
    }

    // Aplicar la ayudita: fijar correctamente una subimagen y añadir 5s de penalidad
    useHelp() {
        if (this.helpUsed) return;
        // buscar piezas que no estén ya correctas
        const candidates = this.pieces.filter(({ piece }) => piece.rotation !== piece.correctRotation && !piece.locked);
        if (candidates.length === 0) return; // no hay piezas por fijar

        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        // fijar la pieza
        pick.piece.rotation = pick.piece.correctRotation;
        pick.piece.locked = true;
        pick.div.style.transform = `rotate(${pick.piece.rotation}deg)`;
        pick.div.classList.add('locked');
        pick.div.classList.add('help-yellow'); // recuadro amarillo claro

        // sumar 5 segundos a la penalidad
        this.helpPenaltySeconds += 5;
        this.helpUsed = true;
        if (this.helpBtn) this.helpBtn.disabled = true;

        // comprobar si con la ayudita ya ganó
        setTimeout(() => this.checkWin(), 200);
    }

    // Si el tiempo se agota
    loseLevel() {
        this.isPlaying = false;
        this.stopTimer();
        alert('Se agotó el tiempo. Perdiste el nivel.');
        // puedes decidir volver al menú o permitir reiniciar
        goToMenu(false);
    }

}

