var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var util = require('./config/util/');
var loadersByExtension = util.loadersByExtension;
var statsBuilder = util.statsBuilder;

module.exports = function(options) {
  'use strict';

  var isDev = options.isDev || true;

  var entry = {
    application: __dirname + '/assets/index.js'
  };

  var scriptLoaders = {
    'jsx': options.hotComponents ?
      ['react-hot-loader', 'babel-loader'] :
      ['babel-loader'],
    'js': {
      loader: 'babel-loader',
      include: path.join(__dirname, 'assets')
    }
  };

  var browsers = { browsers: ['last 2 version', 'ie >= 10'] };

  var stylesheetLoaders = {
    'css': 'css-loader!autoprefixer-loader?' + JSON.stringify(browsers)
  };

  var root = __dirname;

  var modulesDirectories = ['node_modules'];

  var aliases = {};

  var aliasLoader = {};

  var publicPath = options.devServer ?
    'http://localhost:8090/application/' :
    '/application/';

  var output = {
    path: path.join(__dirname, 'public/application'),
    publicPath: publicPath,
    filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
    chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
    sourceMapFilename: 'debugging/[file].map',
    pathinfo: options.debug
  };

  var excludeFromStats = [];

  var plugins = [
    function() {
      this.plugin('done', statsBuilder(excludeFromStats, publicPath));
    },
    new webpack.PrefetchPlugin('react'),
    new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
  ];

  if (options.commonsChunk) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin(
      'commons', 'commons.js' + (options.longTermCaching ? '?[chunkhash]' : '')
    ));
  }

  Object.keys(stylesheetLoaders).forEach(function(ext) {
    var loaders = stylesheetLoaders[ext];

    if (Array.isArray(loaders)) loaders = loaders.join('!');

    if (options.separateStylesheet) {
      stylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', loaders);
    } else {
      stylesheetLoaders[ext] = 'style-loader!' + loaders;
    }
  });

  if (options.separateStylesheet) {
    plugins.push(new ExtractTextPlugin(
      '[name].css' + (options.longTermCaching ? '?[contenthash]' : '')
    ));
  }

  if (options.optimize) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.NoErrorsPlugin()
    );
  }

  var loaders = loadersByExtension(scriptLoaders).concat(
    loadersByExtension(stylesheetLoaders)
  );

  return {
    entry: entry,
    output: output,
    target: 'web',
    module: {
      loaders: loaders
    },
    devtool: options.devtool,
    debug: options.debug,
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
      alias: aliasLoader
    },
    resolve: {
      root: root,
      modulesDirectories: modulesDirectories,
      alias: aliases
    },
    plugins: plugins,
    devServer: {
      stats: {
        exclude: excludeFromStats
      }
    }
  };
};
