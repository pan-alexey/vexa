import pretty from 'pretty';
import { Registry } from './components/registry';
// import { data } from './data';
// import { renderApp } from './base';

export class Render {
  public async render() {
    const registry = new Registry();

    const html = await registry.init();
    // const appData = await renderApp(data);
    console.log(pretty(html));
  }
}
