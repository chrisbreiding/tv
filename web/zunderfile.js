const zunder = require('zunder')

zunder.setConfig({
  stylesheets: {
    'src/main.styl': {
      watch: ['src/**/*.styl'],
      output: 'app.css',
    },
  },
})
