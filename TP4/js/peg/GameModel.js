
export class GameModel {
    constructor() {
        this.boardSize = 7;
        this.board = [];
        // para cada celda que tenga una ficha, se guarda un índice de imagen
        // esto evita que la imagen de una ficha cambie cada vez que se redibuja
        this.pegImageIndices = [];
        this.pegsRemaining = 0;
        this.movesCount = 0;
        this.initBoard();
    }

    initBoard() {
        // crear tablero 
        // 0 = fuera del tablero, 1 = posición vacía, 2 = ficha
        this.board = [
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 1, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2],
            [0, 0, 2, 2, 2, 0, 0],
            [0, 0, 2, 2, 2, 0, 0]
        ];

        // inicializar pegImageIndices con la misma estructura y asignar aleatoriamente
        // un índice de imagen para cada ficha presente (valor null para celdas vacías/fuera)
        this.pegImageIndices = [];
        for (let row = 0; row < this.boardSize; row++) {
            this.pegImageIndices[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 2) {
                    this.pegImageIndices[row][col] = Math.floor(Math.random() * 3);
                } else {
                    this.pegImageIndices[row][col] = null;
                }
            }
        }

        this.countPegs();
    }

    countPegs() {
        this.pegsRemaining = 0;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 2) {
                    this.pegsRemaining++;
                }
            }
        }
    }

    isValidPosition(row, col) {
        return row >= 0 && row < this.boardSize && 
                col >= 0 && col < this.boardSize && 
                this.board[row][col] !== 0;
    }

    hasPeg(row, col) {
        return this.isValidPosition(row, col) && this.board[row][col] === 2;
    }

    isEmpty(row, col) {
        return this.isValidPosition(row, col) && this.board[row][col] === 1;
    }

    getValidMoves(fromRow, fromCol) {
        if (!this.hasPeg(fromRow, fromCol)) return [];

        const moves = [];
        const directions = [
            [-2, 0],  // arriba
            [2, 0],   // abajo
            [0, -2],  // izquierda
            [0, 2]    // derecha
        ];

        for (const [dRow, dCol] of directions) {
            const toRow = fromRow + dRow;
            const toCol = fromCol + dCol;
            const midRow = fromRow + dRow / 2;
            const midCol = fromCol + dCol / 2;

            // Verificar que el destino esté vacío y haya una ficha en el medio
            if (this.isEmpty(toRow, toCol) && this.hasPeg(midRow, midCol)) {
                moves.push({ toRow, toCol, midRow, midCol });
            }
        }

        return moves;
    }

    makeMove(fromRow, fromCol, toRow, toCol) {
        const moves = this.getValidMoves(fromRow, fromCol);
        const validMove = moves.find(m => m.toRow === toRow && m.toCol === toCol);

        if (!validMove) return false;

        // hacer el movimiento
        this.board[fromRow][fromCol] = 1; // vaciar origen
        this.board[validMove.midRow][validMove.midCol] = 1; // eliminar ficha del medio
        this.board[toRow][toCol] = 2; // colocar ficha en destino

        // mover también el índice de imagen asociado a la ficha
        if (this.pegImageIndices && this.pegImageIndices[fromRow]) {
            const imgIdx = this.pegImageIndices[fromRow][fromCol];
            this.pegImageIndices[toRow][toCol] = imgIdx;
            this.pegImageIndices[fromRow][fromCol] = null;
            this.pegImageIndices[validMove.midRow][validMove.midCol] = null;
        }

        this.movesCount++;
        this.countPegs();
        return true;
    }

    hasAnyValidMoves() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.hasPeg(row, col)) {
                    if (this.getValidMoves(row, col).length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // devuelve el índice de imagen (o null) para la celda dada
    getPegImageIndex(row, col) {
        if (!this.pegImageIndices) return null;
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) return null;
        return this.pegImageIndices[row][col];
    }

    reset() {
        this.initBoard();
        this.movesCount = 0;
    }
}