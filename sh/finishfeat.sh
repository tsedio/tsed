#!/usr/bin/env bash

shopt -s nocasematch
set -e
set -o pipefail

FEATURE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
MASTER_BRANCH="master"
PRODUCTION_BRANCH="production"

git fetch --all --prune --tags

if [[ ${FEATURE_BRANCH} == ${PRODUCTION_BRANCH} ]]; then
    echo "Start manual publish with np"
    np --any-branch
    exit 0
fi

if [[ ${FEATURE_BRANCH} != ${MASTER_BRANCH} ]]; then
    echo "Start publishing branch feature"
    git rebase origin/production

    echo "Try to delete production"
    git branch -D production || echo "Local production not found"

    echo "Checkout production"
    git checkout -b production origin/production
    git merge --no-ff -m "$(echo $FEATURE_BRANCH)" ${FEATURE_BRANCH}

    git push origin production
    git push origin :${FEATURE_BRANCH}
    git branch -d ${FEATURE_BRANCH}
    echo ${FEATURE_BRANCH} ' FINISH DONE'

    exit 0
fi

if [[ ${FEATURE_BRANCH} == ${MASTER_BRANCH} ]]; then
    echo "Start publishing master branch (group features)"
    git rebase origin/production

    echo "Try to delete production"
    git branch -D production || echo "Local production not found"

    echo "Checkout production"
    git checkout -b production origin/production
    git merge --no-ff -m "Merge master" master
    git push origin production
    echo ${FEATURE_BRANCH} ' FINISH DONE'
    exit 0
fi

echo 'PUBLISH DONE'