import * as R from 'ramda'
import moment from 'moment'
import { gridRange } from './a-one-converter'
import { oauth2Client, sheets } from './sheets'

const months = moment.monthsShort()
const monthsLower = months.map(m => m.toLowerCase())

export const clearRequest = (spreadsheet, month) => {
  const spreadsheetId = spreadsheet.spreadsheetId
  const namedRange = `${monthsLower[month]}MonzoTransactions`
  const { range } = R.find(n => n.name === namedRange, spreadsheet.namedRanges)
  const clearRange = {
    startColumnIndex: range.startColumnIndex,
    startRowIndex: range.startRowIndex + 1,
    endColumnIndex: range.endColumnIndex
  }

  return { spreadsheetId, range: `${months[month]}!${gridRange(clearRange)}` }
}

const clear = (token, spreadsheet, month) => {
  oauth2Client.setCredentials(token)
  const request = { ...clearRequest(spreadsheet, month), auth: oauth2Client }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.clear(request, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

export default clear
