import helmet from 'helmet'

export const setSecurityConfig = (app) => {
  app.use(helmet())
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    }
  }))
  app.use(helmet.frameguard({ action: 'deny' }))
  const twoYearsInSeconds = 63072000
  app.use(helmet.hsts({
    maxAge: twoYearsInSeconds,
    includeSubDomains: true,
    preload: true
  }))
  app.use(helmet.noSniff())
  app.use(helmet.xssFilter())
}