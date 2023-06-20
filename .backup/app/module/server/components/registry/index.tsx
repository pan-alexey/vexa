import React from 'react';
import path from 'path';
import fs from 'fs-extra';
import { Tracker } from '../tracker';
import { clearRequire } from '../../libs/utils/clear-require';
import { requireWidget } from '../../libs/module/federation-module';
import { downloadModule } from '../../libs/module/download-module'
import { parseWidgetName } from '../../../common/widget';

import type { WidgetMeta } from '../../../types';
import { trycatch } from '../../libs/utils/trycatch';
import { resolveTemplate } from './helpers';

export interface RegistryProps {
  tracker: Tracker;
  remotePath: Record<string, string>;
}

export interface RegistryWidget {
  name: string;
  component: React.ReactElement;
  requirePath?: string; // undefined if widget type is debug or core
  meta: WidgetMeta;
  assets: {
    css: Record<string, string>;
    js: Record<string, string>;
  }
}

export class Registry {
  private widgets: Record<string, RegistryWidget> = {};
  private remotePath: Record<string, string>;

  private ready = true;
  private tracker: Tracker;
  private cachePath: string = path.resolve(process.cwd(), './node_modules/.widget.registry');

  constructor(props: RegistryProps) {
    this.tracker = props.tracker;
    this.remotePath = props.remotePath;
  }

  public getCachePath(): string {
    return this.cachePath;
  }

  // for debug or core widgets
  public registerWidget(widget: RegistryWidget): void {
    this.widgets[widget.name] = widget;
  }

  public waitReady(): Promise<null> {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (this.ready) {
          clearInterval(timer);
          resolve(null);
        }
      }, 100);
    })
  }

  private async loadWidget(name: string, remoteUrl: string): Promise<RegistryWidget> {
    const widgetMeta: WidgetMeta | null = parseWidgetName(name);
    if (widgetMeta === null) {
      throw new Error('Error parse widget name');
    }

    // this.tracker.benchmark('registry:loadWidget').start();
    const requirePath = path.resolve(this.cachePath, name);
    await downloadModule(remoteUrl, requirePath);

    // load assets  manifest for widget
    const manifestPath = path.resolve(requirePath, './manifest.json');
    const serverPath = path.resolve(requirePath, './server/module.js');
    const assets: {
      css: Record<string, string>;
      js: Record<string, string>;
    } = await fs.readJson(manifestPath);

    const WidgetComponent = await requireWidget(serverPath);
    const widget: RegistryWidget = {
      name,
      component: WidgetComponent,
      requirePath,
      meta: widgetMeta,
      assets,
    };

    return widget
  }

  public async purgeWidget(widgetName: string): Promise<void> {
    const widget = this.widgets[widgetName];
    if (widget === undefined || widget.requirePath === undefined) {
      return;
    }

    this.ready = false;
    clearRequire(widget.requirePath);

    delete this.widgets[widgetName];
    this.ready = true;
  }

  public async prepareWidget(name: string): Promise<void> {
    const remoteTemplate = this.remotePath[name] ? this.remotePath[name] : this.remotePath['*'];

    if (!remoteTemplate) {
      console.error(`error resolve remoteUrl ${name}`);
      return;
    }

    const remoteUrl = resolveTemplate(remoteTemplate, name);

    try {
      console.log(`try prepare widget ${name} ${remoteUrl}`);
      const widget = await this.loadWidget(name, remoteUrl);
      this.widgets[widget.name] = widget;
    } catch (error) {
      console.error(`error prepare widget ${name}, remote url ${remoteUrl}`);
      console.error('error', error);
    }
  }

  public async getWidget(name: string): Promise<RegistryWidget|null> {
    if (!this.widgets[name]) {
      await this.prepareWidget(name);
    }

    return this.widgets[name] ? this.widgets[name] : null;
  }
}
