#!/usr/bin/env bash
# Generate Node Client Library documentation
#
# Assumes apidocjs is globally installed:
#   npm install -g apidocjs
#
# Copyright 2018, Voxel51, LLC
# David Hodgson, david@voxel51.com
# Brian Moore, brian@voxel51.com
#


# Show usage information
usage() {
    echo "Usage:  bash $0 [-h] [-p]
-h      Display this help message.
"
}


# Parse flags
SHOW_HELP=false
while getopts "hp" FLAG; do
    case $FLAG in
        h) SHOW_HELP=true ;;
        *) SHOW_HELP=true ;;
    esac
done
[ $SHOW_HELP = true ] && usage && exit 0


echo "**** Generating API documentation"
./node_modules/.bin/jsdoc -c conf.json
echo "**** API documentation complete"
