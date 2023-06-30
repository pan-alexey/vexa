import React from 'react';
import { loadModule } from '../../libs/module/loadModule';
import { getMeta } from '../../../common/component/getMeta';
import { getModuleNames } from '../../../common/component/state';
import type { ComponentMeta } from '../../../common/types';
export interface RegistryProps {
  publicTemplate: string;
  devModuleNames?: Array<string>;
}

export interface Widget {
  name: string;
  props: unknown;
  slots?: Record<string, Widget[]>;
}

export interface ModuleContext {
  useContext: () => unknown;
  Provider: React.FC<{ children: React.ReactNode; props?: unknown }>;
}

export type ModuleWidget = React.ElementType;
export type ModuleType = React.ElementType | ModuleContext;

export interface RegistryComponent {
  name: string;
  module: ModuleType;
  meta: ComponentMeta;
}

export class Registry {
  private publicTemplate: string;
  private devModuleNames: Array<string>;

  private moduleMap: Record<string, RegistryComponent> = {};

  constructor(props: RegistryProps) {
    this.publicTemplate = props.publicTemplate;
    this.devModuleNames = props.devModuleNames || [];
  }

  public getWidget(widgetName: string): RegistryComponent | null {
    const widget = this.moduleMap[widgetName];
    return widget ? widget : null;
  }

  public async prepareWidgets(layout: Widget[]) {
    // const { layout } = state as { layout: Widget[] };
    const names = getModuleNames(layout).filter((name) => !this.devModuleNames.includes(name));
    await this.loadWidgets(names);
  }

  public async loadWidgets(names: Array<string>) {
    const promises: Array<Promise<React.ElementType | null>> = [];
    names.forEach((name) => {
      promises.push(loadModule(name, this.publicTemplate));
    });

    const resolve = await Promise.all(promises);

    resolve.forEach((module, i) => {
      if (module) {
        const name = names[i];
        this.injectWidget(name, module);
      }
    });
  }

  public injectWidget(name: string, module: React.ElementType): void {
    const meta = getMeta(name);
    if (!meta) {
      return;
    }

    this.moduleMap[name] = {
      name,
      meta,
      module,
    };
  }
}
