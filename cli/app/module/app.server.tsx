import { Application } from '@vexa/core-app';
import type { Config } from '@vexa/cli-config';
import { widgetStaticPath } from '../src/shared/constants/server';
// import { widgetStaticPath } from '../src/shared/constants';

export const getApplication = (config: Config) => {
  const widgetHttpPort = config.debug.httpPort;

  // Make remoteUrls
  const widgetHttpPath = `http://127.0.0.1:${widgetHttpPort}/${widgetStaticPath}/widget.tgz`;
  const remoteUrls = config.debug.remotes;
  remoteUrls[config.name] = widgetHttpPath;

  const application = new Application({
    remoteUrls,
  });

  return application;
};
