class King extends Piece {
	constructor(player, position, board) {
		super(player, position, board);
	}

	possibleMovements() {
		const x = this.position[0];
		const y = this.position[1];
		const movements = {};

		for (let i = x - 1; i <= x + 1; i++) {
			for (let j = y - 1; j <= y + 1; j++) {
				if (this.board.haveOpponentPieceInThatPosition([i, j], this.player) ||
					!this.board.havePieceInThatPosition([i, j])
				) {
					movements[`${i}${j}`] = this.move.bind(this, i, j);
				}
			}
		}

		// castling
		const edge = this.player.color === 'white' ? 7 : 0;
		const piece0 = this.board.getPiece([0, edge]);
		const piece1 = this.board.getPiece([7, edge]);

		if (piece0.constructor.name == 'Rook' && piece0.number_movements == 0 && this.number_movements == 0) {
			movements[`${x - 2}${y}`] = this.castling.bind(this, x - 2, piece0, x - 1);
		}

		if (piece1.constructor.name == 'Rook' && piece1.number_movements == 0 && this.number_movements == 0) {
			movements[`${x + 2}${y}`] = this.castling.bind(this, x + 2, piece1, x + 1);
		}

		return movements;
	}

	castling(x, rook, x_rook) {
		const y = this.position[1];
		this.move(x,y);
		rook.move(x_rook,y);

		return true;
	}

	check() {
		const x = this.position[0];
		const y = this.position[1];
		const opponent_color = this.player.color === 'white' ? 'black' : 'white';
		const pieces = this.board.pieces[opponent_color];

		pieces.forEach((piece)=> {
			if (piece.possibleMovements()[`${x}${y}`]) {
				return true
			}
		});
		return false;
	}
}