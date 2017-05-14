import google from 'googleapis'
import configurator from '../configurator'
import { getTransactions } from '../transactions/transactions'
import { oauth2Client } from './sheets'

const sheets = google.sheets('v4')

const transform = ({ config, transactions }) => {
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

    resolve({ config, transactions: transformed })
  })
}

const clear = ({ config, transactions }) => {
  console.log(config.exporter)
  const request = {
    spreadsheetId: '',
    range: ''
  }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.clear(request, (err, response) => {
      if (err) reject(err)
    })
  })
}

const resetMonth = uid => {
  return new Promise((resolve, reject) => {
    configurator(uid)
      .then(getTransactions)
      .then(transform)
      .then(clear)
      .then(resolve)
      .catch(err => {
        console.log(err)
      })
  })
}

export default resetMonth
