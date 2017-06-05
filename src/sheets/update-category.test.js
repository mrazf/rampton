import { updateCategoryRequest } from './update-category'

const spreadsheetId = 'id_123'
const transaction = {
  'dateTime': '2017-06-03T22:18:16.957Z',
  'currency': 'GBP',
  'amount': 11.5,
  'merchant': 'The New Conservatory',
  'categoryId': 'tennis',
  'address': 'Albion Place, Leeds LS1 6JL',
  'monzoCategory': 'eating_out',
  'id': 'tx_00009L4sgrHBH7itCSijZp'
}

const metadata = { rowIndex: 1 }
const categories = { 'tennis': 'Tennis' }

describe('Sheet update', () => {
  it('finds the correct column and row', () => {
    const request = updateCategoryRequest(spreadsheetId, { transaction, metadata }, categories)

    expect(request.spreadsheetId).toEqual('id_123')
    expect(request.range).toEqual('Jun!E3')
    expect(request.valueInputOption).toEqual('RAW')
    expect(request.resource.range).toEqual('Jun!E3')
    expect(request.resource.values).toEqual([[ 'Tennis' ]])
  })
})
