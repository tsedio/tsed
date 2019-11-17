const proxy = require('http-proxy-middleware')

module.exports = (app) => {
  app.use('/rest', proxy('/rest', {
    target: 'http://localhost:8081'
  }))
}
