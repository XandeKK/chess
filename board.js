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
		this.pieces = {
			white: [],
			black: []
		}
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
		const color = player.color;
		for (let i = 0; i < 8; i++) {
			const pawn = new Pawn(player, [i, pawn_line], this);
			this.board[pawn_line][i] = pawn;
			this.pieces[color].push(pawn);
		}

		const rook0 = new Rook(player, [0, king_line], this);
		const rook1 = new Rook(player, [7, king_line], this);
		this.board[king_line][0] = rook0;
		this.board[king_line][7] = rook1;
		this.pieces[color].push(rook0);
		this.pieces[color].push(rook1);

		const knight0 = new Knight(player, [1, king_line], this);
		const knight1 = new Knight(player, [6, king_line], this);
		this.board[king_line][1] = knight0;
		this.board[king_line][6] = knight1;
		this.pieces[color].push(knight0);
		this.pieces[color].push(knight1);

		const bishop0 = new Bishop(player, [2, king_line], this);
		const bishop1 = new Bishop(player, [5, king_line], this);
		this.board[king_line][2] = bishop0;
		this.board[king_line][5] = bishop1;
		this.pieces[color].push(bishop0);
		this.pieces[color].push(bishop1);

		const queen = new Queen(player, [3, king_line], this);
		const king = new King(player, [4, king_line], this);
		this.board[king_line][3] = queen;
		this.board[king_line][4] = king;
		this.pieces[color].push(queen);
		this.pieces[color].push(king);
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

	deletePiece(piece) {
		const pieces = this.pieces[piece.player.color];
		for(let i = 0; i < pieces.length; i++){         
      if (pieces[i] === piece) { 
        pieces.splice(i, 1); 
        return true;
      }
    }
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