import {resolve, join} from 'path';

import {Configuration} from 'webpack';
const config: Configuration = {
  entry: './src/web/index.ts',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: join(__dirname, 'dist'),
    compress: true,
    port: 4000,
  },
};
export default config;
