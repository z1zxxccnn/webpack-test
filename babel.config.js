module.exports = function(api) {
  console.log('api: ', api)

  api.cache(true)

  return {
    "presets": [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      [
        "@babel/preset-react",
        { // (relevant for React 17) mode helps you to avoid the necessity of importing React in every file where jsx is used,
          // tsconfig.json {"jsx": "react-jsx"}
          "runtime": "automatic"
        }
      ]
    ]
  };
};