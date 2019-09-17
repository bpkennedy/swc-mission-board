// const
//   express = require('express'),
//   path = require('path'),
//   serveStatic = require('serve-static'),
//   history = require('connect-history-api-fallback'),
//   port = process.env.PORT || 5000

// const app = express()

// app.use(history())
// app.use(serveStatic(path.join(__dirname, '..', '/client/dist/pwa')))
// app.listen(port)



import http from 'http'
import path from 'path'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { corsHeaders, bodyLimit, port } from './configuration'
import { initializeDb } from './db'
import { createApiRoutes } from './api'
const app = express()

app.server = http.createServer(app)
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
