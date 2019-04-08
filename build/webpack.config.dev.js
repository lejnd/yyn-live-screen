'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const HOST = 'localhost'
const PORT = 8081

module.exports = merge(baseConfig, {
  mode: 'development',

  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    host: HOST,
    port: PORT,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: true
    },
    proxy: {
      "/live2": {
        "target": "http://tyyn.ybsjyyn.com",
        "changeOrigin": true
      }
    }
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'vue-style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ],
    }, ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})