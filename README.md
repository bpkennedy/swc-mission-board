# SWC Mission Board (swc-mission-board)
A mission board third party tool for the star wars combine online browser game

## Install the dependencies
```bash
npm install
```

### Start the node server
```bash
npm start
```

### How to deploy
[Buddy CI](https://app.buddy.works/bpkennedy/swc-mission-board/pipelines) is used for Continuous Integration. On each commit to Master branch, CI will:

1. Get latest Master from github
2. Perform install step: ```npm install -g @quasar/cli
npm install```
3. Run Cypress tests step: ```npm install -g @quasar/cli
npm install
./node_modules/.bin/cypress install
quasar dev &
npm run test:e2e:CI ```
4. Deploy to Heroku.
5. Send a build status notification to the [Discord channel](https://discord.gg/CaRKZtH)

*See `client` and `server` directories, respectively, for relative docs on each*
