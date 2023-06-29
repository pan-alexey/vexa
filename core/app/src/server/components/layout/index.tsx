import React from 'react';
import type { Registry, ModuleContext, RegistryComponent } from '../registry';
import { makeRootContext, makeContext } from './components/context';
import { getModuleNames } from './components/state';
import { renderComponent } from '../../libs/render';
import { getUniqueId } from '../../libs/utils/uniqid';
import { promiseAllKeys } from '../../../common/utils/promises';
import { makeWidget } from './components/widget';
import type { Context } from './components/context';
import { resolvePublic } from './helpers/resolvePublic';

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

  // For remote modules module;
  public async renderHead({
    state,
    ignoreModuleNames = [],
    publicTemplate,
  }: {
    state: unknown;
    ignoreModuleNames?: Array<string>;
    publicTemplate: string;
  }): Promise<{
    js: Array<string>;
    css: Record<string, string>;
  }> {
    const { layout } = state as { layout: Widget[] };
    const names = getModuleNames(layout);

    const promises: Array<Promise<RegistryComponent | null>> = [];
    names.forEach((name) => {
      promises.push(this.registry.getWidget(name));
    });
    const results = await Promise.all(promises);

    const assetsJs: Array<string> = [];
    const assetCss: Record<string, string> = {};

    results.forEach((module) => {
      if (module === null) {
        return;
      }
      const { name, assets } = module;
      // need to dev
      if (ignoreModuleNames.includes(name)) {
        return;
      }

      console.log('ignoreModuleNames', ignoreModuleNames, name, ignoreModuleNames.includes(name));
      // collect js
      assetsJs.push(resolvePublic(publicTemplate, { name, asset: assets.jsModule }));

      Object.keys(assets.css).forEach((key) => {
        const url = resolvePublic(publicTemplate, { name, asset: key });
        assetCss[url] = assets.css[key];
      });
    });

    return {
      js: assetsJs,
      css: assetCss,
    };
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

  public async renderSlots(
    slots: Record<string, Widget[]>,
    context: Context,
  ): Promise<Record<string, React.ReactElement>> {
    const promiseKeys: Record<string, Promise<React.ReactElement>> = {};

    Object.keys(slots).forEach((key) => {
      promiseKeys[key] = this.renderWidgetList(slots[key], context);
    });
    return await promiseAllKeys(promiseKeys);
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
      let widgetSlots: Record<string, React.ReactElement> = {};
      try {
        widgetSlots = await this.renderSlots(slots, context);
      } catch (error) {
        console.log('Error slots render', error);
      }

      try {
        const Component = makeWidget({
          element: module.module as React.ElementType,
          props,
          context,
          slots: widgetSlots,
        });
        const html = await renderComponent(Component);
        return <div data-module-name={name} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (error) {
        console.log('Error widget render', error);
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
