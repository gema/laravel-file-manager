const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const mode = 'production';

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader', 
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin({include: /.js$/}),
    ],
  },
}

const mainConfig = Object.assign({}, config, {
  mode,
  entry: './src/resources/js/app.js',
  output: {
    path: path.resolve(__dirname, 'src/resources/bundles'),
    filename: 'js/bundle.js',
    publicPath: 'src/resources/bundles',
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/bundle.css' }),
  ],
})

const vueConfig = Object.assign({}, config, {
  mode,
  entry : './src/resources/js/vue/entry.js',
  output: {
    path: path.resolve(__dirname, 'src/resources/bundles'),
    filename: 'js/vue_bundle.js',
    publicPath: 'src/resources/bundles',
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/vue_bundle.css' }),
  ],
})

module.exports = [
  mainConfig, vueConfig,
];