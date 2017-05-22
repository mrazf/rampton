import * as R from 'ramda'
import configurator from '../configurator'
import { getTransactions } from '../transactions/transactions'
import getSpreadsheet from './get-spreadsheet'
import { gridRange } from './a-one-converter'
import { oauth2Client, sheets } from './sheets'

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
  const transformed = includedTransactions.map(t => {
    return [
      t.created,
      (t.amount / 100) * -1,
      t.currency,
      bestMerchant(t),
      '',
      bestAddress(t),
      t.category,
      t.id
    ]
  })

  return transformed
}

const transactionsAndSpreadsheet = config => {
  return new Promise((resolve, reject) => {
    return Promise.all([ getTransactions(config), getSpreadsheet(config) ])
      .then(([ { transactions }, spreadsheet ]) => {
        resolve({
          config,
          transactions: transform(transactions),
          spreadsheet
        })
      })
      .catch(reject)
  })
}

const clearAndReplace = ({ config, transactions, spreadsheet }) => {
  const spreadsheetId = config.exporter.spreadsheetId
  const sheet = R.find(s => s.properties.title === 'May', spreadsheet.sheets)
  const sheetId = sheet.properties.sheetId

  return new Promise((resolve, reject) => {
    clear(config.exporter.ramptonTokens, spreadsheet, sheetId)
      .then(() => replace(config.exporter.ramptonTokens, spreadsheetId, transactions))
      .then(resolve)
  })
}

const clear = (token, spreadsheet, sheetId) => {
  oauth2Client.setCredentials(token)

  const { range } = R.find(n => n.name === 'mayMonzoTransactions', spreadsheet.namedRanges)
  const clearRange = {
    startColumnIndex: range.startColumnIndex,
    startRowIndex: range.startRowIndex + 1,
    endColumnIndex: range.endColumnIndex
  }

  const spreadsheetId = spreadsheet.spreadsheetId
  const request = { spreadsheetId, range: `May!${gridRange(clearRange)}`, auth: oauth2Client }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.clear(request, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

const replace = (token, spreadsheetId, values) => {
  oauth2Client.setCredentials(token)

  const request = {
    spreadsheetId,
    valueInputOption: 'USER_ENTERED',
    includeValuesInResponse: true,
    range: 'mayMonzoTransactions',
    auth: oauth2Client,
    resource: { values, range: 'mayMonzoTransactions' }
  }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(request, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

const resetMonth = uid => {
  return new Promise((resolve, reject) => {
    configurator(uid)
      .then(transactionsAndSpreadsheet)
      .then(clearAndReplace)
      .then(resolve)
      .catch(reject)
  })
}

export default resetMonth
