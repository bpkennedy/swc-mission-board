import helmet from 'helmet'

export const setSecurityConfig = (app) => {
  app.use(helmet())
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: [
        "'self'",
        "https://storage.googleapis.com"
      ],
      connectSrc: ["'self'"],
      objectSrc: ["'self'"],
      imgSrc: ["'self'"],
      styleSrc: ["'self'"],
      fontSrc: ["'self'"],
      prefetchSrc: ["'self'"],
      manifestSrc: ["'self'"],
      workerSrc: ["'self'"],
      mediaSrc: ["'self"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
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
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
}