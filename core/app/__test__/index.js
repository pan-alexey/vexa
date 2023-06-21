const { Application } = require('../dist/server');

const application = new Application({
  remoteUrls: {
    '*': 'http://127.0.0.1:9000',
    'widget.cms.navbar@1-dev': 'http://127.0.0.1:8889/_static_/widget.tgz',
    'widget.cms.navbar@2-dev': 'http://127.0.0.1:8880/_static_/widget.tgz',
  },
});

(async () => {
  const widget1 = await application.renderWidget('widget.cms.navbar@1-dev');
  console.log('widget1:');
  console.log(widget1);

  const widget2 = await application.renderWidget('widget.cms.navbar@2-dev');
  console.log('widget2:');
  console.log(widget2);
})();
