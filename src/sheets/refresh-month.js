import { getTransactions } from '../transactions/transactions'
import convert from '../transactions/month-index-to-range'
import configurator from '../configurator'
import getSpreadsheet from './get-spreadsheet'
import clear from './clear'
import replace from './replace'

const transactionsAndSpreadsheet = (config, monthNumber) => {
  const { from, to } = convert(monthNumber)

  return new Promise((resolve, reject) => {
    return Promise.all([ getTransactions(config, from, to), getSpreadsheet(config) ])
      .then(([ { transactions }, spreadsheet ]) => {
        resolve({
          config,
          transactions,
          spreadsheet
        })
      })
      .catch(reject)
  })
}

const clearAndReplace = ({ config, transactions, spreadsheet }, month) => {
  const { spreadsheetId, ramptonTokens } = config.exporter
  const { categories } = config

  return new Promise((resolve, reject) => {
    clear(config.exporter.ramptonTokens, spreadsheet, month)
      .then(() => replace(ramptonTokens, spreadsheetId, transactions, categories, month))
      .then(resolve)
      .catch(reject)
  })
}

const refreshMonth = (uid, { month }) => {
  return new Promise((resolve, reject) => {
    configurator(uid)
    .then(config => transactionsAndSpreadsheet(config, month))
    .then(results => clearAndReplace(results, month))
    .then(resolve)
    .catch(reject)
  })
}

export default refreshMonth
