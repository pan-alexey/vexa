import type { Config } from '@vexa/cli-config';
import webpack from 'webpack';
import { WatchBuilder, BaseBuilder } from '@vexa/tools-builder';
import getWebpackConfig from '../../webpack/webpack.app.client';

export const watchBuilder = (config: Config): WatchBuilder => {
  const compiler = webpack(getWebpackConfig(config));
  return new WatchBuilder(compiler);
};

export const baseBuilder = (config: Config): BaseBuilder => {
  const compiler = webpack(getWebpackConfig(config));

  new webpack.EntryPlugin(compiler.context, 'webpack-hmr-server/client.js', {
    name: undefined,
  }).apply(compiler);

  return new BaseBuilder(compiler);
};
