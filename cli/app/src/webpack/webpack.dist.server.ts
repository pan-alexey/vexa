import { Configuration } from 'webpack';
import { widgetSource, widgetBuildServer, widgetNullEntry } from '../shared/constants';
import type { Config } from '@vexa/cli-config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { normalizeName } from './helpers/normalizeName';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name
  const normalName = normalizeName(widgetName); //config.widgetName;

  const webpackConfig: Configuration = {
    target: 'node',
    mode: 'production',
    devtool: 'hidden-source-map',
    // entry: {
    //   index: widgetBootstrap,
    // },
    entry: widgetNullEntry,
    output: {
      publicPath: 'auto',
      libraryTarget: 'umd',
      filename: `index.js`,
      chunkFilename: './chunks/[id].[contenthash].js',
      path: widgetBuildServer,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
        '~widget$': widgetSource,
      },
    },
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        chunks: 'async',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            priority: -10,
            test: /[\\/]node_modules[\\/]/,
            chunks: 'async',
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name(module) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `vendor/${packageName}`;
            },
          },
          default: {
            priority: -20,
            // idHint: 'vendors',
            name: 'default',
            chunks: 'async',
          },
        },
      },
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
                  localIdentName: `${normalName}_[contenthash]`,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: widgetName,
        library: { type: 'commonjs-module' },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] },
        remotes: {},
        shared: {
          react: { singleton: true }, // eager: true
          'react-dom': { singleton: true },
          moment: { singleton: true },
        },
      }),
      new webpack.DefinePlugin({
        __name__: JSON.stringify(widgetName),
      }),
    ],
  };

  return webpackConfig;
};
