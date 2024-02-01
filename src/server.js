import express from 'express'
import bodyParserMiddleware from './middlewares/bodyParser'
const dotenv = require('dotenv')
import cookieparser from 'cookie-parser'

dotenv.config()

import initAPIRoute from './routes/v1/router'
const app = express()
const hostname = process.env.HOST_NAME || 'localhost'
const port = process.env.PORT || 8080
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(cookieparser())
app.use(bodyParserMiddleware)

// init api routes
initAPIRoute(app)

app.get('/', (req, res) => {
  res.end('<h1>Hello TTV</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${ hostname }:${ port }/`)
})
