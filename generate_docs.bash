#!/usr/bin/env bash
# Generate JavaScript client library documentation
#
# Usage:
#   bash generate_docs.bash
#
# Copyright 2018, Voxel51, LLC
# voxel51.com
#
# David Hodgson, david@voxel51.com
# Brian Moore, brian@voxel51.com
#

echo "**** Generating API documentation"

./node_modules/.bin/jsdoc -c conf.json

echo "**** API documentation complete"
