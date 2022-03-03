const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,
  entry : './src/resources/js/app.js',
  output: {
    path: path.resolve(__dirname, 'src/public'),
    filename: 'js/bundle.js',
    publicPath: 'src/public',
  },
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
  // devtool: 'source-map',
  plugins: [new MiniCssExtractPlugin({ filename: 'css/bundle.css' })],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
};