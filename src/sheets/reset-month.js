import google from 'googleapis'
import configurator from '../configurator'
import { getTransactions } from '../transactions/transactions'
import { oauth2Client } from './sheets'

const sheets = google.sheets('v4')

const transform = transactions => {
  return new Promise((resolve, reject) => {
    const includedTransactions = transactions.filter(t => t.include_in_spending)
    const transformed = includedTransactions.map(t => {
      return [
        t.created,
        t.amount / 100,
        t.currency,
        t.merchant.metadata.suggested_name,
        t.category,
        '',
        t.merchant.address.short_formatted
      ]
    })

    resolve(transformed)
  })
}

const resetMonth = uid => {
  return new Promise((resolve, reject) => {
    configurator(uid)
      .then(config => getTransactions(config))
      .then(result => transform(result.transactions))
      .then(resolve)
      .catch(err => {
        console.log(err)
      })
  })
}

export default resetMonth
