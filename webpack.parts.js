// const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

exports.devServer = function (options) {
  return {
    // configuation for the webpack-dev-server plugin
    devServer: {
      // defaults to localhost
      host: options.host,
      // defaults to 8080
      port: options.port,
      // remove browser status bar when running in production
      inline: true,
      // display erros only in console to limit webpack output size
      stats: 'errors-only'
    }
  }
}

exports.lintJS = function ({ paths, options }) {
  return {
    // this module is merged with the babel-loader module in the commons object via
    // `webpack-merge`
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: paths,
          exclude: /node_modules/,
          // enables ESLint to run before anything else
          enforce: 'pre',
          use: [
            // eslint runs before babel
            {
              loader: 'eslint-loader',
              options: options
            }
          ]
        }
      ]
    }
  }
}

exports.CSS = function (env) {
  // In production, extract CSS into a separate file depending and inject
  // into the head of the document
  if (env === 'production') {
    return {
      module: {
        rules: [
          {
            test: /\.(scss|css)$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
				'css-loader',
				'resolve-url-loader',
				{
					loader: 'sass-loader',
					options: {
						sourceMap: true
					}
				},
				'postcss-loader',
              ]
            })
          }
        ],
      },
      plugins: [
        new ExtractTextPlugin({
          filename: 'assets/css/[name].css',
          allChunks: true
        })
      ]
    }
  }

  return {
    module: {
      rules: [
        {
          // regex pattern that matches any CSS files
          test: /\.(scss|css)$/,
          use: [
				 { loader: 'style-loader' },
				 { loader: 'css-loader'},
				 { loader: 'resolve-url-loader'},
				 { loader: 'sass-loader?sourceMap' },
				 { loader: 'postcss-loader'}
          ]
        }
      ]
    }
  }
}
