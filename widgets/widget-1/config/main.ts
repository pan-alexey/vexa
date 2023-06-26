import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

const state = {
  layout: [],
};

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1',
    debug: {
      httpPort: 9001,
      remotes: {
        '*': 'http://127.0.0.1:9000/{name}/widget.tgz',
        'widget.cms.navbar@2': 'http://127.0.0.1:9002/_static_/widget.tgz',
        'widget.cms.navbar@3': 'http://127.0.0.1:9003/_static_/widget.tgz',
        'context.cms.main@1': 'http://127.0.0.1:8001/_static_/widget.tgz',
      },
      getState: async (params) => {
        return {
          layout: [
            { name: 'widget.cms.navbar@1', props: { data: 'data' } },
            { name: 'widget.cms.navbar@3', props: { data: 'data' } },
            { name: 'widget.cms.navbar@1', props: { data: 'data' } },
            { name: 'widget.cms.navbar@2', props: { data: 'data' } },
            {
              name: 'context.cms.main@1',
              props: { props: 'props1' },
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
