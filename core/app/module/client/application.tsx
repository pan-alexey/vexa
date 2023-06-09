import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';


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
        const Component = this.getWidget(widgetName);

        return <React.Fragment key={i}>{Component}</React.Fragment>
      })
    }</>
  };

  public getWidget(name: string): React.ReactElement {
    const Widget = this.widgets[name];

    if (Widget) {
      return <Widget />
    }
    return <div>Component {name} not found</div>
  }

  public BaseWidget: React.FC<{}> = () => {
    const Widget = this.widgets['widget.cms.navbar@1-dev'];
    return Widget ? <Widget /> : null;
  }
}