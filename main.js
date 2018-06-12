let width = 25;
let height = 20; // width and height dimensions of the board

/**
 * Create a Game of Life instance
 */

let gol = new GameOfLife(width, height);

/**
 * create a table and append to the DOM
 */

// Actual table cells
const tds = [];


function setUpBoard() {

}

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
document.getElementById('board').append(table);

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
	tds.forEach(function (td) {
		let row = td.dataset.row;
		let col = td.dataset.col;

		let currentVal = gol.getCell(row, col);
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

document.getElementById('board').addEventListener('mousedown', event => {
	// Toggle clicked cell (event.target) and paint
	console.log('board clicked. tagName: ' + event.target.tagName);
	if (event.target.tagName !== 'TD') {
		return;
	}

	let row = event.target.dataset.row;
	let col = event.target.dataset.col;
	gol.toggleCell(row, col);
	paint();
});

document.getElementById('boardDim').addEventListener('change', event => {
	console.log('board dimensions changed');
	try {
		let inputWidth = parseInt(document.getElementById('boardWidth').value);
		let inputHeight = parseInt(document.getElementById('boardHeight').value);
		width = inputWidth;
		height = inputHeight;
		console.log('width: ' + width + ' height: ' + height);
		gol = new GameOfLife(width, height);
		paint();
	} catch (error) {
		console.log(error);
	}
});

document.getElementById('step_btn').addEventListener('click', event => {
	// Do one gol tick and paint
	console.log('step btn clicked');
	gol.tick();
	paint();
});

let interval;

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
	if (interval) {
		clearInterval(interval);
		interval = null;
		return;
	}
	interval = setInterval(function () {
		gol.tick();
		paint();
		console.log('setInterval running');
	}, 100);
});

document.getElementById('random_btn').addEventListener('click', event => {
	// Randomize the board and paint
	console.log('random btn clicked');
	tds.forEach(function (td) {
		let randoNumber = Math.round(Math.random());
		let row = td.dataset.row;
		let col = td.dataset.col;

		console.log(randoNumber);
		gol.setCell(randoNumber, row, col);
	});
	paint();
});

document.getElementById('clear_btn').addEventListener('click', event => {
	console.log('clear btn clicked');
	tds.forEach(function (td) {
		let row = td.dataset.row;
		let col = td.dataset.col;
		gol.setCell(0, row, col);
	});
	paint();
	clearInterval(interval);
});

document.getElementById('file_input').addEventListener('change', () => {
	let fileList = this.files;
	console.log('file_input changed. fileList: ' + fileList);

}, false);


let acorns = `.O.....
...O...
OO..OOO`;

gol.loadCellFormat(acorns);
paint();
