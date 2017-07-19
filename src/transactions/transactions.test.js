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
jest.mock('../middleware/firebase')

const transactionUpdate = {
  transaction: {
    value: 100,
    split: [
      { value: 50 },
      { value: 50 }
    ]
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
          accountId: 'acc_00008gju41AHyfLUzBUk8A'
        }
      }
    })
  })

  afterEach(() => {
    database.clear()
  })

  describe('POSTs to /:id with a valid transaction', () => {
    it('should update the transaction with Monzo', () => {
      return request(app)
        .post('/transactions/tx_id')
        .set('Authorization', 'Bearer: token')
        .send(transactionUpdate)
        .expect(200, transactionUpdate)
    })

    it('should update the spreadsheet')
  })
})
