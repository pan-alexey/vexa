import React from 'react';
import { parseWidgetName } from '../common/widget';
import { WidgetRegistry } from './entities/registry';
import { Tracker } from './entities/tracker';
import { renderComponent } from './libs/render';
export { Tracker };

export interface ApplicationProps {
  resolvePublic: (name: string, asset: string) => string;
  tracker: Tracker;
}

export interface Widget {
  name: string;
}

export const renderWidgets = async (widgets: Widget[]): Promise<string> => {
  const promises: Array<string> = await Promise.all(widgets.map((widget) => renderWidget(widget, context)));
  return promises.join('');
};

export class Application {
  private resolvePublic: (name: string, asset: string) => string;
  private registry: WidgetRegistry;
  private tracker: Tracker;

  constructor(props: ApplicationProps) {
    this.resolvePublic = props.resolvePublic;
    this.tracker = props.tracker;
    this.registry = new WidgetRegistry({
      tracker: this.tracker,
    });
  }

  public registerDevWidget(name:string, widget: React.ElementType) {
    const meta = parseWidgetName(name);
    if (meta) {
      this.registry.registerWidget({
        name,
        component: widget,
        meta,
      })
    }
  }

  public async layout(widgets: Array<unknown>) {
    return await this.renderWidgets(widgets);
  }

  private async renderWidgets(widgets: Array<unknown>) {
    const promises: Array<string> = await Promise.all(widgets.map((widget) => this.renderWidgetByName(widget)));

    return promises.join('');
  }

  private async renderWidgetByName(widget: unknown) {
    const { widgetName } = widget as { widgetName: string }
    const component = await this.getComponentWidget(widgetName);
    const html = await renderComponent(component);
    return html;
  }


  private getComponentWidget = async (name: string): Promise<React.ReactElement> => {
    const widget = this.registry.getWidget(name);
    if (widget === null) {
      return <div>Component {name} not found</div>;
    }

    const Component = widget.component;

    return <><Component /></>;
  };
};