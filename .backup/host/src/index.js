const { Render } = require('./dist/server');

const render = new Render();

(async () => {
  await render.render();
})();
