import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1-dev',
    debug: {
      httpPort: 8889,
      remotes: {
        '*': 'http://127.0.0.1:9000/{name}/widget.tgz',
        "widget.cms.navbar@2-dev": "http://127.0.0.1:8880/_static_/widget.tgz"
      },
      getState: async (params) => {
        return {
          layout: []
        };
      }
    },
  };

  return config;
});
