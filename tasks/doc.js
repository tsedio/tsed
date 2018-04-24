const { buildApi } = require('docsify-ts-api');
const path = require('path');
const runSeq = require('./utils/runSeq');

module.exports = (gulp, cb) => {
  const projectRoot = path.join(process.cwd(), 'dist');

  buildApi({
    root: projectRoot,
    apiDir: path.resolve(`${projectRoot}/../docs/api`),
    docsDir: path.resolve(`${projectRoot}/../docs`),
    srcDir: path.resolve(`${projectRoot}/../src`),
    libDir: path.resolve(`${projectRoot}/lib`)
  })
    .then(() => cb);
};