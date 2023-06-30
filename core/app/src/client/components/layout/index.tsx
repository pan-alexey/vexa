import React from 'react';

import type { Widget } from '../../../common/types';
import { getUniqueId } from '../../../common/utils/uniqid';
import { makeRootContext, makeContext } from './component/context';
import { makeWidget } from './component/widget';
import type { Context } from './component/context';
import type { Registry, ModuleContext } from '../registry';
export interface LayoutProps {
  registry: Registry;
}

export class Layout {
  private registry: Registry;
  constructor(props: LayoutProps) {
    this.registry = props.registry;
  }

  public async make(state: unknown): Promise<React.ReactElement> {
    console.log('layout', state);
    const { layout } = state as { layout: Widget[] };
    await this.registry.prepareWidgets(layout);

    const rootContext: Context = makeRootContext();
    return this.makeWidgetList(layout, rootContext);
  }

  private makeWidgetList(widgets: Widget[], context: Context): React.ReactElement {
    return (
      <>
        {widgets.map((widget) => {
          const component = this.makeElement({
            name: widget.name,
            props: widget.props,
            slots: widget.slots || {},
            context,
          });

          return <React.Fragment key={getUniqueId()}>{component}</React.Fragment>;
        })}
      </>
    );
  }

  private makeElement({
    name,
    props,
    slots = {},
    context,
  }: {
    name: string;
    props: unknown;
    slots: Record<string, Widget[]>;
    context: Context;
  }): React.ReactElement {
    const module = this.registry.getWidget(name);

    if (module === null) {
      return (
        <div data-module-name={name} style={{ display: 'none' }}>
          Module not render (widget registry problem)
        </div>
      );
    }

    if (module.meta.type === 'widget') {
      const widgetSlots: Record<string, React.ReactElement> = {};
      Object.keys(slots).forEach((key) => {
        widgetSlots[key] = this.makeWidgetList(slots[key], context);
      });

      return makeWidget({
        element: module.module as React.ElementType,
        props,
        context,
        slots: widgetSlots,
      });
    }

    if (module.meta.type === 'context') {
      const children = slots.children;
      if (children === undefined) {
        return <div data-module-name={name}>Context not render (context don't has children slots)</div>;
      }

      // const newContext = makeContext({
      //   name: module.name,
      //   parentContext: context,
      //   module: module.module as ModuleContext,
      //   props: props,
      // });

      return <div>Context {module.name}</div>;
    }

    return <div>Module {name} not render (unknown module type)</div>;
  }
}
