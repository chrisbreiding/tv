require('zunder').setConfig({
  cacheBust: false,
  devDir: 'app-dist',
  prodDir: 'app-dist',
  staticGlobs: {
    'node_modules/font-awesome/fonts/**': '/fonts',
  },
})
