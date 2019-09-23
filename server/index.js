import http from 'http'
import path from 'path'
import favicon from 'serve-favicon'
import express from 'express'
import 'express-async-errors'
import history from 'connect-history-api-fallback'
import { setSecurityConfig } from './lib/helmet'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { corsHeaders, bodyLimit, port } from './configuration'
import { initializeDb } from './db'
import { createApiRoutes } from './api'
const app = express()

app.server = http.createServer(app)
setSecurityConfig(app)
const staticFileMiddleware = express.static(path.join(__dirname, '../client/dist/spa'))

app.use(morgan('dev'))

if (process.env.HEROKU === 'true') {
  const forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
    }
    return next()
  }
  app.use(forceSsl)
}

app.use(cors({ exposedHeaders: corsHeaders }))
app.use(bodyParser.json({ limit : bodyLimit }))

app.use(staticFileMiddleware)
app.use(history())
app.use(staticFileMiddleware)
// ^ `app.use(staticFileMiddleware)` is included twice as per https://github.com/bripkens/connect-history-api-fallback/blob/master/examples/static-files-and-index-rewrite/README.md#configuring-the-middleware

app.use(favicon(path.join(__dirname, '../client/dist/spa/statics/icons/favicon.ico')))

initializeDb(() => {
  app.use('/api/v1', createApiRoutes())

  // 'next' param is absolutely required or else every error will be 500
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(err)
    if (err && err.response && err.response.status === 401) {
      res.status(401).send({ message: 'Unauthorized' })
    } else {
      res.status(400).send(err)
    }
  })
  app.server.listen(process.env.PORT || port, () => {
    console.log(`Started on port ${app.server.address().port}`)
    app.emit('apiStarted', null)
  })
})

export default app
