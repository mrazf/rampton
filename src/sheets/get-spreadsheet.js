import { oauth2Client, sheets } from './sheets'

const getSpreadsheet = ({ exporter }) => {
  const spreadsheetId = exporter.spreadsheetId

  oauth2Client.setCredentials(exporter.ramptonTokens)

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId, auth: oauth2Client }, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

export default getSpreadsheet
