const
  express = require('express'),
  path = require('path'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.PORT || 5000

const app = express()

app.use(history())
app.use(serveStatic(path.join(__dirname, '..', '/client/dist/pwa')))
app.listen(port)
