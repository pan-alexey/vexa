/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import widget from '~widget'; // import widget with use alias
import { Application, getMeta } from '@vexa/core-app/src/server'; // !!!! todo build component
import type { Config } from '@vexa/cli-config';

export const getApplication = (config: Config) => {
  const application = new Application({
    remoteUrls: config.debug.remotes,
  });

  // @ts-ignore
  const widgetName = __name__ as string;
  const meta = getMeta(widgetName);

  if (meta === null) {
    // error;
    return application;
  }

  application.registry.injectWidget({
    name: widgetName,
    module: widget,
    meta,
    assets: {
      css: {},
      js: {},
    },
  });

  return application;
};
