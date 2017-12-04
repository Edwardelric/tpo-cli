var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require("webpack")
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
function getEVN() {
  if (process.env.NODE_ENV === 'production') {
    return config.build.assetsPublicPath
  } else if (process.env.NODE_ENV === 'app') {
    return config.app.assetsPublicPath
  } else {
    return config.dev.assetsPublicPath
  }
}
var topConfig = {
  useAllTpo: false,
  getTpoConfig: function () {
    if (topConfig.useAllTpo) {
      return topConfig.use
    } else {
      return topConfig.enuse
    }
  },
  enuse: {
    entry: {
      app: './src/main.js',
      "base": ["vue", "vue-router"]
    },
    bable: [resolve('src'), resolve('test'), resolve('../utils'), /vuext/, /tpo/],
    names: ["base"]

  },
  use: {
    entry: {
      app: './src/main.js',
      base: ["vue", "vue-router"],
      common: ["tpo"]

    },
    bable: [resolve('src'), resolve('test'), resolve('../utils'), /vuext/],
    names: ["base", "common"]

  }
}

module.exports = cxjconfig = {
  entry: topConfig.getTpoConfig().entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: getEVN()
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components')
    }
  },
  module: {
    rules: [
      /* {
         test: /\.(js|vue)$/,
         loader: 'eslint-loader',
         enforce: "pre",
         include: [resolve('src'), resolve('test')],
         options: {
           formatter: require('eslint-friendly-formatter')
         }
       },*/
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.less$/,
        //提取公共scss
        //loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader!postcss-loader")
        loader: 'style-loader!css-loader!less-loader!postcss-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: topConfig.getTpoConfig().bable
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: topConfig.getTpoConfig().names,
      minChunks: Infinity
    }),

    // and the following should go after explicit-vendor-chunk
    // in the list of plugins

    // explicit-webpack-runtime-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest", // something that's not an entry
      minChunks: Infinity
    })

  ]
}
