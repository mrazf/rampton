import * as R from 'ramda'

const bestMerchant = transaction => {
  if (!transaction.merchant || !R.isEmpty(transaction.counterparty)) {
    return transaction.description
  }

  if (transaction.merchant.metadata && transaction.merchant.metadata.suggested_name) {
    return transaction.merchant.metadata.suggested_name
  }

  return transaction.merchant.name
}

const bestAddress = transaction => {
  return transaction.merchant ? transaction.merchant.address.short_formatted : ''
}

const transform = transaction => {
  return {
    dateTime: transaction.created,
    currency: transaction.currency,
    amount: (transaction.amount / 100) * -1,
    merchant: bestMerchant(transaction),
    categoryId: R.pathOr('not-set', ['metadata', 'category'], transaction),
    address: bestAddress(transaction),
    monzoCategory: transaction.category,
    id: transaction.id
  }
}

export default transform
