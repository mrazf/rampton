import request from 'request'
import transform from './monzo-to-pennies-transaction'
import InvalidTransactionError from './invalid-transaction-error'

const validSplit = transaction => {
  if (!transaction.split) return true

  const totalSplitTransactionsValue = transaction.split.reduce((acc, t) => {
    return acc + t.value
  }, 0)

  const isValid = transaction.value === totalSplitTransactionsValue

  return {
    isValid,
    message: 'Total child transaction value different to parent'
  }
}

const validateUpdate = transaction => {
  const isValidSplit = validSplit(transaction)

  return isValidSplit
}

const updateTransaction = (config, transactionId, transaction) => {
  const validUpdate = validateUpdate(transaction)
  if (!validUpdate.isValid) {
    throw new InvalidTransactionError(validUpdate.message)
  }

  const { monzo } = config
  const url = `https://api.monzo.com/transactions/${transactionId}?expand[]=merchant`
  const headers = { Authorization: `Bearer ${monzo.token.access_token}` }
  const form = {
    metadata: {
      category: transaction.category,
      split: transaction.split
    }
  }

  return new Promise((resolve, reject) => {
    console.info(`PATCH ${url}`)
    request.patch(url, { headers, form }, (err, res, body) => {
      if (err) {
        console.error(`PATCH ${url} errored with ${err} at ${err.stack}`)

        return reject(err)
      }

      const response = JSON.parse(body)
      if (response.error) {
        console.error(response)

        return reject(response)
      }

      resolve({ config, transaction: transform(response.transaction) })
    })
  })
}

export default updateTransaction
