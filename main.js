const DEFAULT_WIDTH = 60;
const DEFAULT_HEIGHT = 30; // width and height dimensions of the board

/**
 * Global state
 */
const state = {
	gol: new GameOfLife(DEFAULT_WIDTH, DEFAULT_HEIGHT, true),		// The game engine instance
	tds: [],				// Contains the td elements that make up the board squares
	processId: null,	// Id of the running simulation process
	rate: 100,				// Rate (ms) at which to run the simulation
};

// Initial setups
setInitialInputs();
setUpBoardUI(DEFAULT_WIDTH, DEFAULT_HEIGHT);


function setInitialInputs() {
	document.getElementById('boardWidth').value = DEFAULT_WIDTH;
	document.getElementById('boardHeight').value = DEFAULT_HEIGHT;
}

/**
 * create a table and append to the DOM
 */
function setUpBoardUI(width, height) {
	// Actual table cells
	let tds = [];
	// <table> element
	const table = document.createElement('tbody');
	// build a table row <tr>
	for (let h = 0; h < height; h++) {
		const tr = document.createElement('tr');
		// build a table column <td>
		for (let w = 0; w < width; w++) {
			const td = document.createElement('td');
			// We'll put the coordinates on the cell
			// Element itself (using dataset),
			// letting us fetch it in a click listener later.
			td.dataset.row = h;
			td.dataset.col = w;
			tds.push(td);
			tr.append(td);
		}
		table.append(tr);
	}
	let boardElem = document.getElementById('board');
	// Clear if there's an existing board
	boardElem.innerHTML = '';
	// Put in the new board
	boardElem.append(table);
	state.tds = tds;
}

/**
 * Draws every cell from the gol instance into an actual, visible DOM element
 */

const paint = () => {
	//   1. For each <td> in the table:
	//     a. If its corresponding cell in gol instance is alive,
	//        give the <td> the `alive` CSS class.
	//     b. Otherwise, remove the `alive` class.
	//
	// To find all the <td>s in the table, might query the DOM for them, or
	// could choose to collect them when create them in createTable.
	state.tds.forEach(function (td) {
		let row = td.dataset.row;
		let col = td.dataset.col;

		let currentVal = state.gol.getCell(row, col);
		// Add class 'alive' if alive
		if (currentVal) {
			td.className = 'alive';
		} else {
			td.className = '';
		}
	});

};

/**
 * Event Listeners
 */
// Clicking on a board cell
document.getElementById('board').addEventListener('mousedown', event => {
	// Toggle clicked cell (event.target) and paint
	console.log('board clicked. tagName: ' + event.target.tagName);
	if (event.target.tagName !== 'TD') {
		return;
	}

	let row = event.target.dataset.row;
	let col = event.target.dataset.col;
	state.gol.toggleCell(row, col);
	paint();
});

// Changing the board dimensions
document.getElementById('boardDim').addEventListener('change', event => {
	console.log('board dimensions changed');
	try {
		let inputWidth = parseInt(document.getElementById('boardWidth').value);
		let inputHeight = parseInt(document.getElementById('boardHeight').value);
		width = inputWidth;
		height = inputHeight;
		console.log('width: ' + width + ' height: ' + height);
		// Initialize a new game engine instance
		state.gol = new GameOfLife(width, height);
		// Redraw the board UI
		setUpBoardUI(width, height);
		paint();
	} catch (error) {
		console.log(error);
	}
});

document.getElementById('step_btn').addEventListener('click', event => {
	// Do one gol tick and paint
	console.log('step btn clicked');
	state.gol.tick();
	paint();
});

document.getElementById('play_btn').addEventListener('click', event => {
	// Start playing by calling `tick` and paint
	// repeatedly every fixed time interval.
	console.log('play button clicked');
	// Toggle to be stop button
	let playBtn = document.getElementById('play_btn');
	if (playBtn.innerText === 'Play') {
		playBtn.innerText = 'Stop';
	} else {
		playBtn.innerText = 'Play';
	}

	paint();
	if (state.processId) {
		clearInterval(state.processId);
		state.processId = null;
		return;
	}
	state.processId = setInterval(function () {
		state.gol.tick();
		paint();
		console.log('setInterval running');
	}, state.rate);
});

document.getElementById('random_btn').addEventListener('click', event => {
	// Randomize the board and paint
	console.log('random btn clicked');
	state.tds.forEach(function (td) {
		let randoNumber = Math.round(Math.random());
		let row = td.dataset.row;
		let col = td.dataset.col;

		console.log(randoNumber);
		state.gol.setCell(randoNumber, row, col);
	});
	paint();
});

document.getElementById('clear_btn').addEventListener('click', event => {
	console.log('clear btn clicked');
	state.tds.forEach(function (td) {
		let row = td.dataset.row;
		let col = td.dataset.col;
		state.gol.setCell(0, row, col);
	});
	paint();
	clearInterval(state.processId);
});

document.getElementById('file_input').addEventListener('change', () => {
	let fileList = this.files;
	console.log('file_input changed. fileList: ' + fileList);

}, false);


let acorns = `.O.....
...O...
OO..OOO`;

state.gol.loadCellFormat(acorns);
paint();
