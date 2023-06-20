import React from 'react';
import { getWidget1, getWidget2 } from '../module/index';
// import { Widget3 } from '../components/widget-3';

const NotFound: React.FC = () => {
  return <div>NotFound</div>;
};

// interface WidgetRegistryProps {
//   widgets?: Array<{ name: string; widget: React.ElementType }>;
// }

export class WidgetRegistry {
  private elements: Record<string, React.ElementType> = {};

  public initLocalWidgets(widgets: Array<{ name: string; widget: React.ElementType }> = []) {
    // register core widgets
    widgets.forEach(({ name, widget }) => {
      this.elements[name] = widget;
    });
  }

  public async init(): Promise<void> {
    this.elements['widget1'] = await getWidget1();
    // this.elements['widget2'] = await getWidget2();
    // this.elements['widget3'] = Widget3;
  }

  public get(name: string): React.ElementType {
    if (this.elements[name]) {
      return this.elements[name];
    }

    const component: React.ElementType = NotFound;

    return component;
  }
}

export const registry = new WidgetRegistry();
