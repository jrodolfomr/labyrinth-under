import { useState } from 'react'
import { useGameLogic } from './useGameLogic'

export const useCreativeMode = () => {
  const [isCreativeCell, setCreativeCell] = useState(false)

  const [cells, hWalls, vWalls] = useGameLogic()

  const saveLevelData = () => {
    // leveldata[stats.level - 1].horizontalWalls = horizontalWalls
    // leveldata[stats.level - 1].verticalWalls = verticalWalls
    // leveldata[stats.level - 1].cells = cells
  }
  const [cellsF, setCellsF] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  ])
  const toggleCreation = () => {
    const createToggle = !isCreativeCell
    setCreativeCell(createToggle)
  }

  const changeWallFormation = (y, x, formation) => {
    // console.log(`I clicked on CELL(${y},${x}), formation is ${formation} `);
    const tempHWalls = JSON.parse(JSON.stringify(hWalls))
    const tempVWalls = JSON.parse(JSON.stringify(vWalls))
    const tempCellF = JSON.parse(JSON.stringify(cellsF))
    const tempCells = JSON.parse(JSON.stringify(cells))

    let HWallUp = 0
    let HWallDown = 0
    let VWallLeft = 0
    let VWallRight = 0
    const setWall = 1

    if (!isCreativeCell) {
      switch (formation) {
        case 0:
          break
        case 1:
          HWallUp = setWall

          break
        case 2:
          HWallDown = setWall

          break
        case 3:
          VWallLeft = setWall

          break
        case 4:
          VWallRight = setWall
          break
        case 5:
          HWallUp = setWall
          HWallDown = setWall

          break
        case 6:
          VWallLeft = setWall
          VWallRight = setWall
          break
        case 7:
          HWallUp = setWall

          VWallLeft = setWall

          break
        case 8:
          HWallDown = setWall
          VWallLeft = setWall

          break
        case 9:
          HWallDown = setWall

          VWallRight = setWall
          break
        case 10:
          HWallUp = setWall

          VWallRight = setWall
          break
        case 11:
          HWallDown = setWall
          VWallLeft = setWall
          VWallRight = setWall
          break
        case 12:
          HWallUp = setWall
          HWallDown = setWall
          VWallLeft = setWall
          VWallRight = setWall
          break
      }

      tempHWalls[y][x] = tempHWalls[y][x] !== 99 ? HWallUp : tempHWalls[y][x]
      tempHWalls[y + 1][x] =
        tempHWalls[y + 1][x] !== 99 ? HWallDown : tempHWalls[y + 1][x]
      tempVWalls[y][x] = tempVWalls[y][x] !== 99 ? VWallLeft : tempVWalls[y][x]
      tempVWalls[y][x + 1] =
        tempVWalls[y][x + 1] !== 99 ? VWallRight : tempVWalls[y][x + 1]

      let tempCell

      tempCell = formation = formation + 1
      if (tempCell > 12) {
        tempCell = 0
      }

      // tempCellF[y][x] = tempCell
      //   setHorizontalWalls(tempHWalls)
      //   setVerticalWalls(tempVWalls)
      setCellsF(tempCellF)
    } else {
      let tempCellV = cells[y][x]
      tempCellV = tempCellV + 1
      if (tempCellV > 20) {
        tempCellV = 0
      }
      tempCells[y][x] = tempCellV
      //  setCells(tempCells)
    }
  }

  return [saveLevelData, changeWallFormation, toggleCreation]
}
