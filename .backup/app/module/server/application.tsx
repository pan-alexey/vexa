import React from 'react';
import { parseWidgetName } from '../common/widget';
import { Registry } from './components/registry';
import { Tracker } from './components/tracker';
import { Layout } from './components/layout';

//----//
import { renderComponent } from './libs/render';

export interface ApplicationProps {
  tracker: Tracker;
  /* for browser */
  publicPath: {
    widget: string;
    host: string;
  },
  /* For backend */
  remotePath: Record<string, string>;
}

export class Application {
  private registry: Registry;
  private tracker: Tracker;
  private layout: Layout;

  private publicPath: {
    widget: string;
    host: string;
  };

  constructor(props: ApplicationProps) {
    this.publicPath = props.publicPath;
    this.tracker = props.tracker;
    // this.remotePath = props.remotePath;

    this.registry = new Registry({
      tracker: this.tracker,
      remotePath: props.remotePath,
    });

    this.layout = new Layout({
      tracker: this.tracker,
      registry: this.registry
    });
  }

  public registerDevWidget(name:string, component: React.ElementType) {
    const meta = parseWidgetName(name);
    if (meta === null) {
      return ;
    }
    this.registry.registerWidget({
      name: name,
      component: component,
      meta,
      assets: {
        css: {},
        js: {},
      }
    });
  }


  public getRegistry(): Registry {
    return this.registry;
  }

  public async renderWidget(name: string): Promise<string> {
    const registry = this.registry;

    const widget = await this.registry.getWidget(name);

    if (widget === null) {
      return 'null';
    }

    const Component = widget.component;

    
    console.log('Component', <Component></Component>);

    const html = await renderComponent(<><Component/></>);

    return html;
    // return await renderComponent(<Component />);
  }

  public async prepareWidget() {
    // this.registry.prepareWidget()
  }

  public async renderStyle() {}

  public async renderScript() {}

  public async renderLayout() {
    const html = await this.layout.render();

    return html;
  }

  // public abstract init(): Promise<BuilderState>;
};