class GameOfLife {
	constructor(width, height, wrap = false) {
		this.width = width;
		this.height = height;
		this.board = this.makeBoard();
		this.config = {
			wrap: wrap,
		}
	}

	/**
	 * Returns a 2D Array
	 */

	makeBoard() {
		// Create and return an 2D Array
		// with `this.heigh` as rows and `this.width` as cols.
		// For example, given a height of 4 and a width of 3, it will generate:
		// [
		//  [0, 0, 0],
		//  [0, 0, 0],
		//  [0, 0, 0],
		//  [0, 0, 0],
		// ]
		let board = [];
		// For each row...
		for (let row = 0; row < this.height; row++) {
			let rowArr = new Array(this.width);
			// Initialize each item to 0
			for (let rowIndex = 0; rowIndex < rowArr.length; rowIndex++) {
				rowArr[rowIndex] = 0;
			}
			board.push(rowArr);
		}
		return board;
	}

	isWithinBounds(row, col) {
		if (row < 0 || col < 0 || row >= this.height || col >= this.width) {
			return false;
		}
		return true;
	}

	// Wrapping
	convertToValidCoords(row, col) {
		if (!this.isWithinBounds(row, col)) {
			row = row % this.height;
			col = col % this.width;

			if (row < 0) row = this.height + row;
			if (col < 0) col = this.width + col;
		}
		// console.log('In convertToValidCoords. Returning: ', row, col);
		return [row, col];
	}

	// row, col are zero-based
	// Affected by wrap config var
	getCell(row, col) {
		if (this.config.wrap) {
			[row, col] = this.convertToValidCoords(row, col);
		}
		// Error checking
		if (!this.isWithinBounds(row, col)) {
				return -1;
		}

		return this.board[row][col];
	}

	// Affected by wrap configuration
	setCell(value, row, col) {
		if (this.config.wrap) {
			[row, col] = this.convertToValidCoords(row, col);
		}

		if (!this.isWithinBounds(row, col)) {
				throw Error;
		}

		this.board[row][col] = value;
	}

	toggleCell(row, col) {
		if (this.config.wrap) {
			[row, col] = this.convertToValidCoords(row, col);
		}

		if (!this.isWithinBounds(row, col)) {
			throw Error;
		}

		let val = this.board[row][col];
		this.board[row][col] = val === 0 ? 1 : 0;
	}

	/**
	 * Return the amount of living neighbors around a given coordinate.
	 */
	// Affected by wrap.
	livingNeighbors(row, col) {
		let living = 0;

		for (let i = row - 1; i <= row + 1; i++) {
			for (let j = col - 1; j <= col + 1; j++) {
				if (i === row && j === col) {
					continue;
				}
				if (this.getCell(i, j) === 1) living++;
			}
		}
		return living;
	}

	/**
	 * Given the present board, apply the rules to generate a new board
	 */

	tick() {
		const newBoard = this.makeBoard();
		// Loop through all the cells
		// on the existing board and determine, based on it's neighbors,
		// whether the cell should be dead or alive in the new board
		// (the next iteration of the game)
		//
		// Need to:
		// 1. Count alive neighbors for all cells
		// 2. Set the next state of all cells in newBoard,
		// based on their current alive neighbors

		for (let row = 0; row < this.height; row++) {
			for (let col = 0; col < this.width; col++) {
				let currentCellVal = this.getCell(row, col);
				let livingNbrs = this.livingNeighbors(row, col);
				//checking current state of cell
				if (currentCellVal === 1 && (livingNbrs < 2 || livingNbrs > 3)) {
					//if less than 2 or more than 3 neighbors, cell dies
					newBoard[row][col] = 0;
				} else if (currentCellVal === 0 && livingNbrs === 3) {
					// //cell is dead, if equals to 3 live neighbors, cell lives
					newBoard[row][col] = 1;
				} else {
					newBoard[row][col] = currentCellVal;
				}
			}
		}
		this.board = newBoard;
	}

	loadCellFormat(inputStr) {
		// dots are empty; O's are alive (that's a letter 'O', not zero)
		// Load at the top left of the board
		let row = 0;
		let col = 0;
		// Process each letter of the inputStr
		for (let ch of inputStr) {
			// If the character is a newline, increment row and reset col
			if (ch === '\n') {
				row++;
				col = 0;
			}
			// Else, process and load the character into the board
			else {
				let val = (ch === '.') ? 0 : 1;
				this.setCell(val, row, col);
				col++;
			}
		}
	}

	loadRLEFormat(rleStr) {
		let rle = new RLE(rleStr);
		console.log(`x: ${rle.x} y: ${rle.y}`);
		// Process the body
	}
}

class RLE {
	// this: x, y, rule, body

	constructor(rleStr) {
    /*
    RLE format: <number times to repeat pattern>
      b  => dead
      o  => alive
      $  => end of line
    */
		let lines = asLinesArr(rle);
		this.x = this.y = null;
		this.body = '';
		for (let line of lines) {
			// Ignore comments
			if (line && line[0] === '#') {
				continue;
			}

			// Parse the width and height
			if (line && line[0] === 'x') {
				// Format: x = m, y = n, rule = something
				let commaSeparatedArr = line.split(',');
				this.x = commaSeparatedArr[0].trim.split(' ')[2];
				this.y = commaSeparatedArr[1].trim.split(' ')[2];
			}
			// Else it's part of the body
			else {
				this.body += line;
			}
		}
	}
}

function asLinesArr(str) {
	let lines = [];
	let line = '';

	// For each character in the str
	for (let ch of str) {
		// If there's a newline, reset the line var
		if (ch === '\n') {
			if (line) {
				lines.push(line);
			}
			line = '';
		}
		// It's not a newline char, add the char to the line var
		else {
			line += ch;
		}
	}
	lines.push(line);
	return lines;
}
