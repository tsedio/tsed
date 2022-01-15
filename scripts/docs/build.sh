rm -rf ./docs/api
cd ./docs && yarn vuepress:build && cd ..
cd ./docs-references && yarn vuepress:build && cd ..
