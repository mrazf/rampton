import nock from 'nock'
import updateTransaction from './update-transaction'
import InvalidTransactionError from './invalid-transaction-error'

describe('Update Transaction', () => {
  const transactionId = 'tx_id'
  const config = {
    monzo: { token: { access_token: 'access_token' } }
  }

  it('200s and PATCHs the transaction if the update is valid', () => {
    expect.assertions(2)

    const validTransactionUpdate = {
      categoryId: 'new-category-id'
    }

    const monzoPatchPayload = 'metadata%5Bcategory%5D=new-category-id'
    const monzoPatch = nock('https://api.monzo.com:443', { 'encodedQueryParams': true })
      .patch('/transactions/tx_id', monzoPatchPayload)
      .query({ 'expand': 'merchant' })
      .reply(200, {
        transaction: {
          id: 'tx_id'
        }
      })

    return updateTransaction(config, transactionId, validTransactionUpdate)
      .then(response => {
        expect(response.transaction.id).toEqual('tx_id')
        expect(monzoPatch.isDone()).toEqual(true)
      })
  })

  it('errors if the split transaction is not valid', () => {
    const invalidTransactionUpdate = {
      amount: -100,
      split: [
        { amount: -50, category: 'pop' },
        { amount: -51, category: 'pop' }
      ]
    }

    expect(() => {
      updateTransaction(config, transactionId, invalidTransactionUpdate)
    }).toThrowError(new InvalidTransactionError('Total child transaction value different to parent'))
  })
})
