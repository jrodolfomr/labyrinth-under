export const CellType = (cell) => {
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

  if (cell === 20) return 'visited visitedup'
  if (cell === 21) return 'visited visiteddown'
  if (cell === 22) return 'visited visitedleft'
  if (cell === 23) return 'visited visitedright'
  if (cell === 24) return 'visited visitedspecial'
}

export const wrap = (s, w) => s.replace(
  new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
)
