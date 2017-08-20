#!/usr/bin/env bash

set -e

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

echo "Generate documentation for v$PACKAGE_VERSION"
npm run doc:build
git add package.json
git add docs
git commit -m "docs: v$PACKAGE_VERSION"

git branch -D master || echo "Local master not found"
git checkout -b master origin/master || echo "Ignored"

echo "Rebase from production branch"
git rebase production || echo "Ignored"
git push origin master -f

echo "Done"