import { Configuration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';
import packageJSON from '../package.json'
import { isPackage } from './utils/package';
import shared from '../shared/webpack.shared.js';
const { ModuleFederationPlugin } = webpack.container;

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      index: path.resolve(process.cwd(), './module/server/index.tsx')
    },
    mode: 'production',
    devtool: 'source-map',
    target: 'node',
    output: {
      uniqueName: packageJSON.name, // in package
      libraryTarget: 'umd',
      path: path.resolve('./dist/server'),
      filename: 'index.js',
    },
    externals: [
      // for monorepo
      function ({ context, request }, callback) {
        // check if local file import
        if (request && context === process.cwd()) {
          const symbol = request[0];
          if (symbol === '/' || symbol === '.') {
            return callback();
          }
        }
        if (isPackage(request)) {
          return callback(undefined, 'commonjs ' + request);
        }
        return callback();
      },
    ],
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.css'],
      alias: {
        '~': path.resolve('src'),
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
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: packageJSON.name,
        library: { type: 'commonjs-module' },
        shared,
      }),
      new webpack.DefinePlugin({
        __PACKAGE_NAME__: JSON.stringify(packageJSON.name),
      })
    ],
  };

  return config;
};
