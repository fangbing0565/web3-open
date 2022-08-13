#!/usr/bin/env bash

CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

COMMAND=$1
SUBMOD=$2
FERRY="./node_modules/.bin/ferry"

active_submodule=$(find apps -type f -name '.ferryrc.js' | sed -E 's|/[^/]+$||' | sort -u)

generateCode() {
  FERRY client \
    --cwd $1 \
    --config $1/.ferryrc.js \
    --int64 'number' \
    -o src/api \
    -r idl './**/+(?)api*.proto'
}

generateCodeWithPath() {
  FERRY client \
    --cwd $1 \
    --config $1/.ferryrc.js \
    --int64 'number' \
    -o api \
    -r idl './**/+(?)api*.proto'
}

fetch() {
  if [[ -z $1 ]]; then
    echo "⌛️ fetch IDLs for all apps"
    for submodule in $active_submodule; do
      echo "fetching ${CYAN}$submodule${NC}"
      FERRY fetch --cwd $submodule
    done
  else
    if [[ $1 =~ "/" ]]; then
      echo "⌛️ generate codes for ${CYAN}$1${NC}"
      FERRY fetch --cwd $1
    else
      echo "⌛️ fetch IDLs for ${CYAN}$1${NC}"
      FERRY fetch --cwd apps/$1
    fi
  fi
}

gen() {
  if [[ -z $1 ]]; then
    echo "⌛️ generate codes for all apps"
    for submodule in $active_submodule; do
      echo "generating ${CYAN}$submodule${NC}"
      generateCode $submodule
    done
  else
    if [[ $1 =~ "/" ]]; then
      echo "⌛️ generate codes for ${CYAN}$1${NC}"
      generateCodeWithPath $1
    else
      echo "⌛️ generate codes for ${CYAN}$1${NC}"
      generateCode apps/$1
    fi
  fi
}

echo "Ferry: ${CYAN}${COMMAND}${NC}"

if [[ ${COMMAND} == fetch ]]; then  # Stage: fetch
  fetch ${SUBMOD}
elif [[ ${COMMAND} == gen ]]; then  # Stage: api-generate
  gen ${SUBMOD}
elif [[ ${COMMAND} == go ]]; then
  fetch ${SUBMOD} && gen ${SUBMOD}
fi
