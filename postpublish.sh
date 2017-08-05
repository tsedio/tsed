#!/usr/bin/env bash

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo "Add tags v$PACKAGE_VERSION on Github"

git add package.json
git commit -m "$PACKAGE_VERSION"
git tag $PACKAGE_VERSION
git push origin master -f --tags

echo "Done"