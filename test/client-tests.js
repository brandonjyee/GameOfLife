const assert = chai.assert;

describe('test game engine', () => {

  let gol;
  const WIDTH = 20;
  const HEIGHT = 20;

  beforeEach(() => {
    gol = new GameOfLife(WIDTH, HEIGHT, true);
  });

  it('array should start empty', function () {
    var arr = [];

    assert.equal(arr.length, 0);
  });

  describe('wrapping', () => {
    it('wrap starting from top left corner', () => {
      /**
       *   |_B_|_A_|
       *   |_C_| TL
       *   |_D_|
       */
      // A
      const [rowA, colA] = gol.convertToValidCoords(-1, 0);
      assert.equal(rowA, HEIGHT - 1);
      assert.equal(colA, 0);

      // B
      const [rowB, colB] = gol.convertToValidCoords(-1, -1);
      assert.equal(rowB, HEIGHT - 1);
      assert.equal(colB, WIDTH - 1);

      // C
      const [rowC, colC] = gol.convertToValidCoords(0, -1);
      assert.equal(rowC, 0);
      assert.equal(colC, WIDTH - 1);

      // D
      const [rowD, colD] = gol.convertToValidCoords(1, -1);
      assert.equal(rowD, 1);
      assert.equal(colD, WIDTH - 1);
    });

    it('wrap starting at top right corner', () => {
      /**
      *   |_A_|_B_|
      *    TR |_C_|
      *       |_D_|
      */
      // A
      const [rowA, colA] = gol.convertToValidCoords(-1, WIDTH - 1);
      assert.equal(rowA, HEIGHT - 1);
      assert.equal(colA, WIDTH - 1);

      // B
      const [rowB, colB] = gol.convertToValidCoords(-1, WIDTH);
      assert.equal(rowB, HEIGHT - 1);
      assert.equal(colB, 0);

      // C
      const [rowC, colC] = gol.convertToValidCoords(0, WIDTH);
      assert.equal(rowC, 0);
      assert.equal(colC, 0);

      // D
      const [rowD, colD] = gol.convertToValidCoords(1, WIDTH);
      assert.equal(rowD, 1);
      assert.equal(colD, 0);
    });

    it('wrap starting at bottom right corner', () => {
      /**
      *       |_D_|
      *    BR |_C_|
      *   |_A_|_B_|
      */
      // A
      const [rowA, colA] = gol.convertToValidCoords(HEIGHT, WIDTH - 1);
      assert.equal(rowA, 0);
      assert.equal(colA, WIDTH - 1);

      // B
      const [rowB, colB] = gol.convertToValidCoords(HEIGHT, WIDTH);
      assert.equal(rowB, 0);
      assert.equal(colB, 0);

      // C
      const [rowC, colC] = gol.convertToValidCoords(HEIGHT - 1, WIDTH);
      assert.equal(rowC, HEIGHT - 1);
      assert.equal(colC, 0);

      // D
      const [rowD, colD] = gol.convertToValidCoords(HEIGHT - 2, WIDTH);
      assert.equal(rowD, HEIGHT - 2);
      assert.equal(colD, 0);
    });

    it('wrap starting at bottom left corner', () => {
      /**
      *   |_D_|
      *   |_C_| BL
      *   |_B_|_A_|
      */
      // A
      const [rowA, colA] = gol.convertToValidCoords(HEIGHT, 0);
      assert.equal(rowA, 0);
      assert.equal(colA, 0);

      // B
      const [rowB, colB] = gol.convertToValidCoords(HEIGHT, -1);
      assert.equal(rowB, 0);
      assert.equal(colB, WIDTH - 1);

      // C
      const [rowC, colC] = gol.convertToValidCoords(HEIGHT - 1, -1);
      assert.equal(rowC, HEIGHT - 1);
      assert.equal(colC, WIDTH - 1);

      // D
      const [rowD, colD] = gol.convertToValidCoords(HEIGHT - 2, -1);
      assert.equal(rowD, HEIGHT - 2);
      assert.equal(colD, WIDTH - 1);
    });
  });

});
