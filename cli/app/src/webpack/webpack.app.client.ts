import { Configuration } from 'webpack';
import * as path from 'path';
import type { Config } from '@vexa/cli-config';
import { widgetSource, widgetAppClient, widgetAppDistClient } from '../shared/constants';
import webpack from 'webpack';
import { normalizeName } from './helpers/normalizeName';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
const { ModuleFederationPlugin } = webpack.container;

export default (config: Config): Configuration => {
  const appName = 'application';
  const widgetName = config.name;
  const normalName = normalizeName(widgetName); //config.widgetName;

  const webpackConfig: Configuration = {
    entry: ['webpack-hmr-server/client.js', widgetAppClient],
    mode: 'development',
    devtool: 'hidden-source-map',
    target: 'web',
    performance: {
      hints: false,
      maxEntrypointSize: 51200000,
      maxAssetSize: 51200000,
    },
    output: {
      chunkLoadingGlobal: `webpack_chunks[${appName}]`,
      uniqueName: appName,
      publicPath: 'auto',
      filename: `index.js`,
      chunkFilename: () => {
        return '[name].[contenthash].js';
      },
      path: widgetAppDistClient,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
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
          // exclude: /node_modules/,
          options: {
            // exclude: /node_modules/,
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
                modules: {
                  localIdentName: `${normalName}_[contenthash]`, // app client предназначен для билда виджета
                },
              },
            },
          ],
        },
      ],
    },
    // Добавить MF конфиг
    plugins: [
      new webpack.DefinePlugin({
        __name__: JSON.stringify(widgetName),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
      new ModuleFederationPlugin({
        name: appName, // build name by package.json
        shared: {
          react: { singleton: true, requiredVersion: '18.2.0', eager: true }, // to external
          'react-dom': { singleton: true, requiredVersion: '18.2.0', eager: true }, // to external
        },
      }),
    ],
  };

  return webpackConfig;
};
