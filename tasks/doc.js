const { buildApi } = require('docsify-ts-api');
const path = require('path');
const runSeq = require('./utils/runSeq');

module.exports = (gulp, plugins, cb) => {
  const projectRoot = path.join(process.cwd(), 'dist');

  buildApi({
    root: projectRoot,
    apiDir: `${projectRoot}/../docs/api`,
    docsDir: `${projectRoot}/../docs`,
    srcDir: `${projectRoot}/src`,
    libDir: `${projectRoot}/lib`
  })
    .then(() => cb);
};