class Game {
	constructor() {}

	start() {
		this.player1 = new Player('white');
		this.player2 = new Player('black');
		this.board = new Board(this.player1, this.player2);
	}
}