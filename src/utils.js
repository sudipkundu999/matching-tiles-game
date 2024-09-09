const COLUMNS = 4;

const getRandomHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); // thanks ChatGPT

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getColorsArray = (total) => {
  const halfColorsArray = Array(total / 2).fill().map((_) => getRandomHexColor());
  const fullcolorsArray = [...halfColorsArray, ...halfColorsArray];
  return shuffleArray(fullcolorsArray);
}

export const getGameBoardCells = (total) => {
  const columns = COLUMNS;
  const rows = total / columns;
  const colorsArray = getColorsArray(rows * columns);
  const gameBoardCells = new Array(columns).fill().map((_, columnIndex) =>
    Array(rows).fill().map((_, rowIndex) => ({
        background: colorsArray[columnIndex + rowIndex * columns],
        isMatchingFound: false,
        isVisible: false,
      }))
  );
  return gameBoardCells;
};
