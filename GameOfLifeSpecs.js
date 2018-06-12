describe('new GameOfLife', function() {
	it('creates a board of a specified size', function() {
		const game = new GameOfLife(3, 4);
		expect(game.width).toEqual(3);
		expect(game.height).toEqual(4);
		expect(game.board).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]);
	});
});

describe('Board::livingNeighbors(row, col)', function() {
	it('doesn\'t include the cell itself', function() {
		const game = new GameOfLife(3, 3);
		// Let's force our own board to test livingNeighbors
		game.board = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
		expect(game.livingNeighbors(1, 1)).toEqual(8);
	});

	it('counts only living cells', function() {
		const game = new GameOfLife(3, 3);
		game.board = [[1, 1, 1], [1, 1, 1], [0, 0, 0]];
		expect(game.livingNeighbors(1, 1)).toEqual(5);
	});
});

describe('tick()', function() {
	it('advances a blinker from gen1 to gen2', function() {
		const game = new GameOfLife(3, 3);
		const blinker1 = [[0, 1, 0], [0, 1, 0], [0, 1, 0]];
		const blinker2 = [[0, 0, 0], [1, 1, 1], [0, 0, 0]];
		game.board = blinker1;
		game.tick();
		expect(game.board).toEqual(blinker2);
	});

	it('advances a glider from gen1 to gen2', function() {
		const game = new GameOfLife(3, 3);
		const glider1 = [[1, 0, 1], [0, 1, 1], [0, 1, 0]];
		const glider2 = [[0, 0, 1], [1, 0, 1], [0, 1, 1]];
		game.board = glider1;
		game.tick();
		expect(game.board).toEqual(glider2);
	});
});
