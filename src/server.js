import express from 'express'

const app = express()

const hostname = 'localhost'
const port = 8080

app.get('/', (req, res) => {
  res.end('<h1>Hello TTV</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${ hostname }:${ port }/`)
})
