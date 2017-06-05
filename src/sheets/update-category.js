import moment from 'moment'
import { oauth2Client, sheets } from './sheets'

const months = moment.monthsShort()

export const updateCategoryRequest = (spreadsheetId, { transaction, metadata }, categories) => {
  const monthIndex = moment(transaction.dateTime).month()

  const range = `${months[monthIndex]}!E${metadata.rowIndex + 2}`
  const category = categories[transaction.categoryId]

  return {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    resource: {
      range,
      values: [
        [ category ]
      ]
    }
  }
}

const updateCategory = (config, updateRequest, categories) => {
  const { spreadsheetId, ramptonTokens } = config.exporter

  oauth2Client.setCredentials(ramptonTokens)
  const request = {
    ...updateCategoryRequest(spreadsheetId, updateRequest, config.categories),
    auth: oauth2Client
  }

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.update(request, (err, response) => {
      if (err) reject(err)

      resolve(updateRequest.transaction)
    })
  })
}

export default updateCategory
