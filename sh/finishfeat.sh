#!/usr/bin/env bash

set -e

FEATURE_BRANCH=$(git rev-parse --abbrev-ref HEAD)

git fetch --all --prune --tags

if [[${FEATURE_BRANCH} !=  "master"]]; then

   echo "Publish local feature"
   git rebase origin/master

fi

git checkout master
git reset --hard origin/master

if [[${FEATURE_BRANCH} !=  "master"]]; then

    git merge --no-ff -m "$(echo $FEATURE_BRANCH)" ${FEATURE_BRANCH}

fi

git branch -D production | echo 'existing locale branch production deleted'
git checkout -b production origin/production
git rebase origin/master
git push origin production

if [[${FEATURE_BRANCH} !=  "master"]]; then
    git push origin :${FEATURE_BRANCH}
    git branch -d ${FEATURE_BRANCH}
    echo ${FEATURE_BRANCH} ' FINISH DONE'
fi
echo 'PUBLISH DONE'