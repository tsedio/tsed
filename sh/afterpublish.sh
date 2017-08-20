#!/usr/bin/env bash

set -e

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo "Generate documentation for v$PACKAGE_VERSION"

npm run doc:build

git status

git add package.json
git add docs

git commit -m "Travis build: $TRAVIS_BUILD_NUMBER  v$PACKAGE_VERSION [ci skip]"

git remote add origin https://${GH_TOKEN}@github.com/Romakita/ts-express-decorators.git > /dev/null 2>&1
git push --quiet --set-upstream origin production
git push -f origin production:refs/heads/master

echo "Done"