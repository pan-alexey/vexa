import { Configuration } from 'webpack';
import * as path from 'path';
import type { Config } from '@vexa/cli-config';
import { widgetSource, widgetAppServer, widgetAppDistServer } from '../shared/constants';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack from 'webpack';
import { isPackage } from '../shared/libs/packages';

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name
  const normalizeName = 'widget'; //config.widgetName;

  const webpackConfig: Configuration = {
    entry: {
      index: widgetAppServer,
    },
    mode: 'production',
    devtool: 'source-map',
    target: 'node',
    output: {
      libraryTarget: 'umd',
      path: widgetAppDistServer,
      filename: 'index.js',
    },
    externals: [
      // don't build @vexa/core-app
      function ({ context, request }, callback) {
        if (isPackage(request) && request === '@vexa/core-app') {
          return callback(undefined, 'commonjs ' + request);
        }
        return callback();
      },
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
        '~widget$': widgetSource,
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
        {
          test: /\.css$/i,
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: {
                  exportOnlyLocals: true,
                  auto: true,
                  localIdentName: `${normalizeName}_[contenthash]`,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        __name__: JSON.stringify(widgetName),
      }),
    ],
  };

  return webpackConfig;
};
