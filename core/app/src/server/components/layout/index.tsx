import React from 'react';
import { Registry } from '../registry';
// import { getAllWidgetNames } from './components/state';
import { renderComponent } from '../../libs/render';
import { getUniqueId } from '../../libs/utils/uniqid';
import { makeWidget } from './widget';
export interface Widget {
  name: string;
  props: unknown;
}

export interface LayoutProps {
  registry: Registry;
}

// Create custom tags, for create widget without wrapper tags
// const HTMLCustomTag = 'HTMLCustomTag';
// const clearCustomTags = (html: string): string => {
//   return html.replace(/<HTMLCustomTag>/g, '').replace(/<HTMLCustomTag>/g, '');
// };
// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace JSX {
//     interface IntrinsicElements {
//       [HTMLCustomTag]: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
//     }
//   }
// }

export class Layout {
  private registry: Registry;
  constructor(props: LayoutProps) {
    this.registry = props.registry;
  }

  public async renderHead(state: unknown) {
    return '';
  }

  public async render(state: unknown): Promise<string> {
    const { layout } = state as { layout: Widget[] };
    // Start render
    const Body = await this.renderWidgetList(layout);
    const html = await renderComponent(Body);
    // Stop render

    return html;
  }

  public async renderWidgetList(widgets: Widget[]): Promise<React.ReactElement> {
    const promises: Array<Promise<React.ReactElement>> = [];
    for (let i = 0; i < widgets.length; i++) {
      const widget = widgets[i];
      const element = this.renderWidget(widget.name, widget.props);
      promises.push(element);
    }
    const elements = await Promise.all(promises);
    return (
      <>
        {elements.map((element) => {
          return <React.Fragment key={getUniqueId()}>{element}</React.Fragment>;
        })}
      </>
    );
  }

  public async renderWidget(name: string, props: unknown): Promise<React.ReactElement> {
    const widget = await this.registry.getWidget(name);

    if (widget === null) {
      return (
        <div data-widget-name={name} style={{ display: 'none' }}>
          Widget not render (widget registry problem)
        </div>
      );
    }

    if (widget.meta.type === 'context') {
      console.log(widget.module);

      return (
        <div data-widget-name={name} style={{ display: 'none' }}>
          Widget not render (is context type)
        </div>
      );
    }

    // use custom trycatch
    try {
      const Component = makeWidget(widget.module as React.ElementType, props);
      const html = await renderComponent(Component);
      return <div data-widget-name={name} dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (error) {
      console.log('error', error);
      // track render error

      return (
        <div
          style={{ display: 'none' }}
          data-widget-name={name}
          dangerouslySetInnerHTML={{ __html: 'Widget not render (render problem)' }}
        />
      );
    }
  }
}
