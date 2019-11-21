#!/usr/bin/env bash
# Generates documentation for the @voxel51/api-js package.
#
# Usage:
#   bash docs/generate_docs.bash
#
# Copyright 2017-2019, Voxel51, Inc.
# voxel51.com
#

echo "**** Generating documentation"

node_modules/.bin/jsdoc -c docs/jsdoc.json

echo "**** Documentation complete"
printf "To view the docs, run:\n\nopen docs/build/index.html\n\n"
