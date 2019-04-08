'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
  VueLoaderPlugin
} = require('vue-loader')

const {
  assetsPath,
  resolve
} = require('./utils')

module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'assets': resolve('src/assets'),
      'pages': resolve('src/pages'),
      'demos': resolve('src/demos'),
      'styles': resolve('src/styles'),
      'static': resolve('static'),
      'components': resolve('src/components'),
      'vue$': 'vue/dist/vue.esm.js',
      'wii': resolve('packages'),
      '@': resolve('src')
    }
  },

  module: {
    rules: [{
      test: /\.(js|vue)$/,
      use: 'eslint-loader',
      enforce: 'pre'
    }, {
      test: /\.vue$/,
      use: 'vue-loader'
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([{
      from: resolve('static/img'),
      to: resolve('dist/static/img'),
      toType: 'dir'
    }])
  ]
}