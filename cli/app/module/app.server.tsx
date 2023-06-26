import { Application } from '@vexa/core-app';
import type { Config } from '@vexa/cli-config';
import { widgetStaticPath } from '../src/shared/constants';

export const getApplication = (config: Config) => {
  const application = new Application({
    remoteUrls: config.debug.remotes,
  });

  // Устанавливаем настройки для виджета
  const widgetHttpPort = config.debug.httpPort;
  const widgetHttpPath = `http://127.0.0.1:${widgetHttpPort}/${widgetStaticPath}/widget.tgz`;
  application.registry.setupRemoteWidgetUrl({
    name: config.name,
    staticPath: widgetHttpPath,
  });

  return application;
};
