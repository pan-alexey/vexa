import type { WebpackPluginInstance } from 'webpack';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import path from 'path';

const { ModuleFederationPlugin } = webpack.container;
export const plugins = (appName: string, isDev: boolean): WebpackPluginInstance[] => {
  const plugins: WebpackPluginInstance[] = [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './public/index.html'),
    }),
    // new CleanWebpackPlugin(),
    new ModuleFederationPlugin({
      name: appName, // build name by package.json
      shared: {
        react: { singleton: true, requiredVersion: '18.2.0', eager: true }, // to external
        'react-dom': { singleton: true, requiredVersion: '18.2.0', eager: true }, // to external
      },
    }),
  ];

  // if (isDev) {
  //   console.log('isDev', isDev);
  //   plugins.push(
  //     new ReactRefreshWebpackPlugin({
  //       overlay: false,
  //     }),
  //   );
  // }
  return plugins as WebpackPluginInstance[];
};
