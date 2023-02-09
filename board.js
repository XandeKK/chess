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
}