class Knight extends Piece {
	constructor(player, position, board) {
		super(player, position, board);
	}

	possibleMovements() {
		const x = this.position[0];
		const y = this.position[1];
		const movements = {};

		if (this.board.haveOpponentPieceInThatPosition([x + 2, y + 1], this.player) ||
			!this.board.havePieceInThatPosition([x + 2, y + 1])
		) {
			movements[`${x + 2}${y + 1}`] = this.move.bind(this, x + 2, y + 1);
		}

		if (this.board.haveOpponentPieceInThatPosition([x + 2, y - 1], this.player) ||
			!this.board.havePieceInThatPosition([x + 2, y - 1])
		) {
			movements[`${x + 2}${y - 1}`] = this.move.bind(this, x + 2, y - 1);
		}

		if (this.board.haveOpponentPieceInThatPosition([x - 2, y + 1], this.player) ||
			!this.board.havePieceInThatPosition([x - 2, y + 1])
		) {
			movements[`${x - 2}${y + 1}`] = this.move.bind(this, x - 2, y + 1);
		}

		if (this.board.haveOpponentPieceInThatPosition([x - 2, y - 1], this.player) ||
			!this.board.havePieceInThatPosition([x - 2, y - 1])
		) {
			movements[`${x - 2}${y - 1}`] = this.move.bind(this, x - 2, y - 1);
		}

		if (this.board.haveOpponentPieceInThatPosition([x + 1, y + 2], this.player) ||
			!this.board.havePieceInThatPosition([x + 1, y + 2])
		) {
			movements[`${x + 1}${y + 2}`] = this.move.bind(this, x + 1, y + 2);
		}

		if (this.board.haveOpponentPieceInThatPosition([x - 1, y + 2], this.player) ||
			!this.board.havePieceInThatPosition([x - 1, y + 2])
		) {
			movements[`${x - 1}${y + 2}`] = this.move.bind(this, x - 1, y + 2);
		}

		if (this.board.haveOpponentPieceInThatPosition([x + 1, y - 2], this.player) ||
			!this.board.havePieceInThatPosition([x + 1, y - 2])
		) {
			movements[`${x + 1}${y - 2}`] = this.move.bind(this, x + 1, y - 2);
		}

		if (this.board.haveOpponentPieceInThatPosition([x - 1, y - 2], this.player) ||
			!this.board.havePieceInThatPosition([x - 1, y - 2])
		) {
			movements[`${x - 1}${y - 2}`] = this.move.bind(this, x - 1, y - 2);
		}

		return movements;
	}
}