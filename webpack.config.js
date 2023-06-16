const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const WorkboxPlugin = require('workbox-webpack-plugin');

// npm ls <package-name> will give you the most details about the dependency graph of a dependency.
// npm outdated --depth=n will analyze installed NPM-packages and their versions.

module.exports = (env, argv) => {
  console.log('env: ', env);
  console.log('argv: ', argv);

  return {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    devtool: 'inline-source-map',
    devServer: {
      static: './dist',
      port: 9090,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Development',
        favicon: './src/favicon.svg',
      }),/*
      // Must be accessed via http://127.0.0.1:8080
      // Go to the URL: chrome://serviceworker-internals/ and unregister a serviceworker when you remove the workbox.
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
      }),*/
    ],
    output: {
      filename: '[name].[contenthash].js', // [contenthash] for caching
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      moduleIds: 'deterministic', // fix module.id for caching
      runtimeChunk: 'single', // split webpack runtime
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\\/]node_modules[\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }, // split node_modules
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(csv|tsv)$/i,
          use: ['csv-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};