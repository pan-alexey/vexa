import React from 'react';
import type { Registry, ModuleContext } from '../registry';
import { makeRootContext, makeContext } from './context';
// import { getAllWidgetNames } from './components/state';
import { renderComponent } from '../../libs/render';
import { getUniqueId } from '../../libs/utils/uniqid';

import { makeWidget } from './widget';
import type { Context } from './context';

export interface Widget {
  name: string;
  props: unknown;
  slots?: Record<string, Widget[]>;
}

export interface LayoutProps {
  registry: Registry;
}

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
    const rootContext: Context = makeRootContext();
    const Body = await this.renderWidgetList(layout, rootContext);
    const html = await renderComponent(Body);
    // Stop render

    return html;
  }

  public async renderWidgetList(widgets: Widget[], context: Context): Promise<React.ReactElement> {
    const promises: Array<Promise<React.ReactElement>> = [];
    for (let i = 0; i < widgets.length; i++) {
      const { name, props, slots = {} } = widgets[i];
      const element = this.renderWidget({ name, props, slots, context });
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

  public async renderWidget({
    name,
    props,
    slots = {},
    context,
  }: {
    name: string;
    props: unknown;
    slots: Record<string, Widget[]>;
    context: Context;
  }): Promise<React.ReactElement> {
    const module = await this.registry.getWidget(name);

    if (module === null) {
      return (
        <div data-module-name={name} style={{ display: 'none' }}>
          Module not render (widget registry problem)
        </div>
      );
    }

    if (module.meta.type === 'widget') {
      // use custom trycatch
      try {
        const Component = makeWidget(module.module as React.ElementType, props, context);
        const html = await renderComponent(Component);
        return <div data-module-name={name} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (error) {
        console.log('error!!!', error);
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

    if (module.meta.type === 'context') {
      const children = slots.children;
      if (children === undefined) {
        return <div data-module-name={name}>Context not render (context don't has children slots)</div>;
      }

      const newContext = makeContext({
        name: module.name,
        parentContext: context,
        module: module.module as ModuleContext,
        props: props,
      });

      return await this.renderWidgetList(children, newContext);
    }

    return <div>Module {name} not render (unknown module type)</div>;
  }
}
