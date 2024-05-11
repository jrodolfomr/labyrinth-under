import { useState } from 'react'
import { leveldata } from '../data/leveldata'

const LIVESSTART = 5 // 1000 // 5

const ACID_RESIST = 2 // 1000 // 2

const MEDALS_TO_POINT = 2 // 2

const MEDAL_COST = 5 // 5

const LOCK_KEYS = 3 // 3

const warpLocations = [
  { x: 8, y: 2 },
  { x: 2, y: 4 },
  { x: 11, y: 6 },
  { x: 6, y: 11 },
  { x: 10, y: 13 }
]

export const useGameLogic = () => {
  const startGameStats = {
    level: 1,
    score: 0,
    lives: LIVESSTART,
    medals: 0,
    keys: 0,
    acid: 0,
    hammer: 0,
    isMove: true
  }

  const [stats, setStats] = useState(startGameStats)

  const [stack, setStack] = useState([])

  const [horizontalWalls, setHorizontalWalls] = useState(
    leveldata[0].horizontalWalls
  )
  const [verticalWalls, setVerticalWalls] = useState(
    leveldata[0].verticalWalls
  )

  const [cells, setCells] = useState(leveldata[0].cells) // initial stack is empty

  const [isVisitedMode, setIsVisitedMode] = useState(false)

  // flags
  const [isTeleportMove, setTeleportMove] = useState(false)
  const [isHammerMode, setHammerMove] = useState(false)
  const [isWinGame, setWinGame] = useState(false)
  const [isWarpMove, setWarpMove] = useState(false)
  const [teleportDirection, setTeleportDirection] = useState('')
  const [warpLocationIndex, setWarpLocationIndex] = useState(0)

  // player position
  const [prevSpritePosition, setPrevSpritePosition] = useState({})
  const [spritePosition, setSpritePosition] = useState({ x: 1, y: 1 })

  const oldX = spritePosition.x
  const oldY = spritePosition.y

  const push = (element) => {
    setStack((prevStack) => [...prevStack, element])
  }

  const setVisited = ({ direction }) => {
    if (isVisitedMode) {
      switch (direction) {
        case 'up': return 20
        case 'down': return 21
        case 'left': return 22
        case 'right': return 23
      }
      return 24
    }
    return 0
  }

  const pop = () => {
    if (stack.length === 0) return
    const prevData = JSON.parse(stack[stack.length - 1])

    setStats({
      ...stats,
      level: prevData.level,
      score: prevData.score,
      lives: prevData.lives,
      medals: prevData.medals,
      keys: prevData.keys,
      acid: prevData.acid,
      hammer: prevData.hammer,
      isMove: prevData.isMove
    })

    setCells(prevData.cells)

    setHorizontalWalls(prevData.horizontalWalls)
    setVerticalWalls(prevData.verticalWalls)

    setSpritePosition(prevData.spritePosition)

    setStack((prevStack) => prevStack.slice(0, -1))
  }

  /// //////////////////////////////////////////////////////////////////////
  /// //////////////////////////////////////////////////////////////////////
  /// //////////////////////////////////////////////////////////////////////
  const handleBacktrack = () => {
    if ((isTeleportMove || isWarpMove)) {
      // reset position if no other move is expected in selection
      setTeleportMove(false)
      setTeleportDirection('')

      setWarpMove(false)
      setWarpLocationIndex(0)
      setSpritePosition(prevSpritePosition)
    }
    pop()
  }

  const handleHammerMode = (value) => {
    setHammerMove(value)
  }

  const moveSprite = (direction, specialMove = '') => {
    if (stats.lives === 0 || !stats.isMove) return

    const move = specialMove || ''
    if (stats.hammer <= 0 && move === 'hammer') return
    console.log('check Teleport: ' + isTeleportMove)
    console.log('check warp: ' + isWarpMove)
    const newX = spritePosition.x +
      (direction === 'left' ? -1 : direction === 'right' ? 1 : 0)
    const newY = spritePosition.y +
      (direction === 'up' ? -1 : direction === 'down' ? 1 : 0)
    const cellCompare = [14, 20, 21, 22, 23]
    // if(cells[newY][newX]===cellCompare)
    if (!isWarpMove && !isTeleportMove && cellCompare.some((e) => e === cells[newY][newX])) return

    console.log({ newX, newY })
    let wallCompare = [0]

    if (move === 'hammer') wallCompare = [1]

    if (isWarpMove) {
      let warpIndex = warpLocationIndex
      const prevIndex = warpIndex
      if (direction === 'up' || direction === 'right') {
        warpIndex++
        if (warpIndex > 4) warpIndex = 0
      }
      if (direction === 'down' || direction === 'left') {
        warpIndex--
        if (warpIndex < 0) {
          warpIndex = 4
        }
      }
      console.log(`Warp Index | is  +(${prevIndex}-> ${warpIndex})=>${direction}`)

      if (direction === 'enter') {
        stack[stack.lengh - 1] = JSON.stringify({
          level: stats.level,
          score: stats.score,
          lives: stats.lives,
          medals: stats.medals,
          keys: stats.keys,
          acid: stats.acid,
          hammer: stats.hammer,
          isMove: stats.isMove,
          spritePosition,
          cells,
          horizontalWalls,
          verticalWalls
        })
        const warpX = warpLocations[warpIndex].x
        const warpY = warpLocations[warpIndex].y
        console.log(`TELEPORT IN PROCESS!! (${warpX},${warpY})`)
        if (prevSpritePosition.x === warpX && prevSpritePosition.y === warpY) { return }
        if (cells[warpY][warpX] !== 11) return
        // setSpritePosition(()=>({ x: warpX, y: newY }));
        checkSriteInCell({ x: newX, y: newY, direction })

        setWarpMove(() => false)
        setWarpLocationIndex(0)
        return
      }

      setWarpLocationIndex(warpIndex)
      setSpritePosition(() => warpLocations[warpIndex])
      console.log('is still warp move ')
      return
    }

    if (isTeleportMove) wallCompare = [0, 1]
    if (oldX >= 0 && oldX < cells.length && oldY >= 0 && oldY < cells.length) {
      if (direction === 'up') {
        if (wallCompare.every((e) => e !== horizontalWalls[oldY][oldX])) {
          // Collision with horizontal wall
          return
        }
      }
      if (direction === 'down') {
        if (wallCompare.every((e) => e !== horizontalWalls[oldY + 1][oldX])) {
          // Collision with horizontal wall
          return
        }
      } else if (direction === 'left') {
        if (wallCompare.every((e) => e !== verticalWalls[oldY][oldX])) {
          // Collision with vertical wall
          return
        }
      } else if (direction === 'right') {
        if (wallCompare.every((e) => e !== verticalWalls[oldY][oldX + 1])) {
          // Collision with vertical wall
          return
        }
      } else if (direction === 'enter') {
        if (isTeleportMove) {
          stack[stack.lengh - 1] = JSON.stringify({
            level: stats.level,
            score: stats.score,
            lives: stats.lives,
            medals: stats.medals,
            keys: stats.keys,
            acid: stats.acid,
            hammer: stats.hammer,
            isMove: stats.isMove,
            spritePosition,
            cells,
            horizontalWalls,
            verticalWalls
          })

          console.log(`TELEPORT IN PROCESS!! (${newX},${newY})`)
          const cellCompare = [14, 20, 21, 22, 23]
          // if(cells[newY][newX]===cellCompare)
          if (cellCompare.some((e) => e === cells[newY][newX])) return
          if (prevSpritePosition.x === newX && prevSpritePosition.y === newY) { return }
          setSpritePosition(() => ({ x: newX, y: newY }))
          checkSriteInCell({ x: newX, y: newY, direction })

          setTeleportMove(() => false)
          setTeleportDirection('')
          return
        }
      }

      if (!isTeleportMove && direction !== 'enter') {
        push(
          JSON.stringify({
            level: stats.level,
            score: stats.score,
            lives: stats.lives,
            medals: stats.medals,
            keys: stats.keys,
            acid: stats.acid,
            hammer: stats.hammer,
            isMove: stats.isMove,
            spritePosition,
            cells,
            horizontalWalls,
            verticalWalls
          })
        )
      }

      if (teleportDirection === 'horizontal' &&
        (newX >= prevSpritePosition.x || newY !== prevSpritePosition.y)) { return }
      if (teleportDirection === 'vertical' &&
        (newY >= prevSpritePosition.y || newX !== prevSpritePosition.x)) { return }

      setSpritePosition(() => ({ x: newX, y: newY }))
      console.log('is still teleport move ')
      if (isTeleportMove || direction === 'enter') return
      checkSriteInCell({ x: newX, y: newY, direction })

      if (move === 'hammer') substractHammer()
    }
  }

  const CellType = (cell) => {
    if (cell === 0) return 'empty'
    if (cell === 1) return 'wall'
    if (cell === 2) return 'point'
    if (cell === 3) return 'minuL'
    if (cell === 4) return 'plusL'
    if (cell === 5) return 'lock3'
    if (cell === 6) return 'key'
    if (cell === 7) return 'medals'
    if (cell === 8) return 'bomb'
    if (cell === 9) return 'directionup'
    if (cell === 10) return 'acid'
    if (cell === 11) return 'warp'
    if (cell === 12) return 'hammer'
    if (cell === 13) return 'forceup'
    if (cell === 14) return 'entrance'
    if (cell === 15) return 'exit'
    if (cell === 16) return 'directionleft'
    if (cell === 17) return 'forceright'
  }

  const checkSriteInCell = ({ x, y, direction }) => {
    console.log(`Checking what's in the cell (x:${x},y:${y})`)
    console.log(
      `In this cell there is a ${CellType(cells[y][x])} C(${cells[y][x]})`
    )

    applyCell({ x, y, cellType: cells[y][x], direction })
  }

  const addPoints = () => {
    let score = stats.score
    score = score + 1
    setStats({ ...stats, score })
  }
  const substractLife = () => {
    let lives = stats.lives
    lives = lives - 1
    setStats({ ...stats, lives })
  }
  const addLife = () => {
    let lives = stats.lives
    lives = lives + 1
    setStats({ ...stats, lives })
  }
  const addAcid = () => {
    let acid = stats.acid
    acid = acid + 1
    let isMove = stats.isMove
    if (acid >= ACID_RESIST) {
      isMove = false
    }
    setStats({ ...stats, acid, isMove })
  }

  const addHammer = () => {
    let hammer = stats.hammer
    hammer = hammer + 1
    setStats({ ...stats, hammer })
  }

  const forceRight = () => {
    console.log('forcingRight')
    setSpritePosition((prev) => {
      return { ...prev, x: prev.x + 1 }
    })
  }

  const forceUp = () => {
    console.log('forceup')
    setSpritePosition((prev) => {
      return { ...prev, y: prev.y - 1 }
    })
  }
  const substractHammer = () => {
    let hammer = stats.hammer
    hammer = hammer - 1
    setStats((prevStats) => ({ ...prevStats, hammer }))
  }
  const addKey = () => {
    let key = stats.keys
    key = key + 1
    setStats({ ...stats, keys: key })
  }
  const addMedals = () => {
    let medals = stats.medals
    let score = stats.score
    medals = medals + 1
    if (medals === MEDALS_TO_POINT) {
      score = score + MEDAL_COST

      medals = 0
    }
    setStats({ ...stats, medals, score })
  }
  const handleExit = () => {
    setTimeout(() => {
      if (stats.level === 5) {
        // window.alert('end game')
        setWinGame(true)
        return
      }
      changeLevel(stats.level + 1)
    }, 500)
  }
  const handleLock = () => {
    if (stats.keys < LOCK_KEYS) {
      setStats({ ...stats, isMove: false })
    } else {
      setStats({ ...stats, keys: 0 })
    }
  }

  const applyBomb = ({ x, y }) => {
    // console.log("ApplyBOMB, destroy elements");
    const tempHWalls = JSON.parse(JSON.stringify(horizontalWalls))
    const tempVWalls = JSON.parse(JSON.stringify(verticalWalls))

    tempHWalls[y][x] = tempHWalls[y][x] === 1 ? 0 : tempHWalls[y][x]
    tempHWalls[y + 1][x] =
      tempHWalls[y + 1][x] === 1 ? 0 : tempHWalls[y + 1][x]
    tempVWalls[y][x] = tempVWalls[y][x] === 1 ? 0 : tempVWalls[y][x]
    tempVWalls[y][x + 1] =
      tempVWalls[y][x + 1] === 1 ? 0 : tempVWalls[y][x + 1]

    setHorizontalWalls(tempHWalls)
    setVerticalWalls(tempVWalls)
    return 'bomb'

    // setCells(tempCells);
  }
  const handleHammer = (direction) => {
    moveSprite(direction, 'hammer')
  }
  const applyCell = ({ x, y, cellType, direction }) => {
    const selectedCellType = CellType(cellType)
    let effect = ''
    const tempCells = JSON.parse(JSON.stringify(cells))
    switch (selectedCellType) {
      case 'empty':
        break
      case 'wall':
        return
      case 'point':
        addPoints()
        break
      case 'minuL':
        substractLife()
        break
      case 'plusL':
        addLife()
        break
      case 'lock3':
        handleLock()
        break
      case 'key':
        addKey()
        break
      case 'medals':
        addMedals()
        break
      case 'bomb':
        effect = applyBomb({ x, y })
        break
      case 'directionup':
        tempCells[y][x] = setVisited({ direction })
        setPrevSpritePosition({ x, y })
        setTeleportDirection('vertical')
        setTeleportMove(true)
        break
      case 'directionleft':
        tempCells[y][x] = setVisited({ direction })
        setPrevSpritePosition({ x, y })
        setTeleportDirection('horizontal')
        setTeleportMove(true)
        break
      case 'acid':
        addAcid()
        break
      case 'warp':
        tempCells[y][x] = setVisited({ direction })
        if ([].concat.apply([], tempCells).filter((x) => x === 11).length > 1) {
          if (!isWarpMove) {
            setPrevSpritePosition({ x, y })
            setWarpMove(true)
          }
        }
        break
      case 'hammer':
        addHammer()
        break
      case 'forceup':
        if (direction === 'down') {
          setStats({ ...stats, isMove: false })
          return
        }
        tempCells[y - 1][x] = setVisited({ direction })
        forceUp()
        break
      case 'forceright':
        if (direction === 'left') {
          setStats({ ...stats, isMove: false })
          return
        }
        tempCells[y][x + 1] = setVisited({ direction })
        forceRight()
        break
      case 'entrance':
        break
      case 'exit':
        handleExit()
        break
    }

    if (effect === 'bomb') {
      [-1, 1].map((el) => {
        let tDy = tempCells[y + el][x]
        let tDx = tempCells[y][x + el]
        if ([1, 20, 21, 22, 23].every((e) => e !== tDy)) tDy = 0 // [1,20]
        if ([1, 20, 21, 22, 23].every((e) => e !== tDx)) tDx = 0
        tempCells[y + el][x] = tDy
        tempCells[y][x + el] = tDx
        return 0
      })
    }

    tempCells[y][x] = setVisited({ direction })
    console.log('set final position: ' + x + ' ' + y)
    setCells(tempCells)
  }

  const changeLevel = (level) => {
    const currentLevel = leveldata[level - 1]

    setStats({ ...stats, level })
    setSpritePosition(leveldata[level - 1].startPosition)
    setHorizontalWalls(currentLevel.horizontalWalls)
    setVerticalWalls(currentLevel.verticalWalls)
    setCells(currentLevel.cells)
  }

  const changeMode = () => {
    // toggle the isVisited flag, reset the stack, restart game to level 1
    setIsVisitedMode(!isVisitedMode)
    changeLevel(1)
    setStack([])
    setTeleportMove(false)
    setWarpMove(false)
    setHammerMove(false)
    setWinGame(false)
    setStats(startGameStats)
    setTeleportDirection('')
    setWarpLocationIndex(0)
  }

  const flags = {
    isTeleportMove,
    isWarpMove,
    isHammerMode,
    isWinGame
  }
  const hWalls = horizontalWalls
  const vWalls = verticalWalls
  const steps = stack.length
  return [steps, stats, cells, spritePosition, hWalls, vWalls, flags, moveSprite, handleHammer, handleBacktrack, handleHammerMode, changeMode]
}
