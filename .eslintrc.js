module.exports = {
  plugins: ['react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'standard-with-typescript',
    'react-app'
  ],
  rules: {
    'max-len': [
      'error',
      {
        code: 80
      }
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true
      }
    ],
    'jsx-quotes': ['error', 'prefer-double'],
    'react/react-in-jsx-scope': 0
  },
  // The parserOptions described in the official documentation are for
  // the default parser and are not necessarily supported by other parsers.
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  env: {
    browser: true,
    node: true
  }
}
