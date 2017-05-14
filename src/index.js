import {} from 'dotenv/config'
import './firebase'
import app from './app'

app.set('port', (process.env.PORT || 9001))
app.listen(app.get('port'), () => console.log('Rampton is running on port', app.get('port')))

export default app
