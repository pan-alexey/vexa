import { Configuration } from 'webpack';
import * as path from 'path';
import webpack from 'webpack';
const { ModuleFederationPlugin } = webpack.container;

const appName = 'application'; // Application is singleton

export default (): Configuration => {
  const config: Configuration = {
    entry: {
      index: path.resolve('./src/server/index.tsx'),
    },
    mode: 'production',
    devtool: 'source-map',
    target: 'node',
    output: {
      uniqueName: appName,
      libraryTarget: 'umd',
      path: path.resolve('./dist/server'),
      filename: 'index.js',
    },
    externals: [],
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
        name: appName,
        library: { type: 'commonjs-module' },
        shared: {
          react: { singleton: true, eager: true }, // to external
          'react-dom': { singleton: true, eager: true }, // to external
        },
      }),
    ],
  };

  return config;
};
