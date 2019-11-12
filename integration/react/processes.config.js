'use strict'

const path = require('path')
const defaultLogFile = path.join(__dirname, '/logs/project-server.log')

// eslint-disable-next-line node/exports-style
module.exports = {
  'apps': [
    {
      'script': 'packages/server/dist/index.js',
      'instances': 1,
      'exec_mode': 'cluster',
      'out_file': defaultLogFile,
      'error_file': defaultLogFile,
      'merge_logs': true,
      'kill_timeout': 30000
    }
  ]
}
