import React from 'react';
import { WidgetWrapper } from './entities/widget';

export interface WidgetProps {}

export class Application {
  private widgets: Record<string, React.ElementType> = {};

  public registerDevWidget(name:string, widget: React.ElementType) {
    this.widgets[name] = widget;
  }

  public getLayout(widgets: Array<unknown>): React.ReactElement {
    // Запихнуть все в контекст
    return <>{
      widgets.map((widget, i) => {
        const { widgetName } = widget as {widgetName: string};

        // @ts-ignore
        const widgetSlots: Record<string, unknown> = widget.slots || {};
        const slots: Record<string, React.ReactElement>  = {};

        Object.keys(widgetSlots).forEach((key) => {
          const slotWidgets = widgetSlots[key] as Array<unknown>;
          slots[key] = <div>{this.getLayout(slotWidgets)}</div>
        });

        const Component = this.getWidget(widgetName, {slots});

        return <React.Fragment key={i}>{Component}</React.Fragment>
      })
    }</>
  };

  public getWidget(name: string, props: Record<string, unknown>): React.ReactElement {
    const Widget = this.widgets[name];

    if (Widget) {
      return <WidgetWrapper widgetName={name}><Widget {...props}/></WidgetWrapper>
    }

    return <React.Fragment />;
  }
}