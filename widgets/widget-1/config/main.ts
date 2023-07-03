import config from '@vexa/cli';
import type { Config } from '@vexa/cli';
import dotenv from 'dotenv';

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1',
    publish: async () => {
      dotenv.config();

      return {
        BUCKET_NAME: 'panda',
        MINIO_ACCESS_KEY: 'xpa0HDuMiwXWQuZO',
        MINIO_ENDPOINT: '194.61.0.202',
        MINIO_ENDPOINT_PORT: '8080',
        MINIO_SECRET_KEY: '1yh9A3uzRHVbvrM6kHGVH846x8PsZtHJ',
      };
    },
    debug: {
      httpPort: 9001,
      remotes: {
        '*': 'http://127.0.0.1:9000/{name}/widget.tgz',
        'widget.cms.navbar@2': 'http://127.0.0.1:9002/_static_/widget.tgz',
        'widget.cms.navbar@3': 'http://127.0.0.1:9003/_static_/widget.tgz',
        'context.cms.main@1': 'http://127.0.0.1:8001/_static_/widget.tgz',
      },
      getState: async (params) => {
        console.log('params', params);

        return {
          layout: [
            { name: 'widget.cms.navbar@1', props: { data: 'data' } },
            { name: 'widget.cms.navbar@3', props: { data: 'data' } },
            { name: 'widget.cms.navbar@1', props: { data: 'data' } },
            {
              name: 'widget.cms.navbar@1',
              props: {
                props: 'props: widget.cms.navbar@1',
              },
              slots: {
                slots1: [
                  { name: 'widget.cms.navbar@1', props: { data: 'data' } },
                  { name: 'widget.cms.navbar@3', props: { data: 'data' } },
                ],
                slots2: [
                  { name: 'widget.cms.navbar@2', props: { data: 'data' } },
                  { name: 'widget.cms.navbar@3', props: { data: 'data' } },
                ],
              },
            },
            { name: 'widget.cms.navbar@2', props: { data: 'data' } },
            {
              name: 'context.cms.main@1',
              props: {
                props: 'props1',
              },
              slots: {
                children: [
                  { name: 'widget.cms.navbar@1', props: { data: 'data' } },
                  { name: 'widget.cms.navbar@3', props: { data: 'data' } },
                  { name: 'widget.cms.navbar@1', props: { data: 'data' } },
                  { name: 'widget.cms.navbar@2', props: { data: 'data' } },
                ],
              },
            },
          ],
        };
      },
    },
  };

  return config;
});
