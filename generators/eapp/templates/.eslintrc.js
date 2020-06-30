module.exports = {
  root: true,
  globals: {
    Page:true,
    getApp:true,
    dd:true,
    getCurrentPages:true,
    App:true,
    Component:true
  },
  extends: [
    'standard'
  ],
  rules: {
    'no-var': 'error',
    eqeqeq: 'error',
    'import/no-absolute-path':'off'
  },
}
