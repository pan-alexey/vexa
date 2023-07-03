import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';
import dotenv from 'dotenv';

export default config(async () => {
  const config: Config = {
    name: 'context.cms.main@1',
    publish: async () => {
      dotenv.config();
      return {
        BUCKET_NAME: process.env.BUCKET_NAME || '',
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || '',
        S3_ENDPOINT: process.env.S3_ENDPOINT || '',
        S3_ENDPOINT_PORT: process.env.S3_ENDPOINT_PORT || '',
        S3_SECRET_KEY: process.env.S3_SECRET_KEY || '',
      };
    },
    debug: {
      httpPort: 8001,
      remotes: {
        '*': 'http://127.0.0.1:9000/{name}/widget.tgz',
        // 'widget.cms.navbar@1-dev': 'http://127.0.0.1:8888/_static_/widget.tgz'
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
