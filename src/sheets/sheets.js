import express from 'express'
import google from 'googleapis'
import authenticate from '../authenticate'
import { firebase as firebaseConfig } from '../configurator'

const router = express.Router()
const sheets = google.sheets('v4')

const oauth2Client = new google.auth.OAuth2(
  '270478801405-t30eudrual340fs3tuf44optp4skif5a.apps.googleusercontent.com',
  '327Z7fZ-TtRsgaJTeZexRwpI',
  'http://localhost:9001/sheets/authorised'
)

const getSheets = ({ exporter }) => {
  const spreadsheetId = exporter.spreadsheetId

  oauth2Client.setCredentials(exporter.ramptonTokens)

  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId, auth: oauth2Client }, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

router.get('/', authenticate, (req, res) => {
  firebaseConfig(req.params.uid)
    .then(getSheets)
    .then(result => res.send(result))
    .catch(err => {
      console.log('err', err)
      res.send({ code: 503, err })
    })
})

router.get('/authorised', (req, res) => {
  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) return res.send({ code: 503, err })

    res.send({ tokens })
  })
})

export default router
