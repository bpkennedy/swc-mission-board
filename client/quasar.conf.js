// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    sourceFiles: {
      store: 'src/store',
    },
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'oauth',
      'i18n',
      'axios',
      'tp',
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QAvatar',
        'QBadge',
        'QBar',
        'QBtn',
        'QCard',
        'QCardSection',
        'QCheckbox',
        'QToggle',
        'QDialog',
        'QFooter',
        'QForm',
        'QHeader',
        'QImg',
        'QInput',
        'QList',
        'QIcon',
        'QInnerLoading',
        'QItem',
        'QItemLabel',
        'QItemSection',
        'QLayout',
        'QPage',
        'QPageContainer',
        'QRouteTab',
        'QSelect',
        'QSpace',
        'QSpinnerPie',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QTabs',
        'QToolbar',
        'QToolbarTitle',
        'QTooltip',
      ],

      directives: [
        'Ripple',
        'ClosePopup',
      ],

      // Quasar plugins
      plugins: [
        'Notify'
      ]
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [
      'slideInRight'
    ],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      // metaVariables: {
      //   appleMobileWebAppCapable: 'yes',
      //   appleMobileWebAppStatusBarStyle: 'black-translucent',
      //   msapplicationTileColor: '#027BE3'
      // },
      manifest: {
        // name: 'SWC Mission Board',
        // short_name: 'SWC Mission Board',
        // description: 'A mission board third party tool for the star wars combine online browser game',
        display: 'fullscreen',
        orientation: 'portrait',
        background_color: '#027BE3',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'swc-mission-board-client'
      }
    }
  }
}
