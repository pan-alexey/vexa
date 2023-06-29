import { Configuration } from 'webpack';
import * as path from 'path';
import type { Config } from '@vexa/cli-config';
import { widgetAppServer, widgetAppDistServer } from '../shared/constants';
import { isPackage } from './helpers/package';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack from 'webpack';

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name

  const webpackConfig: Configuration = {
    entry: {
      index: widgetAppServer,
    },
    mode: 'development',
    devtool: 'source-map',
    target: 'node',
    output: {
      libraryTarget: 'commonjs-module',
      path: widgetAppDistServer,
      filename: 'index.js',
    },
    externals: [
      // Должен билдится (@vexa/core-app - не должен быть пакетом)
      // disable build @vexa/core-app for monorepo
      function ({ request }, callback) {
        if (isPackage(request) && request === '@vexa/core-app') {
          return callback(undefined, 'commonjs ' + request);
        }
        return callback();
      },
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      alias: {
        '~': path.resolve('src'),
      },
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            exclude: /node_modules/,
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      ],
    },
    // Добавить MF конфиг
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __name__: JSON.stringify(widgetName),
      }),
    ],
  };

  return webpackConfig;
};
