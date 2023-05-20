const path = require('path');
const vexa = require('../dist/server/index');

const render = new vexa.Render({
  registryCachePath: path.resolve(process.cwd(), './node_modules/.cache'),
});

const registry = render.getRegistryInstance();


(async () => {
  const res = await registry.loadWidget({
    name: 'test',
    remotePath: 'http://127.0.0.1:8888/_widget_/widget.tgz' // 'http://127.0.0.1:8080/_widget_/widget.tgz'
  });
})()
console.log(registry);