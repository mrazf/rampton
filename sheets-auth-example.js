import google from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  '270478801405-t30eudrual340fs3tuf44optp4skif5a.apps.googleusercontent.com',
  '327Z7fZ-TtRsgaJTeZexRwpI',
  'http://localhost:9001/sheets/authorised'
)

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scope = 'https://www.googleapis.com/auth/spreadsheets'

const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope })

console.log(url)
