#!/usr/bin/env bash

set -e

git fetch --all --prune --tags
git rebase origin/production