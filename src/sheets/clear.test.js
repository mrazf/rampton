import { clearRequest } from './clear'

jest.mock('../firebase')

describe('Sheets clearRequest', () => {
  const spreadsheet = {
    spreadsheetId: 'a1b2c3',
    namedRanges: [{
      name: 'aprMonzoTransactions',
      range: {
        sheetId: 1234,
        startRowIndex: 1,
        endRowIndex: 2,
        startColumnIndex: 3,
        endColumnIndex: 4
      }
    }]
  }

  it('returns the expected clear request', () => {
    const request = clearRequest(spreadsheet, 3)

    expect(request.spreadsheetId).toEqual('a1b2c3')
    expect(request.range).toEqual('Apr!D3:D')
  })
})
