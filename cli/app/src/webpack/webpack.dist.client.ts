import { Configuration } from 'webpack';
import { widgetSource, widgetBootstrap, widgetBuildClient, widgetNullEntry } from '../shared/constants';
import type { Config } from '@vexa/cli-config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name
  const normalizeName = 'widget'; //config.widgetName;

  const webpackConfig: Configuration = {
    target: 'web',
    mode: 'development',
    devtool: 'source-map',
    cache: false,
    entry: {
      index: widgetNullEntry,
    },
    output: {
      uniqueName: widgetName,
      publicPath: 'auto',
      path: widgetBuildClient,
      filename: `[name].js`,
      chunkFilename: './chunks/[contenthash].js',
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
            test: /[\\/]node_modules[\\/]/,
            // idHint: 'vendors',
            name: 'vendors',
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
              loader: MiniCssExtractPlugin.loader,
            },
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
      new ModuleFederationPlugin({
        name: widgetName,
        library: { type: 'window', name: ['widgets', widgetName] },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] },
        shared: {
          react: { singleton: true }, // eager: true
          'react-dom': { singleton: true },
        },
      }),
      new webpack.DefinePlugin({
        __name__: JSON.stringify(widgetName),
      }),
      new MiniCssExtractPlugin(),
    ],
  };

  return webpackConfig;
};
