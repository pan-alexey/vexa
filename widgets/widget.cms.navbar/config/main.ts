import config from '@vexa/cli';
import path from 'path';
import type { Config } from '@vexa/cli';

// const config = {
//   name: 'widget.cms.navbar@1-dev',
//   output: path.resolve(process.cwd(), './dist'),
//   debug: {
//     remotes: {
//       "*": 'https://remotehost/cdn/{name}/widget.tgz', // default
//       "widget.cms.navbar@1-dev": 'http://127.0.0.1:8080/__widget__/widget.tgz',
//     },
//     layout: [
//       {
//         widgetName: 'widget.cms.navbar@1-dev', // auto resolve dev widget
//       },
//       {
//         widgetName: 'widget.cms.navbar@1-dev',
//       },
//     ]
//   }
// }

export default config(async () => {
  const config: Config = {
    name: 'widget.cms.navbar@1-dev',
    output: path.resolve(process.cwd(), './dist'),
    debug: {
      httpPort: 8888,
      getState: async (params) => {
        return {
          layout: [
            // {
            //   widgetName: 'widget.cms.navbar@1-dev',
            //   slots: {
            //     slot1: [{
            //       widgetName: 'widget.cms.navbar@1-dev',
            //       remotePath: 'http://127.0.0.1:8881/_widget_/widget.tgz',
            //     }],
            //     slot2: [{
            //       widgetName: 'widget.cms.navbar@1-dev',
            //       remotePath: ' http://127.0.0.1:8881/_widget_/widget.tgz',
            //     }]
            //   }
            // },
            // {
            //   widgetName: 'context.core.router@1-dev',
            //   remotePath: ' http://127.0.0.1:8881/_widget_/widget.tgz',
            // },
            // {
            //   widgetName: 'widget.cms.navbar@1-dev',
            // }
          ]
        };
      }
    },
  };

  return config;
});
