#!/usr/bin/env bash
# Generates documentation for the @voxel51/api-js package.
#
# Usage:
#   bash docs/generate_docs.bash
#
# Copyright 2017-2019, Voxel51, Inc.
# voxel51.com
#

BUILD_DIR=docs/build

# Show usage information
usage() {
    echo "Usage:  bash $0 [-h] [-c]

Getting help:
-h      Display this help message.

Build options:
-c      Perform a clean build by first deleting any existing build directory.
"
}

# Parse flags
SHOW_HELP=false
CLEAN_BUILD=false
while getopts "hc" FLAG; do
    case "${FLAG}" in
        h) SHOW_HELP=true ;;
        c) CLEAN_BUILD=true ;;
        *) usage ;;
    esac
done
[ ${SHOW_HELP} = true ] && usage && exit 0

if [ ${CLEAN_BUILD} = true ]; then
    echo "**** Deleting existing build directory, if necessary"
    rm -rf ${BUILD_DIR}
fi

echo "**** Generating documentation"
node_modules/.bin/jsdoc -c docs/jsdoc.json -d ${BUILD_DIR}

echo "**** Documentation complete"
printf "To view the docs, run:\n\nopen ${BUILD_DIR}/index.html\n\n"
