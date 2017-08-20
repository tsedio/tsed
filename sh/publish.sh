#!/usr/bin/env bash

set -e

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo "Generate documentation for v$PACKAGE_VERSION"

npm run doc:build

git add -A .

git status

git commit -m "Travis build: $TRAVIS_BUILD_NUMBER  v$PACKAGE_VERSION [ci skip]"

git remote add origin-travis https://${GH_TOKEN}@github.com/Romakita/ts-express-decorators.git

echo "Push to origin";
git push --quiet --set-upstream origin-travis production

echo "Sync master branch"
git push -f origin-travis production:refs/heads/master

echo "Publish module"

npm publish && semantic-release post

echo "Done"