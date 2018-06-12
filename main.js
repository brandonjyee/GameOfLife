const width = 25;
const height = 20; // width and height dimensions of the board

/**
 * Create a Game of Life instance
 */

const gol = new GameOfLife(width, height);

/**
 * create a table and append to the DOM
 */

// Actual table cells
const tds = [];

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
	//
	//   https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
	//   https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName

	tds.forEach(function(td) {
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
	//[ {td dataset.row = 0; dataset.col = 0 }, {}]
};

/**
 * Event Listeners
 */

document.getElementById('board').addEventListener('mousedown', event => {
	// TODO: Toggle clicked cell (event.target) and paint
	console.log('board clicked. tagName: ' + event.target.tagName);
	if (event.target.tagName !== 'TD') {
		return;
	}

	let row = event.target.dataset.row;
	let col = event.target.dataset.col;
	gol.toggleCell(row, col);
	paint();
});

document.getElementById('step_btn').addEventListener('click', event => {
	// TODO: Do one gol tick and paint
	console.log('step btn clicked');
	gol.tick();
	paint();
});

let interval;

document.getElementById('play_btn').addEventListener('click', event => {
	// TODO: Start playing by calling `tick` and paint
	// repeatedly every fixed time interval.
	// HINT:
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
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
	interval = setInterval(function() {
		gol.tick();
		paint();
		console.log('setInterval running');
	}, 100);
});

document.getElementById('random_btn').addEventListener('click', event => {
	// TODO: Randomize the board and paint

	tds.forEach(function(td) {
		let randoNumber = Math.round(Math.random());
		let row = td.dataset.row;
		let col = td.dataset.col;

		console.log(randoNumber);
		gol.setCell(randoNumber, row, col);
	});
	paint();
	// if (randoNumber === 0) {
	// 	gol.setCell(0, gol.row, gol.col);
	// }

	console.log('random btn clicked');
});

document.getElementById('clear_btn').addEventListener('click', event => {
	tds.forEach(function(td) {
		let row = td.dataset.row;
		let col = td.dataset.col;
		gol.setCell(0, row, col);
	});
	paint();
	clearInterval(interval);
	console.log('clear btn clicked');
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
