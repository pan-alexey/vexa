import { Configuration } from 'webpack';
import { widgetSource, widgetBuildClient, widgetBuildServer, widgetNullEntry } from '../shared/constants';
import type { Config } from '@vexa/cli-config';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { normalizeName } from './helpers/normalizeName';
import { ManifestAssetsPluginDist } from './plugins/manifestPluginDist';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

export default (config: Config): Configuration => {
  const widgetName = config.name;
  // const normalize name
  const normalName = normalizeName(widgetName);

  const webpackConfig: Configuration = {
    target: 'web',
    mode: 'production',
    devtool: 'hidden-source-map',
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
              options: {
                esModule: false,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: false,
                importLoaders: 1,
                modules: {
                  localIdentName: `${normalName}_[contenthash]`,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        linkType: 'text/css',
      }),
      new ManifestAssetsPluginDist({
        output: path.resolve(widgetBuildServer, 'manifest.json')
      }),
      // new CleanWebpackPlugin(),
      new ModuleFederationPlugin({
        name: widgetName,
        library: { type: 'window', name: ['__modules__', widgetName] },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] }, //
        shared: {
          react: { singleton: true, requiredVersion: '18.2.0' }, // eager: true
          'react-dom': { singleton: true, requiredVersion: '18.2.0' },
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
