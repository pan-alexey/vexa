import { Configuration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ManifestAssetsPlugin } from './plugins/manifest';

import shared from '../shared/webpack.shared.js';
const { ModuleFederationPlugin } = webpack.container;

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      index: path.resolve(process.cwd(), './module/client/index.tsx')
    },
    target: 'web',
    mode: 'production',
    devtool: 'hidden-source-map',
    cache: false,
    output: {
      uniqueName: 'application', // in package
      path: path.resolve('./dist/client'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
      },
      modules: ['node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
                modules: {
                  localIdentName: '[name][hash:base64:8]',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'application',
        library: { type: 'commonjs-module' },
        shared,
      }),
      new ManifestAssetsPlugin({
        output: path.resolve(process.cwd(), './dist/client/manifest.json')
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            // @ts-ignore
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)
                ? module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                : module.context.match(/[\\/]packages[\\/](.*?)([\\/]|$)/)[1]
              return `vendor/npm.${packageName.replace('@', '')}`
            },
          },
        },
      }
    },
  };

  return config;
};
