module.exports = {
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parser: '@typescript-eslint/parser',
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
    'react/react-in-jsx-scope': 0,
    'no-trailing-spaces': 'error'
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
