const BOARD = [
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0]
]

class Player {
	constructor(color) {
		this.color = color;
		this.turn = color === 'white';
	}
}

class Piece {
	constructor(player, position, board) {
		this.player = player;
		this.position = position;
		this.board = board;
		this.number_movements = 0;
		this.last_movement = this.board.movement;
	}

	toString() {
		return this.constructor.name[0];
	}

	move(x, y) {
		this.board.movement++;
		this.last_movement = this.board.movement;
		this.number_movements++;
		this.board.setPiece([this.position[0],this.position[1]], 0);
		this.board.setPiece([x,y], this);
		this.position = [x,y];
	}
}

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

		// castling

		return movements;
	}
}

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

class Queen extends Piece {
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

		return movements;
	}
}

class Board {
	constructor(player1, player2) {
		this.movement = 0;
		this.board = BOARD.map((arr)=> {
			return arr.slice();
		});

		if (player1.color == 'white') {
			this.addWhitePieces(player1);
			this.addBlackPieces(player2);
		} else {
			this.addBlackPieces(player1);
			this.addWhitePieces(player2);
		}
	}

	addWhitePieces(player) {
		this.addAllPieces(6, 7, player);
	}

	addBlackPieces(player) {
		this.addAllPieces(1, 0, player)
	}

	addAllPieces(pawn_line, king_line, player) {
		for (let i = 0; i < 8; i++) {
			this.board[pawn_line][i] = new Pawn(player, [i, pawn_line], this);
		}

		this.board[king_line][0] = new Rook(player, [0, king_line], this);
		this.board[king_line][7] = new Rook(player, [7, king_line], this);

		this.board[king_line][1] = new Knight(player, [1, king_line], this);
		this.board[king_line][6] = new Knight(player, [6, king_line], this);

		this.board[king_line][2] = new Bishop(player, [2, king_line], this);
		this.board[king_line][5] = new Bishop(player, [5, king_line], this);

		this.board[king_line][3] = new Queen(player, [3, king_line], this);
		this.board[king_line][4] = new King(player, [4, king_line], this);
	}

	setPiece(position, piece) {
		const x = position[0];
		const y = position[1];
		this.board[y][x] = piece;
	}

	getPiece(position) {
		const x = position[0];
		const y = position[1];
		if (x < 0 || x > 7 || y < 0 || y > 7) return false;
		return this.board[y][x];
	}

	getBoard() {
		return this.board;
	}

	havePieceInThatPosition(position) {
		return this.getPiece(position) !== 0;
	}

	haveOpponentPieceInThatPosition(position, me) {
		const x = position[0];
		const y = position[1];
		const target = this.board[y]?.[x];
		const opponent = me.color == 'white' ? 'black' : 'white';

		if (target?.player?.color === opponent) return true;
		return false;
	}

	clear() {
		delete this.board;
		this.board = BOARD.map((arr)=> {
			return arr.slice();
		});
	}

	toString() {
		let string = '   0 1 2 3 4 5 6 7\n\n';
		let i = 0;
		this.board.forEach((arr)=> {
			string += `${i}  `;
			arr.forEach((elem)=> {
				string += `${elem} `;
			})
			string += '\n';
			i++;
		})
		return string;
	}
}

class Game {
	constructor() {}

	start() {
		this.player1 = new Player('white');
		this.player2 = new Player('black');
		this.board = new Board(this.player1, this.player2);
	}

	getPiece(position) {
		const piece = this.board.getPiece(position);
		return piece;
	}

	reset() {
		this.board.clear();
		this.player1 = null;
		this.player2 = null;
	}

	printBoard() {
		console.log(this.board.toString());
	}
}

game = new Game();

game.start();

game.printBoard();

game.getPiece([0,1]).possibleMovements()['03']();
game.getPiece([0,3]).possibleMovements()['04']();
game.getPiece([0,4]).possibleMovements()['05']();
game.getPiece([0,5]).possibleMovements()['16']();
console.log(a = game.getPiece([1,6]).possibleMovements()['27']());

game.printBoard();

// game.getPiece([0,4]).possibleMovements()['15']();

// game.printBoard();
