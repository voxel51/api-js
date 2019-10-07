module.exports = {
  "root": true,
  "parserOptions": {
    "ecmaVersion": 8,
  },
  "env": {
    "node": true,
    "browser": false,
  },
  "rules": {
    'for-direction': 0,
    'no-cond-assign': 2, // eslint:recommended
    'no-console': 1, // eslint:recommended
    'no-constant-condition': 2, // eslint:recommended
    'no-debugger': 1, // eslint:recommended
    'no-dupe-args': 2, // eslint:recommended
    'no-dupe-keys': 2, // eslint:recommended
    'no-duplicate-case': 2, // eslint:recommended
    'no-empty': 2, // eslint:recommended
    'no-empty-character-class': 2, // eslint:recommended
    'no-ex-assign': 2, // eslint:recommended
    'no-extra-boolean-cast': 2, // eslint:recommended
    'no-func-assign': 2, // eslint:recommended
    'no-invalid-regexp': 2, // eslint:recommended
    'no-irregular-whitespace': 2,
    'no-unexpected-multiline': 2,
    'no-multi-str': 2,
    // 'no-obj-calls': 2, // eslint:recommended
    // 'no-prototype-builtins': 0,
    'no-regex-spaces': 2, // eslint:recommended
    'no-unreachable': 2, // eslint:recommended
    // 'no-unsafe-negation': 0,
    'use-isnan': 2, // eslint:recommended
    'valid-jsdoc': [2, {
      requireParamDescription: false,
      requireReturnDescription: false,
      requireReturn: false,
      prefer: {returns: 'return'},
    }],

    // Best Practices
    // http://eslint.org/docs/rules/#best-practices
    // --------------------------------------------

    'curly': [2, 'multi-line'], // google setting
    'default-case': 2,
    'guard-for-in': 2,
    'no-caller': 2,
    'no-else-return': 1,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-floating-decimal': 2,
    'no-invalid-this': 2,
    'no-new-wrappers': 2,
    'no-return-assign': 1,
    'no-throw-literal': 2, // eslint:recommended
    'no-with': 2,
    'require-await': 1,

    // Variables
    // http://eslint.org/docs/rules/#variables
    // ---------------------------------------
    'no-delete-var': 2, // eslint:recommended
    // 'no-shadow-restricted-names': 0,
    // 'no-undef': 2, // eslint:recommended
    'no-unused-vars': [2, {args: 'none'}], // eslint:recommended

    // Stylistic Issues
    // http://eslint.org/docs/rules/#stylistic-issues
    // ----------------------------------------------
    'array-bracket-newline': 0, // eslint:recommended
    'array-bracket-spacing': [2, 'never'],
    'array-element-newline': 0, // eslint:recommended
    'block-spacing': [2, 'never'],
    'brace-style': 2,
    'camelcase': [2, {properties: 'never'}],
    // 'capitalized-comments': 0,
    'comma-dangle': [2, 'always-multiline'],
    'comma-spacing': 2,
    'comma-style': 2,
    'computed-property-spacing': 2,
    // 'consistent-this': 0,
    'eol-last': 2,
    'func-call-spacing': 2,
    // 'func-name-matching': 0,
    // 'func-names': 0,
    // 'func-style': 0,
    // 'id-blacklist': 0,
    // 'id-length': 0,
    // 'id-match': 0,
    'indent': [
      'error', 2, {
        'CallExpression': {
          'arguments': 1,
        },
        'FunctionDeclaration': {
          'body': 1,
          'parameters': 1,
        },
        'FunctionExpression': {
          'body': 1,
          'parameters': 1,
        },
        'MemberExpression': 1,
        'ObjectExpression': 1,
        'SwitchCase': 1,
        'ignoredNodes': [
          'ConditionalExpression',
        ],
      },
    ],
    // 'jsx-quotes': 0,
    'key-spacing': 2,
    'keyword-spacing': 2,
    'linebreak-style': 2,
    'max-len': [2, {
      code: 80,
      tabWidth: 2,
      ignoreUrls: true,
    }],
    'new-cap': 1,
    'no-array-constructor': 2,
    'no-mixed-spaces-and-tabs': 2, // eslint:recommended
    'no-multiple-empty-lines': [2, {max: 2}],
    'no-new-object': 2,
    'no-tabs': 2,
    'no-trailing-spaces': 2,
    'object-curly-spacing': 2,
    'one-var': [2, {
      var: 'never',
      let: 'never',
      const: 'never',
    }],
    'padded-blocks': [2, 'never'],
    'quote-props': [2, 'consistent'],
    'quotes': [2, 'single', {allowTemplateLiterals: true}],
    'require-jsdoc': [2, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
      },
    }],
    'semi': 2,
    'semi-spacing': 2,
    // 'semi-style': 0,
    // 'sort-keys': 0,
    // 'sort-vars': 0,
    'space-before-blocks': 2,
    'space-before-function-paren': [2, {
      asyncArrow: 'always',
      anonymous: 'never',
      named: 'never',
    }],
    'spaced-comment': [2, 'always'],
    'switch-colon-spacing': 2,

    // ECMAScript 6
    // http://eslint.org/docs/rules/#ecmascript-6
    // ------------------------------------------
    'arrow-parens': [2, 'always'],
    // 'arrow-spacing': 0,
    'constructor-super': 2, // eslint:recommended
    'generator-star-spacing': [2, 'after'],
    'no-new-symbol': 2, // eslint:recommended
    'no-this-before-super': 2, // eslint:recommended
    // 'no-var': 2,
    'prefer-rest-params': 2,
    'prefer-spread': 2,
    'rest-spread-spacing': 2,
    'yield-star-spacing': [2, 'after'],
  }
};
