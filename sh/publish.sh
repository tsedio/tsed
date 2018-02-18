#!/usr/bin/env bash

set -e

echo " ██████╗ ███████╗██╗      ██████╗ ██╗    ██╗    ██████╗ ██╗   ██╗██████╗ ██╗     ██╗███████╗██╗  ██╗"
echo "██╔════╝ ██╔════╝██║     ██╔═══██╗██║    ██║    ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝██║  ██║"
echo "██║  ███╗█████╗  ██║     ██║   ██║██║ █╗ ██║    ██████╔╝██║   ██║██████╔╝██║     ██║███████╗███████║"
echo "██║   ██║██╔══╝  ██║     ██║   ██║██║███╗██║    ██╔═══╝ ██║   ██║██╔══██╗██║     ██║╚════██║██╔══██║"
echo "╚██████╔╝██║     ███████╗╚██████╔╝╚███╔███╔╝    ██║     ╚██████╔╝██████╔╝███████╗██║███████║██║  ██║"
echo " ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝     ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝╚══════╝╚═╝  ╚═╝"


git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git checkout production
git branch --set-upstream-to=origin/production production

# GENERATE RELEASE VERSION
semantic-release pre

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
REPOSITORY=$(node -p -e "require('./package.json').repository.url.replace('https://', '')")
RELEASE_BRANCH=$(node -p -e "require('./package.json').gflow.production")
MASTER_BRANCH=$(node -p -e "require('./package.json').gflow.master")

# Rewrite package.json with the right indentation
node -p -e "require('fs').writeFileSync('./package.json', JSON.stringify(require('./package.json'), null, 2), {})"

echo "Generate documentation for v$PACKAGE_VERSION"
echo "REPOSITORY:      $REPOSITORY"
echo "RELEASE_BRANCH:  $RELEASE_BRANCH"
echo "MASTER_BRANCH:   $MASTER_BRANCH"
echo "TRAVIS BUILD:    $TRAVIS_BUILD_NUMBER"

npm whoami

npm run build:release

git add -A .
git reset -- .npmrc
git status

git commit -m "Travis build: $TRAVIS_BUILD_NUMBER  v$PACKAGE_VERSION [ci skip]"

git remote add origin-travis https://${GH_TOKEN}@${REPOSITORY}

echo "Push to origin";
git push --quiet --set-upstream origin-travis ${RELEASE_BRANCH}

echo "Sync master branch"
git push -f origin-travis ${RELEASE_BRANCH}:refs/heads/${MASTER_BRANCH}

echo "Publish module"

npm run publish:release

# COMMIT RELEASE
semantic-release post

echo "Done"