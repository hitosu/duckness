module.exports = api => {
  api.cache(true)

  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: '> 1%, since 2015, IE 11, not OperaMini all',
            node: 'current'
          }
        }
      ],
      [
        'minify',
        {
          // removeConsole: true,
          // removeDebugger: true
        }
      ]
    ].filter(Boolean),
    comments: false,
    ignore: ['node_modules']
  }
}
