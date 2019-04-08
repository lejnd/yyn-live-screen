'use strict'

const path = require('path')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const {
  VueLoaderPlugin
} = require('vue-loader')

const PackName = 'all'
baseConfig.plugins = [new VueLoaderPlugin()]

module.exports = merge(baseConfig, {
  entry: `./src/pack/${PackName}.js`,
  output: {
    libraryTarget: "umd",
    // 输出目录
    path: path.resolve(__dirname, '../dist'),
    // 输出文件名 name 为 entry 的 key 值，也可以加上 hash 值， 如：[name].[hash:8].js
    filename: `wmu2.${PackName}.js`,
    // 构建生成的 js 在html中引用时的路径
    publicPath: '/'
  },
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 1000000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 1000000000, // 整数类型（以字节为单位）
    assetFilter: function (assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');

    }
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({}) // use OptimizeCSSAssetsPlugin
    ],
    /**
     * 此配置打包时超过244k会自动分包，对于组件库不友好
     */
    // splitChunks: {
    //   cacheGroups: {
    //     commons: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendor",
    //       chunks: "all",
    //     },
    //   },
    // },
  },
  module: {
    rules: [{
      test: /\.css?$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader'
      ]
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `wmu2.${PackName}.less`
    })
  ]
})
