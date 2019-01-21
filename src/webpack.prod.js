const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpackNodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

const common = {
  mode: 'production',
  resolve: {
    modules: [
      path.resolve(__dirname, './node_modules')
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: ['json-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff|woff2|png|ico|jpe?g|gif|svg)$/i,
        use: 'file-loader?name=[path][name][hash].[ext]',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(styl|stylus|css)/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              importLoaders: 1,
              localIdentName: '[sha1:hash:hex:4]'
              // localIdentName: '[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                autoprefixer({
                  browsers: 'last 40 versions'
                })
              ]
            }
          },
          'stylus-loader',
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: 'all',
    }
  }
}

const env = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.PROD': JSON.stringify(process.env.PROD),
  'process.env.API_DOMAIN': JSON.stringify(process.env.API_DOMAIN),
  'process.env.PROTOCOL': JSON.stringify(process.env.PROTOCOL),
}

module.exports = [
  {
    ...common,
    name: "client",
    target: "web",
    entry: path.resolve(__dirname, "./app/client"),
    output: {
      filename: "client.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css",
      }),
      new webpack.DefinePlugin(env),
      new ManifestPlugin()
    ],
  },

  {
    ...common,
    name: "server",
    target: "node",
    entry: path.resolve(__dirname, "./app/server"),
    externals: [webpackNodeExternals()],
    output: {
      filename: "server.bundle.js",
      chunkFilename: "[name].chunk.js",
      path: path.resolve(__dirname, "./dist"),
      libraryTarget: "commonjs2",
      publicPath: "/",
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.[contenthash].css",
      }),
      new webpack.DefinePlugin(env),
    ],
  },
]
