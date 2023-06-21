/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // Подключаем код виджета c использованием alias
import { Application } from '@vexa/core-app/src/server';
import type { Config } from '@vexa/cli-config';

export const getApplication = (config: Config) => {
  const application = new Application({
    remoteUrls: config.debug.remotes,
  });

  // @ts-ignore
  const widgetName = __name__ as string;
  const meta = application.getWidgetMeta(widgetName);

  if (meta === null) {
    // error;
    return application;
  }

  application.injectWidget({
    name: widgetName,
    element: widget,
    meta,
    assets: {
      css: {},
      js: {},
    },
  });

  return application;
};
