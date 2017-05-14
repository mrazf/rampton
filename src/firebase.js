import admin from 'firebase-admin'

admin.database.enableLogging(log => {
  if (log.indexOf('event') === -1) return

  console.info(`FIREBASE DATABASE ${log}`)
})

export default admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }),
  databaseURL: 'https://pennies-9cba3.firebaseio.com/'
})

