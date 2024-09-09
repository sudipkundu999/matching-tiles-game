import { useRef, useState } from 'react';
import { getGameBoardCells } from './utils';

const MatchingTilesGame = ({ total }) => {
  const [gameBoard, setGameBoard] = useState(getGameBoardCells(total));
  const [totalMatchingTilesFound,setTotalMatchingTilesFound]= useState(0);
  const [isGameStarted,setIsGameStarted] = useState(false);
  const [movesPlayed,setMovesPlayed] = useState(0);
  const visibleTileOne = useRef(null);
  const visibleTileTwo = useRef(null);
  
  const onTileClick = (columnIndex, rowIndex) => {
    setIsGameStarted(true);
    setGameBoard((prev) => {
      const newGameBoard = [...prev];
      newGameBoard[columnIndex][rowIndex].isVisible = true;
      return newGameBoard;
    });
    if (visibleTileOne.current) {
      visibleTileTwo.current = { columnIndex, rowIndex };
    } else {
      visibleTileOne.current = { columnIndex, rowIndex }
    }
    evaluateMove();
  };

  function resetGame() {
    setGameBoard(getGameBoardCells(total));
    setTotalMatchingTilesFound(0);
    setMovesPlayed(0);
    clearVisibleTiles();
    setIsGameStarted(false);
  }

  function evaluateMove() {
    const isMatching = checkIfMatching();
    if (isMatching) {
      handleMatchingTiles();
      setMovesPlayed(prev => prev + 1);
    } else if (visibleTileTwo.current) {
      setMovesPlayed(prev => prev + 1);
      setTimeout(()=>hideVisibleTiles(),250);
    } else {
      console.log("Play next move");
    }
  }

  function clearVisibleTiles() {
    setTimeout(()=>{
      visibleTileOne.current = null;
      visibleTileTwo.current = null;
    },0)
  }

  function handleMatchingTiles() {
    setGameBoard(prev => {
      const newGameBoard = [...prev];
      newGameBoard[visibleTileOne.current.columnIndex][visibleTileOne.current.rowIndex].isMatchingFound = true;
      newGameBoard[visibleTileTwo.current.columnIndex][visibleTileTwo.current.rowIndex].isMatchingFound = true;
      return newGameBoard;
    })
    setTotalMatchingTilesFound(prev=>prev+2);
    clearVisibleTiles();
  }

  function hideVisibleTiles() {
    setGameBoard(prev => {
      const newGameBoard = prev;
      newGameBoard[visibleTileOne.current.columnIndex][visibleTileOne.current.rowIndex].isVisible = false;
      newGameBoard[visibleTileTwo.current.columnIndex][visibleTileTwo.current.rowIndex].isVisible = false;
      return [...newGameBoard];
    })
    clearVisibleTiles();
  }

  function checkIfMatching() {
    if(visibleTileTwo.current === null){
      return false
    }

    const bg1 = gameBoard[visibleTileOne.current.columnIndex][visibleTileOne.current.rowIndex].background;
    const bg2 = gameBoard[visibleTileTwo.current.columnIndex][visibleTileTwo.current.rowIndex].background;
    return bg1 === bg2
  }

  const Cell = ({ columnIndex, rowIndex }) => {
    const currentCell = gameBoard?.[columnIndex][rowIndex];
    const showBackground = currentCell.isMatchingFound || currentCell.isVisible;
    return (
      <button
        onClick={() => onTileClick(columnIndex, rowIndex)}
        style={{
          background: showBackground ? currentCell.background : '#1f1f1',
        }}
        disabled={showBackground}
      />
    );
  };

  const GameInfo = () => {
    return (
      <div id="game-info">
        <span>Total Matching Tiles Found : {totalMatchingTilesFound}</span> |
        <span>Moves Played : {movesPlayed}</span>
        <button id="reset-button" onClick={resetGame} disabled={!isGameStarted}>
          Reset
        </button>
      </div>
    );
  };

  const GameBoard = () => {
    return (
      <table>
        <tbody>
          {gameBoard[0].map((_, rowIndex) => {
            return (
              <tr key={rowIndex}>
                {gameBoard.map((_, columnIndex) => {
                  return (
                    <td key={columnIndex}>
                      <Cell columnIndex={columnIndex} rowIndex={rowIndex} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <GameInfo />
      <GameBoard />
    </>
  );
};

export default MatchingTilesGame;
