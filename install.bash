#!/usr/bin/env bash
# Installs the @voxel51/api-js package.
#
# Copyright 2017-2019, Voxel51, Inc.
# voxel51.com
#

# Show usage information
usage() {
    echo "Usage:  bash $0 [-h]

-h      Display this help message.
"
}

# Parse flags
SHOW_HELP=false
while getopts "h" FLAG; do
    case "${FLAG}" in
        h) SHOW_HELP=true ;;
        *) usage ;;
    esac
done
[ ${SHOW_HELP} = true ] && usage && exit 0

# Install package
echo "Installing @voxel51/api-js"
npm ci
