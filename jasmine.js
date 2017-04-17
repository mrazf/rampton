import Jasmine from 'jasmine'

const jasmine = new Jasmine()

jasmine.loadConfig({
  'spec_files': [
    'src/**/*-test.js'
  ],
  'stopSpecOnExpectationFailure': false,
  'random': false
})

jasmine.execute()
