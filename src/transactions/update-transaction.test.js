import updateTransaction from './update-transaction'
import InvalidTransactionError from './invalid-transaction-error'

describe('Update Transaction', () => {
  const transactionId = 'tx_id'
  const config = {
    monzo: { token: { access_token: 'access_token' } }
  }

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
