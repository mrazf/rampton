import { userFromAccountId } from './user-from-account-id'

jest.mock('../firebase')

const stubUsers = {
  a: { monzoData: { accountId: 'accountIdA' } },
  b: { monzoData: { accountId: 'accountIdB' } }
}

describe('User from account id', () => {
  it('returns the correct user object from accountId and users', () => {
    const user = userFromAccountId('accountIdB', stubUsers)

    expect(user.uid).toEqual('b')
    expect(user.monzoData.accountId).toEqual('accountIdB')
  })
})
