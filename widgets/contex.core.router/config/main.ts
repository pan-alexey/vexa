import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

export default config(async () => {
  const config: Config = {
    name: 'contex.core.router@1-dev',
    output: path.resolve(process.cwd(), './dist'),
    debug: {
      httpPort: 8888,
      getState: async (params) => {
        console.log('params', params.url);
        return {
          layout: [
            {
              widgetName: 'widget.cms.navbar',
            },
            {
              widgetName: 'contex.core.router@1-dev',
            }
          ]
        };
      }
    },
  };

  return config;
});
