import express from 'express'
import google from 'googleapis'
import firebase from '../firebase'
import authenticate from '../authenticate'
import configurator from '../configurator'

const router = express.Router()
const sheets = google.sheets('v4')
const db = firebase.database()

const getSheets = spreadsheetId => {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.get({ spreadsheetId }, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

const sheetId = ({ uid }) => {
  const sheetIdRef = db.ref(`users/${uid}/exporter/spreadsheetId`)

  return new Promise((resolve, reject) => {
    sheetIdRef.once('value', sheetId => {
      resolve(sheetId.val())
    })
  })
}

router.get('/', authenticate, (req, res) => {
  configurator(req.params.uid)
    .then(sheetId)
    .then(getSheets)
    .then(result => res.send(result))
    .catch(err => {
      console.log('err', err)
      res.send({ code: 503, err })
    })
})

export default router
