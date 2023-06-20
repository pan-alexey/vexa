const path = require('path');
const vexa = require('../dist/server/index');

const http = require("http");
const host = 'localhost';
const port = 8000;

const application = new vexa.Application({
  publicPath: {
    host: 'http://127.0.0.1/assets/app/',
    widget: 'http://127.0.0.1/assets/widget/{name}',
  },
  remotePath: {
    '*': 'http://127.0.0.1/assets/app/',
    'widget.cms.navbar@1-dev': 'http://127.0.0.1:8888/_widget_/widget.tgz',
  },
  // registryCachePath: path.resolve(process.cwd(), './node_modules/.cache'),
});

(async () => {
  const html = await application.renderWidget('widget.cms.navbar@1-dev');

  console.log(html);
})();



// const registry = application.getWidgetRegistry();
// (async () => {
//   const requestListener = function (req, res) {
//     res.write(`<!DOCTYPE html>`);

//     res.write(`
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>MF</title>
//     `);

//     registry.prepareWidget({
//       name: 'widget.cms.navbar@1-dev',
//       remotePath: 'http://127.0.0.1:8888/_widget_/widget.tgz'
//     })
//     .then(() => {
//       const styles = application.renderStyles(['widget.cms.navbar@1-dev']);
//       Object.keys(styles).forEach((key) => {
//         res.write(`<style data-url="${key}">${styles[key]}</style>`);
//       })
//     })
//     .then(() => {
//       res.write(`</head>`);
//     })
//     .then(() => {
//       return new Promise((res) => setTimeout(res, 1_000))
//     }).
//     then(() => {
//       const widget = registry.getWidget('widget.cms.navbar@1-dev');
//       if (widget) {
//         application.renderWidget(widget).then((html) => {
//           res.write(html);
//           res.end(`</html>`);
//         });
//       } else {
//         res.end(`</html>`);
//       }
//     })
//   };

//   const server = http.createServer(requestListener);
//   server.listen(port, host, () => {
//       console.log(`Server is running on http://${host}:${port}`);
//   });
// })();
