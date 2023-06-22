import React from 'react';
import pretty from 'pretty';
import { Registry, RegistryWidget } from './components/registry';
import { renderComponent } from './libs/render';
import { getWidgetMeta } from '../common/widget/getWidgetMeta';
// import { data } from './data';
// import { renderApp } from './base';

export type { RegistryWidget };
export interface ApplicationProps {
  remoteUrls: Record<string, string>;
}

export class Application {
  private registry: Registry;

  constructor(props: ApplicationProps) {
    this.registry = new Registry({
      remoteUrls: props.remoteUrls,
    });
  }

  public getWidgetMeta = getWidgetMeta;

  public async clearRegistry() {
    await this.registry.clear();
  }

  public getRegistryInstance() {
    return this.registry;
  }

  public async renderWidget(widgetName: string): Promise<string> {
    const widget = await this.registry.getWidget(widgetName);

    if (widget === null) {
      return 'null';
    }

    const html = await renderComponent(<widget.element />);

    return pretty(html);
  }

  public injectWidget(widget: RegistryWidget) {
    this.registry.injectWidget(widget);
  }

  public registerAssets() {};
}
