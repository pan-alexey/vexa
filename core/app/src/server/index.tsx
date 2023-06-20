import pretty from 'pretty';
import { Registry } from './components/registry';
// import { data } from './data';
// import { renderApp } from './base';

export class Render {
  public async render() {
    const registry = new Registry();

    await registry.loadWidget('widget.cms.navbar@1-dev', 'http://127.0.0.1:8888/_static_/widget.tgz');

    // const html = await registry.init();
    // const appData = await renderApp(data);
    // console.log(pretty(html));
  }
}
