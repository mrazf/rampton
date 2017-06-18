import { replaceRequest } from './replace'

jest.mock('../firebase')

describe('Sheets replace request', () => {
  it('returns the expected request object', () => {
    const transaction = {
      dateTime: '2017-06-03T22:18:16.957Z',
      currency: 'GBP',
      amount: 11.5,
      merchant: 'The New Conservatory',
      categoryId: 'drinks-out',
      address: 'Albion Place, Leeds LS1 6JL',
      monzoCategory: 'eating_out',
      id: 'tx_00009L4sgrHBH7itCSijZp'
    }

    const categories = { 'drinks-out': 'Drinks Out' }

    const request = replaceRequest('a1b2c3', [transaction], categories, 3)

    expect(request.spreadsheetId).toEqual('a1b2c3')
    expect(request.valueInputOption).toEqual('RAW')
    expect(request.range).toEqual('aprMonzoTransactions')
    expect(request.resource.range).toEqual('aprMonzoTransactions')
    expect(request.resource.values[0][0]).toEqual('2017-06-03T22:18:16.957Z')
    expect(request.resource.values[0][1]).toEqual(11.5)
    expect(request.resource.values[0][2]).toEqual('GBP')
    expect(request.resource.values[0][3]).toEqual('The New Conservatory')
    expect(request.resource.values[0][4]).toEqual('Drinks Out')
    expect(request.resource.values[0][5]).toEqual('Albion Place, Leeds LS1 6JL')
    expect(request.resource.values[0][6]).toEqual('eating_out')
    expect(request.resource.values[0][7]).toEqual('tx_00009L4sgrHBH7itCSijZp')
  })
})
