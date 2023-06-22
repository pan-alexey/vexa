const { Application, getWidgetMeta } = require('../dist/server');

const application = new Application({
  remoteUrls: {
    'widget.cms.navbar@1': 'http://127.0.0.1:9001/_static_/widget.tgz',
    'widget.cms.navbar@2': 'http://127.0.0.1:9002/_static_/widget.tgz',
    'widget.cms.navbar@3': 'http://127.0.0.1:9003/_static_/widget.tgz',
  },
});

(async () => {
  const widget1 = await application.renderWidget('widget.cms.navbar@1');
  console.log('widget1:');
  console.log(widget1);

  const widget2 = await application.renderWidget('widget.cms.navbar@2');
  console.log('widget2:');
  console.log(widget2);

  const widget3 = await application.renderWidget('widget.cms.navbar@3');
  console.log('widget3:');
  console.log(widget3);
})();
