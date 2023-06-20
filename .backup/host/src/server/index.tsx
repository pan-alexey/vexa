import pretty from 'pretty';
import { data } from './data';
import { renderApp } from './base';

export class Render {
  public async render() {
    const appData = await renderApp(data);

    console.log(pretty(appData));
  }
}
