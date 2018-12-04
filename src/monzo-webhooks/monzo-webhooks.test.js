import express from 'express'
import request from 'supertest'
import bodyParser from 'body-parser'
import nock from 'nock'
import database from '../database'
import routes from './monzo-webhooks'
import transactionCreated from './monzo-webhooks.test.stub'

const app = express()
app.use(bodyParser.json())
app.use(routes)

jest.mock('../firebase')
jest.mock('../database')

describe('Monzo webhooks', () => {
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
          accountIds: ['acc_00008gju41AHyfLUzBUk8A']
        }
      }
    })
  })

  afterEach(() => {
    database.clear()
  })

  describe('successfull transaction processing', () => {
    let tokenRequest

    beforeEach(() => {
      tokenRequest = nock('https://accounts.google.com:443')
        .post('/o/oauth2/token')
        .query(true)
        .reply(200, {
          'access_token': 'a_c+', 'expires_in': '3600', 'token_type': 'Bearer'
        })
    })

    xit('200s, echoes the transaction and writes the transformed transaction to Google Sheets', () => {
      const sheetsRequest = nock('https://sheets.googleapis.com:443')
        .post('/v4/spreadsheets/mockSpreadsheetId/values/sepMonzoTransactions:append', {
          'values': [
            ['2015-09-04T14:28:40Z', 3.5, 'GBP', 'Ozone Coffee Roasters', 'Not Set', null, 'eating_out', 'tx_00008zjky19HyFLAzlUk7t']
          ],
          'range': 'sepMonzoTransactions'
        })
        .query({'valueInputOption': 'RAW'})
        .reply({})

      return request(app)
        .post('/monzo-webhook')
        .send(transactionCreated)
        .expect(201, transactionCreated)
        .then(() => {
          tokenRequest.done()
          sheetsRequest.done()
        })
    })

    it('second transaction with same ID is ignored', () => {
      const sheetsRequest = nock('https://sheets.googleapis.com:443')
      .post('/v4/spreadsheets/mockSpreadsheetId/values/sepMonzoTransactions:append', {
        'values': [
          ['2015-09-04T14:28:40Z', 3.5, 'GBP', 'Ozone Coffee Roasters', 'Not Set', null, 'eating_out', 'poopy']
        ],
        'range': 'sepMonzoTransactions'
      })
      .query({'valueInputOption': 'RAW'})
      .reply({})

      const secondTransaction = {
        ...transactionCreated,
        data: {
          ...transactionCreated.data,
          id: 'poopy'
        }
      }

      return request(app)
        .post('/monzo-webhook')
        .send(secondTransaction)
        .expect(201, secondTransaction)
        .then(() => {
          tokenRequest.done()
          sheetsRequest.done()

          return request(app)
            .post('/monzo-webhook')
            .send(secondTransaction)
            .expect(200, { meta: 'ignored' })
        })
    })
  })

  xit('200s and returns an description why transaction wasnt processed', () => {
    const rejectedTransaction = {
      data: {
        include_in_spending: false,
        decline_reason: 'INVALID_CVC'
      }
    }

    return request(app)
      .post('/monzo-webhook')
      .send(rejectedTransaction)
      .expect(200, {
        declineReason: 'INVALID_CVC'
      })
  })
})
