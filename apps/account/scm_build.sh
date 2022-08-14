#!/bin/bash

set -e

npm install -g pnpm@6.32.8
pnpm i

pnpm --filter 'account' run deploy
