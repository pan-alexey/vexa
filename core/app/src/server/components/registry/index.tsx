import React from 'react';
import path from 'path';
import { widgetsPath } from '../../constants';
import { getMeta } from '../../../common/component/getMeta';
import { downloadModule } from '../../libs/download/downloadModule';
import { loadModule } from '../../libs/module/loadModule';
import type { ComponentMeta } from '../../../common/types';
import { resolveTemplateUrls } from './helpers';

export interface ModuleContext {
  useContext: () => unknown;
  Provider: React.FC<{ children: React.ReactNode; props?: unknown }>;
}

export type ModuleWidget = React.ElementType;

export type ModuleType = React.ElementType | ModuleContext;

export interface RegistryComponent {
  name: string;
  module: ModuleType;
  requirePath?: string; // undefined if widget type is debug or core
  meta: ComponentMeta;
  assets: {
    css: Record<string, string>;
    js: Record<string, string>;
  };
}

export interface RegistryProps {
  remoteUrls: Record<string, string>;
}

export class Registry {
  private remoteUrls: Record<string, string>;
  private moduleMap: Record<string, RegistryComponent> = {};

  constructor(props: RegistryProps) {
    this.remoteUrls = props.remoteUrls;
  }

  public injectWidget(widget: RegistryComponent) {
    this.moduleMap[widget.name] = widget;
  }

  public async getWidget(widgetName: string): Promise<RegistryComponent | null> {
    if (this.moduleMap[widgetName]) {
      return this.moduleMap[widgetName];
    }

    await this.loadWidget(widgetName);
    const widget = this.moduleMap[widgetName];
    return widget ? widget : null;
  }

  public async loadWidget(widgetName: string): Promise<boolean> {
    if (this.moduleMap[widgetName]) {
      return true;
    }

    const meta = getMeta(widgetName);
    if (meta === null) {
      // track error here
      return false;
    }

    const remoteUrlTemplate = this.remoteUrls[widgetName] ? this.remoteUrls[widgetName] : this.remoteUrls['*'];

    if (!remoteUrlTemplate) {
      // track error here
      return false;
    }

    try {
      const remoteUrl = resolveTemplateUrls(remoteUrlTemplate, widgetName);
      const { module, requirePath } = await this.downloadWidget(widgetName, remoteUrl);
      const widget: RegistryComponent = {
        name: widgetName,
        module: module as ModuleType,
        requirePath,
        meta,
        assets: {
          css: {},
          js: {},
        },
      };
      this.injectWidget(widget);
      return true;
    } catch (error) {
      console.log('error loadWidget', error);
      // track error here
    }

    return false;
  }

  private async downloadWidget(
    widgetName: string,
    remoteUrl: string,
  ): Promise<{ module: unknown; requirePath: string }> {
    const downloadPath = path.resolve(widgetsPath, widgetName);
    const requirePath = path.resolve(downloadPath, './server');

    await downloadModule(remoteUrl, downloadPath);
    const module = await loadModule(requirePath);

    return {
      requirePath,
      module,
    };
  }

  public getWidgetRequireCacheList(): Array<string> {
    const result: Array<string> = [];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.keys(__non_webpack_require__.cache).forEach((element) => {
      if (element.includes(widgetsPath)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result.push(__non_webpack_require__.resolve(element));
      }
    });

    return result;
  }

  public async clear() {
    const requireCache = this.getWidgetRequireCacheList();
    console.log('clear req', widgetsPath);

    // clear all cache
    requireCache.forEach((requirePath) => {
      if (requirePath.includes(widgetsPath)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete __non_webpack_require__.cache[requirePath];
      }
    });

    Object.keys(this.moduleMap).forEach((key) => {
      const widget = this.moduleMap[key];
      if (!widget.requirePath) {
        return;
      }
      delete this.moduleMap[key];
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
