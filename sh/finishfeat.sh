#!/usr/bin/env bash

shopt -s nocasematch
set -e
set -o pipefail

FEATURE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
MASTER_BRANCH="master"
PRODUCTION_BRANCH="production"

git fetch --all --prune --tags

if [[ ${FEATURE_BRANCH} == ${PRODUCTION_BRANCH} ]]; then
  exit 0
fi

if [[ ${FEATURE_BRANCH} != ${MASTER_BRANCH} ]]; then

   echo "Publish local feature"
   git rebase origin/master

fi

git checkout master
git reset --hard origin/master

if [[ ${FEATURE_BRANCH} != ${MASTER_BRANCH} ]]; then

    git merge --no-ff -m "$(echo $FEATURE_BRANCH)" ${FEATURE_BRANCH}

fi

echo "Try to delete production"

git branch -D production || echo "Local production not found"

echo "Checkout production"

git checkout -b production origin/production

echo "Reset HEAD of production"

git reset --hard origin/master

echo "Push origin production"

git push origin production -f

if [[ ${FEATURE_BRANCH} != ${MASTER_BRANCH} ]]; then
    git push origin :${FEATURE_BRANCH}
    git branch -d ${FEATURE_BRANCH}
    echo ${FEATURE_BRANCH} ' FINISH DONE'
fi

git checkout master

echo 'PUBLISH DONE'