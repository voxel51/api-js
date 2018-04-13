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
-p      Generate documentation for private API methods.
"
}


# Parse flags
SHOW_HELP=false
PRIVATE_DOCS=false
while getopts "hp" FLAG; do
    case $FLAG in
        h) SHOW_HELP=true ;;
        p) PRIVATE_DOCS=true ;;
        *) SHOW_HELP=true ;;
    esac
done
[ $SHOW_HELP = true ] && usage && exit 0


echo "**** Generating API documentation"
mkdir temp/
cp lib.js temp/
apidoc -i temp/ -o docs/ --private $PRIVATE_DOCS
echo "**** API documentation complete"
