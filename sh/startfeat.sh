#!/usr/bin/env bash

set -e

git fetch --all --prune --tags
git checkout --no-track -b $1 origin/production
echo 'NEW FEATURE ' $1 ' CREATION DONE from MASTER HEAD'