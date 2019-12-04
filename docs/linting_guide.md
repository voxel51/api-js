# Linting Guide

This project uses the `eslint` package for linting. We maintain customized
configurations in the `.eslintrc.js` and `.eslintignore` files.

Our configuration is based off of [Google's eslint config](
https://github.com/google/eslint-config-google/blob/master/index.js), with some
slight additions/modifications to match our style preferences.


## Installation

To install `eslint` and the necessary dependencies, run

```
npm install -g eslint
```


## Linting a file

To lint a file, run:

```shell
eslint <file>
```

Alternatively, to lint the entire `lib/` tree, run one of the following:

```shell
# use package script
npm run lint

# equivalent command
eslint lib/**/*.js
```


## Customizing eslint

To customize eslint, simply make the desired edits to `.eslintrc.js`.
See the [eslint guide](
https://eslint.org/docs/user-guide/configuring#configuring-rules) for more
information.


## Copyright

Copyright 2017-2019, Voxel51, Inc.<br>
voxel51.com
