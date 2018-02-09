const runSequence = require('run-sequence');

module.exports = (...args) => (cb) => runSequence(...args, cb);