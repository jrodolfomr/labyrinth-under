import { CellType } from '../utils/utils'

export function Cell ({ wallLeft, wallRight, wallUp, wallDown, cellId, isSelected, isTeleported, isWarped }) {
  const WALLINNER = 1
  const WALLOUTER = 2
  const setWalls = () => {
    const wallClass = []
    if (wallUp === WALLINNER) wallClass.push('wallup')
    if (wallDown === WALLINNER) wallClass.push('walldown')
    if (wallLeft === WALLINNER) wallClass.push('wallleft')
    if (wallRight === WALLINNER) wallClass.push('wallright')

    if (wallUp === WALLOUTER) wallClass.push('blockup')
    if (wallDown === WALLOUTER) wallClass.push('blockdown')
    if (wallLeft === WALLOUTER) wallClass.push('blockleft')
    if (wallRight === WALLOUTER) wallClass.push('blockright')

    return wallClass.length > 0 ? wallClass.join(' ') + ' ' : ''
  }

  const setSelectedClass = () => {
    const selectedClass = []
    if (isSelected) selectedClass.push('selected')
    if (isTeleported) selectedClass.push('teleported')
    if (isWarped) selectedClass.push('warped')

    return selectedClass.length > 0 ? selectedClass.join(' ') + ' ' : ''
  }

  return (
    <div className={`cell  ${setWalls()}${setSelectedClass()}${CellType(cellId)}`} />
  )
}
