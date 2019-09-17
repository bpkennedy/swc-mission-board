# SWC Mission Board Client (swc-mission-board-client)

## Install the dependencies
*should have been installed at the root of the project with `postinstall` step*

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
npm run dev
```

### Lint the files
```bash
npm run lint
npm run lint:fix // this tries to fix the lint issues automatically
```

### Run Cypress UAT tests
```bash
npm run test:e2e
npm run test:e2e:CI // this runs tests silently
```

### Build the app for production
This should be handled by the CI along with deployment to the hosting provider, but if you want/need to test it here:
```bash
npm run build:pwa // builds progressive web app
npm run build:spa // builds single page app
npm run build:electron // builds electron app
npm run build // builds all at once!
```

### Serve the client without api
If you need to troubleshoot or develop without the api server running locally, then you can use the Quasar framework's built in development server to serve the client app without the api running:
```bash
npm run serve // serve single page application
npm run serve:pwa // serve progressive web app
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
