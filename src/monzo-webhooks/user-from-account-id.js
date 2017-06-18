import { keys, find, pathEq } from 'ramda'
import { database } from '../firebase'

export const userFromAccountId = (accountId, users) => {
  const insideIn = keys(users).map(uid => ({ ...users[uid], uid }))

  return find(pathEq(['monzoData', 'accountId'], accountId))(insideIn)
}

export default accountId => {
  return new Promise((resolve, reject) => {
    const users = database.get('users')

    resolve(userFromAccountId(accountId, users))
  })
}
