import React from 'react';
import { RemoteWidget } from '../../types';
import { WidgetContext } from '../../types';
import { getWidgetInfo } from '../../common/widget/getInfo';
import { getComponentWidget } from './widgets';
import { makeContext } from './context';
import { renderComponent } from '../render';
import { Context as RootContext } from '../../common/context/root';

const rootContext: WidgetContext = {
  provider: RootContext.Provider,
  hooks: [RootContext.useContext],
};

export const renderWidget = async (widget: RemoteWidget, context: WidgetContext): Promise<string> => {
  const widgetInfo = getWidgetInfo(widget.name);

  if (!widgetInfo) {
    return '';
  }

  if (widgetInfo.type === 'widget') {
    const widgetName = widgetInfo.name;

    const children = widget.children ? await renderWidgets(widget.children, context) : '';

    const item = {
      widgetName,
      context,
      props: widget.props,
      children: <div dangerouslySetInnerHTML={{ __html: children }} />,
    };

    // add context to widget in this;
    const component = await getComponentWidget(item);
    const html = await renderComponent(component);
    return html;
  }

  // Make new context
  if (widgetInfo.type === 'context') {
    const contextName = widgetInfo.name;

    const newContext = makeContext({
      parentContext: context,
      currentContext: {
        name: contextName,
        props: widget.props,
      },
    });

    const newResult: string = widget.children ? await renderWidgets(widget.children, newContext) : '';
    return newResult;
  }

  return '';
};

export const renderWidgets = async (widgets: RemoteWidget[], context: WidgetContext): Promise<string> => {
  const promises: Array<string> = await Promise.all(widgets.map((widget) => renderWidget(widget, context)));
  return promises.join('');
};

export const renderApp = (widgets: RemoteWidget[]) => {
  return renderWidgets(widgets, rootContext);
};
