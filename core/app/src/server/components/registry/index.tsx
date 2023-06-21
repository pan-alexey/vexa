import React from 'react';
import path from 'path';
import { widgetsPath } from '../../constants';
import { getWidgetMeta } from '../../../common/widget/getWidgetMeta';
import { downloadModule } from '../../libs/download/downloadModule';
import { loadModule } from '../../libs/module/loadModule';
import type { WidgetMeta } from '../../../common/types';
import { resolveTemplateUrls } from './helpers';

export interface RegistryWidget {
  name: string;
  element: React.ElementType;
  requirePath?: string; // undefined if widget type is debug or core
  meta: WidgetMeta;
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
  private widgetMap: Record<string, RegistryWidget> = {};

  constructor(props: RegistryProps) {
    this.remoteUrls = props.remoteUrls;
  }

  public async waitFor() {
    //
  }

  public injectWidget(widget: RegistryWidget) {
    this.widgetMap[widget.name] = widget;
  }

  public async getWidget(widgetName: string): Promise<RegistryWidget | null> {
    if (this.widgetMap[widgetName]) {
      return this.widgetMap[widgetName];
    }

    await this.loadWidget(widgetName);
    const widget = this.widgetMap[widgetName];
    return widget ? widget : null;
  }

  public async loadWidget(widgetName: string): Promise<boolean> {
    const meta = getWidgetMeta(widgetName);
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
      const { element, requirePath } = await this.downloadWidget(widgetName, remoteUrl);
      const widget: RegistryWidget = {
        name: widgetName,
        element,
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
      console.log('loadWidget', error);
      // track error here
    }

    return false;
  }

  private async downloadWidget(
    widgetName: string,
    remoteUrl: string,
  ): Promise<{ element: React.ElementType; requirePath: string }> {
    const downloadPath = path.resolve(widgetsPath, widgetName);
    const requirePath = path.resolve(downloadPath, './server');

    await downloadModule(remoteUrl, downloadPath);
    const element = await loadModule(requirePath);

    return {
      requirePath,
      element,
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

    Object.keys(this.widgetMap).forEach((key) => {
      const widget = this.widgetMap[key];
      if (!widget.requirePath) {
        return;
      }

      const widgetPath = widget.requirePath;
      requireCache.forEach((requirePath) => {
        if (requirePath.includes(widgetPath)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          delete __non_webpack_require__.cache[requirePath];
        }
      });

      delete this.widgetMap[key];
    });
  }
}
