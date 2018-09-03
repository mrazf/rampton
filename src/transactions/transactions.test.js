import nock from 'nock'
import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'
import database from '../database'
import routes from './transactions'

const app = express()
app.use(bodyParser.json())
app.use(routes)

jest.mock('../firebase')
jest.mock('../database')
jest.mock('../middleware/authenticate-firebase')

const transactionUpdate = {
  transaction: {
    value: 100,
    split: [
      { value: 50 },
      { value: 50 }
    ],
    dateTime: '2017-06-22T12:20:18Z'
  }
}

describe('/transactions', () => {
  beforeEach(() => {
    database.put('users', {
      'uid_abc': {
        categories: {
          'not-set': 'Not Set'
        },
        exporter: {
          spreadsheetId: 'mockSpreadsheetId',
          ramptonTokens: {
            access_token: 'a_c',
            expiry_date: 1494363491428,
            refresh_token: 'r_t',
            token_type: 'Bearer'
          }
        },
        monzoData: {
          accountIds: ['acc_00008gju41AHyfLUzBUk8A'],
          token: { access_token: 'poop' }
        }
      }
    })
  })

  afterEach(() => {
    database.clear()
  })

  describe('POSTs to /:id with a valid transaction', () => {
    const monzoUpdatePayload = 'metadata%5Bsplit%5D%5B0%5D%5Bvalue%5D=50&metadata%5Bsplit%5D%5B1%5D%5Bvalue%5D=50'
    const monzoUpdate = nock('https://api.monzo.com:443')
      .patch('/transactions/tx_id', monzoUpdatePayload)
      .query({ 'expand': 'merchant' })
      .reply(200, {
        transaction: {}
      })

    const monzoTransactions = nock('https://api.monzo.com:443')
      .get('/transactions')
      .query({ 'account_id': 'acc_00008gju41AHyfLUzBUk8A', 'expand': 'merchant', 'since': '2018-06-01T00:00:00Z', 'before': '2018-06-30T23:59:59Z' })
      .reply(200, { transactions: [] })

    const sheetsTokenRequest = nock('https://accounts.google.com:443')
      .post('/o/oauth2/token')
      .query(true)
      .reply(200, {
        'access_token': 'a_c+', 'expires_in': '3600', 'token_type': 'Bearer'
      })

    const sheetsRequest = nock('https://sheets.googleapis.com:443')
      .get('/v4/spreadsheets/mockSpreadsheetId')
      .reply(200, {
        spreadsheetId: 'mockSpreadsheetId',
        namedRanges: [
          {
            name: 'junMonzoTransactions',
            range: { startColumnIndex: 0, startRowIndex: 1, endColumnIndex: 5 }
          }
        ]
      })

    const clearSheetsTokenRequest = nock('https://accounts.google.com:443')
      .post('/o/oauth2/token')
      .query(true)
      .reply(200, {
        'access_token': 'a_c+', 'expires_in': '3600', 'token_type': 'Bearer'
      })

    const clearSheetsRequest = nock('https://sheets.googleapis.com:443')
      .post('/v4/spreadsheets/mockSpreadsheetId/values/Jun!A3:E:clear')
      .reply(200)

    const replaceSheetsTokenRequest = nock('https://accounts.google.com:443')
      .post('/o/oauth2/token')
      .query(true)
      .reply(200, {
        'access_token': 'a_c+', 'expires_in': '3600', 'token_type': 'Bearer'
      })

    const replaceSheetsRequest = nock('https://sheets.googleapis.com:443')
      .post('/v4/spreadsheets/mockSpreadsheetId/values/junMonzoTransactions:append?valueInputOption=RAW')
      .reply(200, {
        values: [], range: 'junMonzoTransactions'
      })

    it('should update the transaction with Monzo', () => {
      return request(app)
        .post('/transactions/tx_id')
        .set('Authorization', 'Bearer: poop')
        .send(transactionUpdate)
        .expect(200, transactionUpdate)
        .then(() => {
          monzoUpdate.done()
          monzoTransactions.done()
          sheetsTokenRequest.done()
          sheetsRequest.done()
          clearSheetsTokenRequest.done()
          clearSheetsRequest.done()
          replaceSheetsTokenRequest.done()
          replaceSheetsRequest.done()
        })
    })
  })
})
