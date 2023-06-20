import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { loader as CssExtractLoader } from 'mini-css-extract-plugin';
import { plugins } from './client/plugins';
import { cssModulesRules } from './client/styles';

import * as path from 'path';
const appName = 'application'; // Application is singleton

const devServer: DevServerConfiguration = {
  historyApiFallback: true,
  port: 8088,
  client: {
    // logging: 'none',
  },
};

export default (): WebpackConfiguration => {
  const isDev = process.env.NODE_ENV === 'development';
  const cssRegex = /\.(s*)css$/;
  const cssModuleRegex = /\.module\.(s*)css$/;

  const config: WebpackConfiguration = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    devServer,
    target: 'web',
    devtool: 'source-map',
    mode: isDev ? 'development' : 'production',
    plugins: plugins(appName, isDev),
    entry: {
      index: path.resolve(process.cwd(), './src/client/client.ts'),
    },
    output: {
      chunkLoadingGlobal: `webpack_chunks[${appName}]`, // todo name hash
      uniqueName: appName,
      publicPath: 'auto',
      chunkFilename: () => {
        return '[name].[contenthash].js';
      },
      clean: true,
      path: path.resolve(process.cwd(), './dist/client'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
      },
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
          test: cssRegex,
          exclude: cssModuleRegex,
          use: [isDev ? 'style-loader' : CssExtractLoader, cssModulesRules(isDev)],
        },
        {
          test: cssModuleRegex,
          use: [isDev ? 'style-loader' : CssExtractLoader, cssModulesRules(isDev, true)],
        },
      ],
    },
    // optimization: {
    //   runtimeChunk: { name: 'runtime' },
    //   splitChunks: {
    //     chunks: 'all',
    //     maxInitialRequests: Infinity,
    //     minSize: 0,
    //     name: 'vendor',
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         name(module) {
    //           const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
    //           // console.log("packageName", module.context);
    //           return `/vendor/${packageName.replace('@', '')}`;
    //         },
    //       },
    //     },
    //   },
    // },
  };

  return config;
};
