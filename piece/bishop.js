class Bishop extends Piece {
	constructor(player, position, board) {
		super(player, position, board);
	}

	possibleMovements() {
		const x = this.position[0];
		const y = this.position[1];
		const movements = {};

		// left top
		for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
			if (this.board.havePieceInThatPosition([i, j])) {
				if (this.board.haveOpponentPieceInThatPosition([i, j], this.player)) {
					movements[`${i}${j}`] = this.move.bind(this, i, j);
				}
				break;
			}
			movements[`${i}${j}`] = this.move.bind(this, i, j);
		}

		// left bottom
		for (let i = x - 1, j = y + 1; i >= 0 && j <= 7; i--, j++) {
			if (this.board.havePieceInThatPosition([i, j])) {
				if (this.board.haveOpponentPieceInThatPosition([i, j], this.player)) {
					movements[`${i}${j}`] = this.move.bind(this, i, j);
				}
				break;
			}
			movements[`${i}${j}`] = this.move.bind(this, i, j);
		}

		// right top
		for (let i = x + 1, j = y - 1; i <= 7 && j >= 0; i++, j--) {
			if (this.board.havePieceInThatPosition([i, j])) {
				if (this.board.haveOpponentPieceInThatPosition([i, j], this.player)) {
					movements[`${i}${j}`] = this.move.bind(this, i, j);
				}
				break;
			}
			movements[`${i}${j}`] = this.move.bind(this, i, j);
		}

		// right bottom
		for (let i = x + 1, j = y + 1; i <= 7 && j <= 7; i++, j++) {
			if (this.board.havePieceInThatPosition([i, j])) {
				if (this.board.haveOpponentPieceInThatPosition([i, j], this.player)) {
					movements[`${i}${j}`] = this.move.bind(this, i, j);
				}
				break;
			}
			movements[`${i}${j}`] = this.move.bind(this, i, j);
		}

		return movements;
	}
}