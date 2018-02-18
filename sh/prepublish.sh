#!/usr/bin/env bash

set -e

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git checkout production
git branch --set-upstream-to=origin/production production