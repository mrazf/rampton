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

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

export const database = app.database()

export default app
