import { keys, find, pathEq } from 'ramda'
import database from '../database'

export const userFromAccountId = (accountId, users) => {
  const insideIn = keys(users).map(uid => ({ ...users[uid], uid }))

  return find(pathEq(['monzoData', 'accountId'], accountId))(insideIn)
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
