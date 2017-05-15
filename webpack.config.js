/**
 * Requires
 */
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')
const merge = require('webpack-merge')

/**
 * Variables
 */
const Parts = require('./webpack.parts')
const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist')
}
const templatePublicPath = '/templates/simple-web/'

/**
 * Common Configuration
 */
const Common = merge([
  {
    context: PATHS.src,
    entry: {
      main: './index.js',
    },
    output: {
      filename: 'assets/js/[name].bundle.js',
      path: PATHS.dist,
	  library: '[name]',
	  publicPath: templatePublicPath,
    },
    module: {
      rules: [
        {
          // Regex pattern that matches any files with a .js or .jsx
          // file extension
          test: /\.jsx?$/,
          include: [path.join(__dirname, 'src')],
          // Exclude the node_modules folder from being transpiled
          exclude: /node_modules/,
          // Transform all .js and .jsx files to standard ES5 syntax
          // using the Babel loader
          use: 'babel-loader'
        },
        {
          test: /\.html$/,
          use: [
			{
				loader: 'html-loader',
				options: {
					name: '[name].[ext]'
				}
			}	
		  ]
        },
        {
          test: /\.(jpg|jpeg|png|svg|gif|woff|woff2|otf|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images/',
                publicPath: templatePublicPath,
                include: [path.join(__dirname, 'src')]
              }
            }
          ]
        }
      ],
    },	
    plugins: [
      new HtmlWebpackPlugin({ 
	    filename: 'index.html',
		template: path.join(PATHS.src, 'index.html') ,
		chunks: ['main']
	  }),  
      new HtmlWebpackPlugin({ 
	    filename: 'users.html',
		template: path.join(PATHS.src, 'users.html') ,
		chunks: ['main']
	  }),  	  
      new CleanWebpackPlugin(['dist'])
    ]
  }
])

module.exports = function (env) {	
  /**
   * Production Configuration
   */
  if (env === 'production') {
    return merge([
      Common,
      Parts.lintJS({ paths: PATHS.src }),
      Parts.CSS(env)
    ])
  }
  /**
   * Develpment Configuration
   */
  return merge([
    Common,
    Parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    }),
    Parts.lintJS({
      paths: PATHS.src,
      options: {
        emitWarning: true
      }
    }),
    Parts.CSS(env)
  ])
}
