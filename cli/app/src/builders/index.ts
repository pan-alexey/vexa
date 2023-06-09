import webpack from 'webpack';
import { WatchBuilder, BaseBuilder } from '@vexa/tools-builder';
import * as constants from './constants';

import webpackDevClient from '../webpack/webpack.dev.client';
import webpackDevServer from '../webpack/webpack.dev.server';
import webpackProdClient from '../webpack/webpack.prod.client';
import webpackProdServer from '../webpack/webpack.prod.server';

export const makeAppClient = (widgetName: string): WatchBuilder | null => {
  const { appInput, appOutput, widgetSource } = constants;

  if (!appInput.client) {
    return null;
  }

  const webpackConfig = webpackDevClient({
    app: appInput.client,
    outputPath: appOutput.client,
    widgetEntry: widgetSource,
    manifestJson: appOutput.clientManifest,
    widgetName,
  });

  const compiler = webpack(webpackConfig);

  // add hmr
  new webpack.EntryPlugin(compiler.context, 'webpack-hmr-server/client.js', {
    name: undefined,
  }).apply(compiler);

  return new WatchBuilder(compiler, {
    ignored: [appOutput.client],
  });
};

export const makeAppServer = (widgetName: string): WatchBuilder | null => {
  const { appInput, appOutput, widgetSource } = constants;

  if (!appInput.server) {
    return null;
  }

  const webpackConfig = webpackDevServer({
    app: appInput.server,
    outputPath: appOutput.server,
    widgetEntry: widgetSource,
    widgetName,
  });

  const compiler = webpack(webpackConfig);
  return new WatchBuilder(compiler, {
    ignored: [appOutput.server],
  });
};

const makeWidgetBuilders = (
  widgetName: string,
): null | {
  server: webpack.Compiler;
  client: webpack.Compiler;
} => {
  const { widgetSource, widgetBootstrap } = constants;

  if (!widgetBootstrap) {
    return null;
  }

  const client = webpackProdClient({
    outputPath: constants.widgetTempPath,
    widgetName: widgetName,
    entry: widgetBootstrap,
    widgetEntry: widgetSource,
  });

  const server = webpackProdServer({
    outputPath: constants.widgetTempPath,
    widgetName: widgetName,
    entry: widgetBootstrap,
    widgetEntry: widgetSource,
  });

  return {
    server: webpack(client),
    client: webpack(server),
  };
};

export const makeWidgetBuild = (
  widgetName: string,
): null | {
  server: BaseBuilder;
  client: BaseBuilder;
} => {
  const configs = makeWidgetBuilders(widgetName);
  if (configs === null) {
    return null;
  }

  return {
    server: new BaseBuilder(configs.server),
    client: new BaseBuilder(configs.client),
  };
};

export const makeWidgetWatch = (
  widgetName: string,
): null | {
  server: WatchBuilder;
  client: WatchBuilder;
} => {
  const configs = makeWidgetBuilders(widgetName);
  if (configs === null) {
    return null;
  }

  return {
    server: new WatchBuilder(configs.server),
    client: new WatchBuilder(configs.client),
  };
};
