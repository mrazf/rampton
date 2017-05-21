import { xy, gridRange } from './a-one-converter'

describe('A1 converter', () => {
  it('converts 1, 1 to A1', () => {
    expect(xy(1, 1)).toEqual('A1')
  })

  describe('converts "GridRange"s', () => {
    it('A1:A1', () => {
      const input = { startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 1 }

      expect(gridRange(input)).toEqual('A1:A1')
    })

    it('A3:B4', () => {
      const input = { startRowIndex: 2, endRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 }

      expect(gridRange(input)).toEqual('A3:B4')
    })

    it('A:B', () => {
      const input = { startColumnIndex: 0, endColumnIndex: 2 }

      expect(gridRange(input)).toEqual('A:B')
    })

    it('A5:B', () => {
      const input = { startRowIndex: 4, startColumnIndex: 0, endColumnIndex: 2 }

      expect(gridRange(input)).toEqual('A5:B')
    })
  })
})
