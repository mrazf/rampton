const alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]

export const xy = (x, y) => {
  const col = alphabet[x - 1]

  return `${col}${y.toString()}`
}

export const gridRange = ({ startColumnIndex, startRowIndex, endColumnIndex, endRowIndex }) => {
  const startColumn = alphabet[startColumnIndex]
  const startRow = startRowIndex === undefined ? '' : startRowIndex + 1
  const endColumn = alphabet[endColumnIndex - 1]
  const endRow = endRowIndex === undefined ? '' : endRowIndex

  return `${startColumn}${startRow}:${endColumn}${endRow}`
}
