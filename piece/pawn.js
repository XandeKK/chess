class Pawn extends Piece {
	constructor(player, position, board) {
		super(player, position, board);
	}

	possibleMovements() {
		const x = this.position[0];
		const y = this.position[1];
		const movements = {};
		const direction = this.player.color === 'white' ? -1 : 1; // -1 - up, 1 - down
		const row_en_passant = this.player.color === 'white' ? 3 : 4;

		// front
		if (!this.board.havePieceInThatPosition([x, y + (1 * direction)])) {
			if (this.canPromote(y + (1 * direction))) {
				movements[`${x}${y + (1 * direction)}`] = this.promotion.bind(this, x, y + (1 * direction))
			} else {
				movements[`${x}${y + (1 * direction)}`] = this.move.bind(this, x, y + (1 * direction))
			}

			if (!this.board.havePieceInThatPosition([x, y + (2 * direction)]) && this.number_movements == 0) {
				movements[`${x}${y + (2 * direction)}`] = this.move.bind(this, x, y + (2 * direction));
			}
		}

		// opponent
		if (this.board.haveOpponentPieceInThatPosition([x - 1, y + (1 * direction)], this.player)) {
			if (this.canPromote(y + (1 * direction))) {
				movements[`${x - 1}${y + (1 * direction)}`] = this.promotion.bind(this, x - 1, y + (1 * direction));
			} else {
				movements[`${x - 1}${y + (1 * direction)}`] = this.move.bind(this, x - 1, y + (1 * direction));
			}
		}

		if (this.board.haveOpponentPieceInThatPosition([x + 1, y + (1 * direction)], this.player)) {
			if (this.canPromote(y + (1 * direction))) {
				movements[`${x + 1}${y + (1 * direction)}`] = this.promotion.bind(this, x + 1, y + (1 * direction));
			} else {
				movements[`${x + 1}${y + (1 * direction)}`] = this.move.bind(this, x + 1, y + (1 * direction));
			}
		}

		// en passant
		if (y == row_en_passant && this.board.haveOpponentPieceInThatPosition([x - 1, y], this.player) && 
			this.board.getPiece([x - 1, y]).constructor.name == 'Pawn' &&
			this.board.getPiece([x - 1, y]).number_movements == 1 &&
			this.board.getPiece([x - 1, y]).last_movement > this.last_movement
		) {
			movements[`${x - 1}${y}`] = this.enPasssant.bind(this, x - 1, y, direction);
		}

		if (y == row_en_passant && this.board.haveOpponentPieceInThatPosition([x + 1, y], this.player) && 
			this.board.getPiece([x + 1, y]).constructor.name == 'Pawn' &&
			this.board.getPiece([x + 1, y]).number_movements == 1 &&
			this.board.getPiece([x + 1, y]).last_movement > this.last_movement
		) {
			movements[`${x + 1}${y + (1 * direction)}`] = this.enPasssant.bind(this, x + 1, y, direction);
		}

		return movements;
	}

	move(x, y) {
		this.board.movement++;
		this.last_movement = this.board.movement;
		this.number_movements++;
		this.board.setPiece([this.position[0],this.position[1]], 0);
		this.board.setPiece([x,y], this);
		this.position = [x,y];

		return true;
	}

	enPasssant(x, y, direction) {
		this.board.setPiece([x,y], 0);
		this.move(x,y + (1 * direction));
	}

	promote(name) {
		const x = this.position[0];
		const y = this.position[1];
		let piece;

		switch (name) {
		case 'Pawn':
			piece = new Pawn(this.player, this.position, this.board);
			break;
		case 'Knight':
			piece = new Knight(this.player, this.position, this.board);
			break;
		case 'Bishop':
			piece = new Bishop(this.player, this.position, this.board);
			break;
		case 'Queen':
			piece = new Queen(this.player, this.position, this.board);
			break;
		}
		this.board.setPiece([x,y], piece);

		return true;
	}

	promotion(x, y) {
		this.move(x, y);
		return this.getPromotion();
	}

	getPromotion() {
		return {
			promotion: {
				Rook: this.promote.bind(this, 'Rook'),
				Knight: this.promote.bind(this, 'Knight'),
				Bishop: this.promote.bind(this, 'Bishop'),
				Queen: this.promote.bind(this, 'Queen')
		}};
	}

	canPromote(y) {
		const edge = this.player.color === 'white' ? 0 : 7;
		return y == edge;
	}
}