import React from 'react';
import pretty from 'pretty';
import { Registry } from './components/registry';
import { Layout } from './components/layout';
import { renderComponent } from './libs/render';
import { getMeta } from '../common/component/getMeta';
// import { data } from './data';
// import { renderApp } from './base';
// export type { RegistryWidget };

export { getMeta };

export interface ApplicationProps {
  remoteUrls: Record<string, string>;
}

// Class Composite.
export class Application {
  public readonly registry: Registry;
  public readonly layout: Layout;

  constructor(props: ApplicationProps) {
    this.registry = new Registry({
      remoteUrls: props.remoteUrls,
    });

    this.layout = new Layout({
      registry: this.registry,
    });
  }

  public async renderBody(state: unknown): Promise<string> {
    return await this.layout.render(state);
  }

  // public async renderWidget(widgetName: string): Promise<string> {
  //   const widget = await this.registry.getWidget(widgetName);
  //   if (widget === null) {
  //     return 'null';
  //   }
  //   const html = await renderComponent(<widget.element />);
  //   return pretty(html);
  // }

  // public registerAssets(): void {
  //   console.log('registerAssets');
  // }
}
