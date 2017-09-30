import { keys } from 'ramda'
import database from '../database'

export const userFromAccountId = (accountId, users) => {
  const userIdsByAccountIds = keys(users).reduce((acc, userId) => {
    const accounts = users[userId].monzoData.accountIds
    const userIdByAccounts = accounts.reduce((acc, account) => {
      return { ...acc, [account]: userId }
    }, {})

    return {
      ...acc,
      ...userIdByAccounts
    }
  }, {})

  const uid = userIdsByAccountIds[accountId]

  return {uid, ...users[uid]}
}

export default accountId => {
  return new Promise((resolve, reject) => {
    database.get('users')
      .then(users => {
        resolve(userFromAccountId(accountId, users))
      })
      .catch(reject)
  })
}
