import { Configuration } from 'webpack';
import { widgetSource, widgetBootstrap, widgetBuildServer } from '../shared/constants';
import type { Config } from '@vexa/cli-config';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name
  const normalizeName = 'widget'; //config.widgetName;

  const webpackConfig: Configuration = {
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: widgetBootstrap,
    },
    output: {
      publicPath: 'auto',
      libraryTarget: 'umd',
      filename: `[name].js`,
      chunkFilename: './chunks/[name]-[contenthash].js',
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
            test: /[\\/]node_modules[\\/]/,
            // idHint: 'vendors',
            name: 'vendors',
            chunks: 'async',
            priority: -10,
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
      new ModuleFederationPlugin({
        name: widgetName,
        library: { type: 'commonjs-module' },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          moment: { singleton: true },
        },
      }),
    ],
  };

  return webpackConfig;
};
