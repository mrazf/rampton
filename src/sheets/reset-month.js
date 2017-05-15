import ramda from 'ramda'
import configurator from '../configurator'
import { getTransactions } from '../transactions/transactions'
import getSpreadsheet from './get-spreadsheet'
import { oauth2Client, sheets } from './sheets'

const transform = transactions => {
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
  const sheet = ramda.find(s => s.properties.title === 'May', spreadsheet.sheets)
  const sheetId = sheet.properties.sheetId

  console.log('transactions', transactions)

  return new Promise((resolve, reject) => {
    clear(config.exporter.ramptonTokens, spreadsheetId, sheetId)
      .then(() => replace(config.exporter.ramptonTokens, spreadsheetId, transactions))
      .then(resolve)
  })
}

const clear = (token, spreadsheetId, sheetId) => {
  oauth2Client.setCredentials(token)

  const request = { spreadsheetId, range: `May!A4:H`, auth: oauth2Client }

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
