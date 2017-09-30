import { userFromAccountId } from './user-from-account-id'

jest.mock('../database')

const stubUsers = {
  a: { monzoData: { accountIds: ['accountIdA', 'accountIdAcurrent'] } },
  b: { monzoData: { accountIds: ['accountIdB', 'accountIdBcurrent'] } }
}

describe('User from account id', () => {
  it('returns the correct user object from accountId and users', () => {
    const user = userFromAccountId('accountIdBcurrent', stubUsers)

    expect(user.uid).toEqual('b')
    expect(user.monzoData.accountIds).toEqual(['accountIdB', 'accountIdBcurrent'])
  })
})
