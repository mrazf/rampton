const monzoClientId = process.env.MONZO_CLIENT_ID
const monzoClientSecret = process.env.MONZO_CLIENT_SECRET

import { User } from './databases'

export default uid => {
  return new Promise((resolve, reject) => {
    User.findById(uid)
      .then(instance => {
        resolve({
          user: instance,
          uid,
          monzo: {
            clientId: monzoClientId,
            clientSecret: monzoClientSecret,
            accountId: instance.dataValues.account_id,
            token: { ...instance.dataValues.monzo_token }
          }
        })
      })
      .catch(reject)
  })
}
