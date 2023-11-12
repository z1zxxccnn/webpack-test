const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')()
console.log(`config: ${JSON.stringify(config)}`)
config.output.publicPath = '/'
const compiler = webpack(config)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
)

// Serve the files on port 9090.
app.listen(9090, function () {
  console.log('Example app listening on port 9090!\n')
})
