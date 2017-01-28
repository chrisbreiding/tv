require('zunder').setConfig({
  cacheBust: false,
  devDir: 'build',
  prodDir: 'build',
  staticGlobs: {
    'node_modules/font-awesome/fonts/**': '/fonts',
  },
})
