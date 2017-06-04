import moment from 'moment'
import { oauth2Client, sheets } from './sheets'

const months = moment.monthsShort()
const monthsLower = months.map(m => m.toLowerCase())

const transactionToValue = (transaction, categories) => {
  return [
    transaction.dateTime,
    transaction.amount,
    transaction.currency,
    transaction.merchant,
    categories[transaction.categoryId] || '',
    transaction.address,
    transaction.monzoCategory,
    transaction.id
  ]
}

export const replaceRequest = (spreadsheetId, transactions, categories, month) => {
  const range = `${monthsLower[month]}MonzoTransactions`
  const values = transactions.map(t => transactionToValue(t, categories))

  return {
    spreadsheetId,
    valueInputOption: 'RAW',
    resource: { values, range },
    range
  }
}

const replace = (token, spreadsheetId, transactions, categories, month) => {
  oauth2Client.setCredentials(token)
  const request = {
    ...replaceRequest(spreadsheetId, transactions, categories, month),
    auth: oauth2Client
  }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(request, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

export default replace
