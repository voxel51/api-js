#!/usr/bin/env bash
# Generate Node Client Library documentation
#
# Copyright 2018, Voxel51, LLC
# David Hodgson, david@voxel51.com
# Brian Moore, brian@voxel51.com
#


# Usage:
#   bash generate_docs.bash

echo "**** Generating API documentation"
./node_modules/.bin/jsdoc -c conf.json
echo "**** API documentation complete"
