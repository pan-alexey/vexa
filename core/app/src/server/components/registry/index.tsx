import React from 'react';
import path from 'path';
import { widgetsPath } from '../../constants';
import { getMeta } from '../../../common/component/getMeta';
import { downloadModule } from '../../libs/download/downloadModule';
import { loadModule } from '../../libs/module/loadModule';
import { loadManifest } from '../../libs/module/loadManifest';
import type { ComponentMeta } from '../../../common/types';
import { resolveTemplateUrls } from './helpers';
import type { Widget } from '../../../common/types';
import { getModuleNames } from '../../../common/component/state';

export interface ModuleContext {
  useContext: () => unknown;
  Provider: React.FC<{ children: React.ReactNode; props?: unknown }>;
}

export type ModuleWidget = React.ElementType;
export type ModuleType = React.ElementType | ModuleContext;

export interface RegistryComponent {
  name: string;
  module: ModuleType;
  requirePath: string;
  meta: ComponentMeta;
  assets: {
    jsModule: string;
    css: Record<string, string>;
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

  public async getWidget(widgetName: string): Promise<RegistryComponent | null> {
    const widget = this.moduleMap[widgetName];
    return widget ? widget : null;
  }

  private injectWidget(widget: RegistryComponent) {
    this.moduleMap[widget.name] = widget;
  }

  public async prepareWidgets(layout: Widget[]): Promise<void> {
    const names = getModuleNames(layout);

    const promises = names.map((name) => {
      return this.loadWidget(name);
    });

    await Promise.all(promises);
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

      const { module, requirePath, assets } = await this.downloadWidget(widgetName, remoteUrl);
      const widget: RegistryComponent = {
        name: widgetName,
        module: module as ModuleType,
        requirePath,
        meta,
        assets,
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
  ): Promise<{
    module: unknown;
    requirePath: string;
    assets: {
      jsModule: string;
      css: Record<string, string>;
    };
  }> {
    const downloadPath = path.resolve(widgetsPath, widgetName);
    const requirePath = path.resolve(downloadPath, './server');
    await downloadModule(remoteUrl, downloadPath);

    try {
      const module = await loadModule(requirePath);
      const assets = await loadManifest(requirePath);

      return {
        requirePath,
        module,
        assets,
      };
    } catch (error) {
      console.log('error loadModule', error);
    }

    throw new Error('custom error downloadWidget');
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

  // !!! Warning dev only !!!
  public async clear() {
    const requireCache = this.getWidgetRequireCacheList();
    requireCache.forEach((requirePath) => {
      if (requirePath.includes(widgetsPath)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete __non_webpack_require__.cache[requirePath];
      }
    });
    this.moduleMap = {};
  }
}
