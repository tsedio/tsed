#!/usr/bin/env bash

set -e

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
echo "Publish v$PACKAGE_VERSION"

npm run doc:build
npm publish

git add package.json
git add docs
git commit -m "$PACKAGE_VERSION"
git push origin master -f

echo "Done"