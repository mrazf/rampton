import request from 'supertest'
import nock from 'nock'
import { database } from '../firebase'
import app from '../app'
import transactionCreated from './monzo-webhooks.test.stub'

jest.mock('../firebase')

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
          accountId: 'acc_00008gju41AHyfLUzBUk8A'
        }
      }
    })
  })

  afterEach(() => {
    database.clear()
  })

  it('200s, echoes the transaction and writes the transformed transaction to Google Sheets', () => {
    const tokenRequest = nock('https://accounts.google.com:443')
      .post('/o/oauth2/token')
      .query(true)
      .reply(200, {
        'access_token': 'a_c+', 'expires_in': '3600', 'token_type': 'Bearer'
      })

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
      .expect(200, transactionCreated)
      .then(() => {
        tokenRequest.done()
        sheetsRequest.done()
      })
  })
})
