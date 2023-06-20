import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1-dev',
    output: path.resolve(process.cwd(), './dist'),
    debug: {
      httpPort: 8888,
      remotes: {},
      getState: async (params) => {
        return {
          layout: []
        };
      }
    },
  };

  return config;
});
