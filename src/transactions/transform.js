import * as R from 'ramda'

const bestMerchant = transaction => {
  if (!R.isEmpty(transaction.counterparty)) {
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

const transform = transactions => {
  const includedTransactions = transactions.filter(t => t.include_in_spending)

  return includedTransactions.map(t => {
    return {
      dateTime: t.created,
      amount: (t.amount / 100) * -1,
      merchant: bestMerchant(t),
      category: '',
      address: bestAddress(t),
      monzoCategory: t.category,
      id: t.id
    }
  })
}

export default transform
