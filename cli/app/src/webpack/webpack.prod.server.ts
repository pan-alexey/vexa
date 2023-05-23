import { Configuration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

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
    target: 'node',
    mode: 'development',
    devtool: 'source-map',
    entry: {
      index: props.entry,
    },
    output: {
      publicPath: 'auto',
      libraryTarget: 'commonjs-module',
      path: path.resolve(props.outputPath, './server'),
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
            'style-loader',
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
      new ModuleFederationPlugin({
        name: props.widgetName,
        library: { type: 'commonjs-module' },
        filename: 'module.js',
        exposes: { widget: ['./src/index'] },
        shared: shared,
      }),
    ],
  };

  return config;
};
