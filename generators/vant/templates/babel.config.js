module.exports = {
  presets: [
    [
      '@vue/app',
      {
        targets: {
          esmodules: true
        },
        polyfills: false,
        useBuiltIns: 'entry'
      }
    ]
  ]
  // plugins: [
  //   [
  //     'import',
  //     {
  //       libraryName: 'vant',
  //       libraryDirectory: 'es',
  //       style: (name) => `${name}/style/less`
  //     },
  //     'vant'
  //   ]
  // ]
}
