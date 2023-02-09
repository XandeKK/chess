class Rook extends Piece {
	constructor(player, position, board) {
		super(player, position, board);
	}

	possibleMovements() {
		const x = this.position[0];
		const y = this.position[1];
		const movements = {};

		// left
		for (let i = x - 1; i >= 0; i--) {
			if (this.board.havePieceInThatPosition([i, y])) {
				if (this.board.haveOpponentPieceInThatPosition([i, y], this.player)) {
					movements[`${i}${y}`] = this.move.bind(this, i, y);
				}
				break;
			}
			movements[`${i}${y}`] = this.move.bind(this, i, y);
		}

		// right
		for (let i = x + 1; i <= 7; i++) {
			if (this.board.havePieceInThatPosition([i, y])) {
				if (this.board.haveOpponentPieceInThatPosition([i, y], this.player)) {
					movements[`${i}${y}`] = this.move.bind(this, i, y);
				}
				break;
			}
			movements[`${i}${y}`] = this.move.bind(this, i, y);
		}

		// top
		for (let i = y - 1; i >= 0; i--) {
			if (this.board.havePieceInThatPosition([x, i])) {
				if (this.board.haveOpponentPieceInThatPosition([x, i], this.player)) {
					movements[`${x}${i}`] = this.move.bind(this, x, i);
				}
				break;
			}
			movements[`${x}${i}`] = this.move.bind(this, x, i);
		}

		// bottom
		for (let i = y + 1; i <= 7; i++) {
			if (this.board.havePieceInThatPosition([x, i])) {
				if (this.board.haveOpponentPieceInThatPosition([x, i], this.player)) {
					movements[`${x}${i}`] = this.move.bind(this, x, i);
				}
				break;
			}
			movements[`${x}${i}`] = this.move.bind(this, x, i);
		}

		return movements;
	}
}