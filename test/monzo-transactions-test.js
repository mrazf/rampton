import request from 'supertest'
import app from '../app'
import stub from './stub'

describe('Monzo transaction endpoint', () => {
  it('POST should echo internal transaction structure', (done) => {
    const expected = { id: 'tx_00008zjky19HyFLAzlUk7t' }

    request(app)
      .post('/monzo-transactions')
      .send(stub)
      .expect(200, expected, done)
  })
})
