module.exports = function (api) {
  console.log('api: ', api)

  api.cache(true)

  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        '@babel/plugin-transform-react-jsx',
        { // (relevant for React 17) mode helps you to avoid the necessity
          // of importing React in every file where jsx is used,
          // add {"jsx": "react-jsx"} in tsconfig.json for typescript.
          runtime: 'automatic'
        }
      ],
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-proposal-private-property-in-object'
    ]
  }
}
