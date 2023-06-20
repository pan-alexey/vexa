import { Application, Tracker } from '@vexa/core-app';

class AppTracker extends Tracker {}

const app = new Application({
  tracker: new AppTracker(),
  publicPath: {
    host: 'http://127.0.0.1/assets/app/',
    widget: 'http://127.0.0.1/assets/widget/{name}',
  },
  remotePath: {
    '*': 'http://127.0.0.1/assets/app/',
    'widget.cms.navbar@1-dev': 'http://127.0.0.1:8888/_widget_/widget.tgz',
  },
});

const run = async () => {
  await app.init(); // init local assets;

  const hostClientPath = app.getHostClientPath();
  const hostCss = Object.keys(app.getHostCss());
  const hostJs = Object.keys(app.getHostJs());

  const registry = app.getRegistry();

  console.log('registry', registry);

  // await registry.prepareWidget('widget.cms.navbar@1-dev');

  const widget = await app.renderWidget('widget.cms.navbar@1-dev');

  console.log('widget', widget);
  // console.log('hostClientPath', hostClientPath);
  // console.log('assets css', hostCss);
  // console.log('assets js', hostJs);
};

run();
// console.log(app);
