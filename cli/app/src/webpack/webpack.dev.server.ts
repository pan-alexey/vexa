import webpack from 'webpack';
import type { Configuration as WebpackConfiguration } from 'webpack';

const { ModuleFederationPlugin } = webpack.container;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const shared = require('@vexa/core-app/shared/webpack.shared.js');

const appName = 'application'; // Application is singleton

export interface ConfigProps {
  outputPath: string;
  widgetEntry: string;
  widgetName: string;
  app: string;
}

export default (props: ConfigProps): WebpackConfiguration => {
  const config: WebpackConfiguration = {
    devtool: 'source-map',
    target: 'node',
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        __name__: JSON.stringify(props.widgetName),
      }),
      new ModuleFederationPlugin({
        library: { type: 'commonjs-module' },
        name: appName,
        shared,
      }),
    ],
    context: process.cwd(),
    entry: {
      index: props.app,
    },
    output: {
      uniqueName: appName,
      libraryTarget: 'umd',
      path: props.outputPath,
      filename: 'index.js',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~widget$': props.widgetEntry, // используем alias для подключения виджета ???
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
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[path][name]__[local]--[hash:base64:5]',
                },
              },
            },
          ],
        },
      ],
    },
  };

  return config;
};
