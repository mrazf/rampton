import Jasmine from 'jasmine'

const jasmine = new Jasmine()

process.env.FIREBASE_PROJECT_ID = 'a'
process.env.FIREBASE_CLIENT_EMAIL = 'b'
process.env.FIREBASE_PRIVATE_KEY = 'c'

jasmine.loadConfig({
  'spec_files': [
    'src/**/*-test.js',
    'src/**/*.test.js'
  ],
  'stopSpecOnExpectationFailure': false,
  'random': false
})

jasmine.execute()
