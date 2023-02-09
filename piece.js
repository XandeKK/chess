class Piece {
	constructor(player, position, board) {
		this.player = player;
		this.position = position;
		this.board = board;
		this.number_movements = 0;
		this.last_movement = this.board.movement;
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