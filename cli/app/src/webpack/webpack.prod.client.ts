import { Configuration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;
import { ManifestAssetsPlugin } from './plugins/manifestPlugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@vexa/core-app/shared/webpack.shared.js');

export interface ConfigProps {
  outputPath: string;
  widgetName: string;
  entry: string;
  widgetEntry: string;
}

export default (props: ConfigProps): Configuration => {
  const config: Configuration = {
    target: 'web',
    mode: 'production',
    devtool: 'source-map',
    entry: {
      index: props.entry,
    },
    output: {
      // chunkLoadingGlobal: `webpack_widget_chunks_${widgetName}`,
      uniqueName: props.widgetName,
      publicPath: 'auto',
      path: path.resolve(props.outputPath, './client'),
      filename: `[name].js`,
      chunkFilename: './chunks/[name]-[contenthash].js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~widget$': props.widgetEntry, // используем alias для подключения виджета ???
      },
    },
    optimization: {
      runtimeChunk: false,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
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
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
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
      new MiniCssExtractPlugin({
        linkType: 'text/css',
        // insert: function (linkTag) {
        //   const reference = document.querySelector("#some-element");
        //   if (reference) {
        //     reference.parentNode.insertBefore(linkTag, reference);
        //   }
        // },
      }),
      new ModuleFederationPlugin({
        name: props.widgetName,
        library: { type: 'window', name: ['widgets', props.widgetName] },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] },
        shared: shared,
      }),
      new ManifestAssetsPlugin({
        output: path.resolve(props.outputPath, 'manifest.json'),
      }),
    ],
  };

  return config;
};
