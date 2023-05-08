import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

export default config(async () => {
  const config: Config = {
    name: 'widget1',
    output: path.resolve(process.cwd(), './dist'),
    debug: {
      httpPort: 8888,
      getState: async (params) => {
        console.log('params', params.url);
        return null;
      }
    },
  };

  return config;
});
