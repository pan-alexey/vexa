import config from '@vexa/cli';
import type { Config } from '@vexa/cli';
import dotenv from 'dotenv';

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1',
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
      httpPort: 9001,
      remotes: {
        '*': 'https://cdn.webpan.org/cdn/{name}/widget.tgz',
      },
      getState: async (params) => {
        return {
          layout: [
            {
              name: 'context.cms.main@1',
              props: {
                props: 'lvl1',
              },
              slots: {
                children: [
                  { name: 'widget.cms.navbar@1', props: { data: 'data', reqParam: params } },
                  { name: 'widget.cms.navbar@3', props: { data: 'data', reqParam: params } },
                  { name: 'widget.cms.navbar@1', props: { data: 'data', reqParam: params } },
                  {
                    name: 'widget.cms.navbar@1',
                    props: {
                      props: 'props: widget.cms.navbar@1',
                      reqParam: params,
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
                      props: 'lvl2',
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
                ]
              }
            },
          ],
        };
      },
    },
  };

  return config;
});
