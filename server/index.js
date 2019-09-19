import http from 'http'
import path from 'path'
import express from 'express'
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
app.use(morgan('dev'))
app.use(cors({ exposedHeaders: corsHeaders }))
app.use(bodyParser.json({ limit : bodyLimit }))
app.use(express.static(path.join(__dirname, '../client/dist/pwa')))

initializeDb(() => {
  app.use('/api/v1', createApiRoutes())
  app.server.listen(process.env.PORT || port, () => {
    console.log(`Started on port ${app.server.address().port}`)
    app.emit('apiStarted', null)
  })
})

export default app
