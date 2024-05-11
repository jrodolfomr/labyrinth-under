import { useEffect } from 'react'
import '../styles/labyrinth.css'

import { Cell } from './Cell'
import { GameResults } from './GameResults'
import { useGameLogic } from './useGameLogic'
import { ButtonsController } from './ButtonsController'
import { LabyrinthGrid } from './LabyrinthGrid'

export const Labyrinth = () => {
  const [steps, stats, cells, spritePosition, hWalls, vWalls, flags,
    moveSprite, handleHammer, handleBacktrack, handleHammerMode, changeMode] = useGameLogic()

  const handleKeyPress = (event) => {
    event.preventDefault()

    switch (event.key) {
      case 'ArrowRight':
        flags.isHammerMode ? handleHammer('right') : moveSprite('right')
        break
      case 'ArrowLeft':
        flags.isHammerMode ? handleHammer('left') : moveSprite('left')
        break
      case 'ArrowDown':
        flags.isHammerMode ? handleHammer('down') : moveSprite('down')
        break
      case 'ArrowUp':
        flags.isHammerMode ? handleHammer('up') : moveSprite('up')
        break
      case 'Enter':
        moveSprite('enter')
        break
      // case 'C':
      // case 'c':
      //   changeMode()
      //   break
      case 'Backspace':
        handleBacktrack()
        break
      default:
    }
    if (flags.isHammerMode) {
      handleHammerMode(false)
    }
  }

  // useEffect(() => {
  //   // console.log("cells=", JSON.stringify(cells));
  //   // console.log("horizontalWalls=", JSON.stringify(horizontalWalls));
  //   // console.log("verticalWalls=", JSON.stringify(verticalWalls));
  // }, [cells, horizontalWalls, verticalWalls])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  })

  return (
    <div className='labyrinth-container'>
      <LabyrinthGrid>
        {cells.map((row, indexY) =>
          row.map((cell, indexX) => (
            <Cell
              key={`cell-${indexY}-${indexX}`}
              wallUp={hWalls[indexY][indexX]}
              wallDown={hWalls[indexY + 1][indexX]}
              wallLeft={vWalls[indexY][indexX]}
              wallRight={vWalls[indexY][indexX + 1]}
              isSelected={
                spritePosition.x === indexX && spritePosition.y === indexY
              }
              isTeleported={flags.isTeleportMove}
              isWarped={flags.isWarpMove}
              cellId={cell}
            />
          ))
        )}
      </LabyrinthGrid>
      <GameResults
        stats={stats} gameSteps={steps}
        isHammerMode={flags.isHammerMode} isTeleportMove={flags.isTeleportMove}
        isWinGame={flags.isWinGame} isWarpMove={flags.isWarpMove}
        handleHammerMode={
          () => handleHammerMode(true)
        }
      />
      <ButtonsController />
      <button className='item gameModeBtn' onClick={() => changeMode()}>
        <a>
          <p className='label success new-label'>
            <span className='stepIcon align' />
          </p>
        </a>
      </button>
      {/* <button className='item options'>
        <a>
          <p className='label success new-label'>
            <span className='warp align' />
          </p>
        </a>
      </button> */}
    </div>
  )
}
