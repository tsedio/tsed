export NODE_ENV=production
export NODE_OPTIONS=--openssl-legacy-provider
cp .vuepress/scripts/updateBuildScript.js node_modules/@vuepress/core/lib/node/build/index.js
cp .vuepress/scripts/addWorkerScript.js node_modules/@vuepress/core/lib/node/build/worker.js
vuepress build
