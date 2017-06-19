import admin from 'firebase-admin'

const eventPrefix = 'event: '
const valuePrefix = ':value:'

admin.database.enableLogging(logString => {
  const eventStart = logString.indexOf(eventPrefix)

  if (eventStart === -1) return

  const eventPrefixEnd = eventStart + eventPrefix.length
  const eventEnd = logString.indexOf(valuePrefix)

  const log = logString.substring(eventPrefixEnd, eventEnd)

  console.info(`FIREBASE DATABASE event: ${log}`)
})

const database = admin.database()

export default {
  get: path => {
    const ref = database.ref(path)

    return new Promise((resolve, reject) => {
      ref.once('value', snapshot => resolve(snapshot.val()), err => {
        reject(err)
      })
    })
  }
}
