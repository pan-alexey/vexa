import React from 'react';
import path from 'path';
import fs from 'fs-extra';
import { downloadModule } from '../module/download-module';
import { requireWidget } from '../module/federation-module';

import { renderComponent } from '../render/index';

type Widget = {
  name: string;
  component: React.ElementType;
  assets: {
    js: string[];
    css: string[];
  };
};

type RemoteWidget = {
  name: string;
  remotePath: string; // 'http://127.0.0.1:8080/_widget_/widget.tgz'
};

export interface WidgetRegistryProps {
  cachePath: string; // path.resolve(process.cwd(), './node_modules/.widget.registry')
}

export class WidgetRegistry {
  private widgets: Record<string, Widget> = {};
  private cachePath: string;

  constructor(props: WidgetRegistryProps) {
    this.cachePath = props.cachePath;
  }

  public registerWidget(widget: Widget) {
    this.widgets[widget.name] = widget;
  }

  // public async prepareWidgets(widgets: Array<{name: string; backendPath: string}>) {
  //   for (let i = 0; i < widgets.length; i++) {
  //     const widget = widgets[i];
  //     if (this.widgets[widget.name]) {
  //       console.log('widget already load');
  //       // already load
  //       continue;
  //     }
  //   }
  // }

  public async loadWidget(widget: RemoteWidget): Promise<Widget> {

    const widgetPath = path.resolve(this.cachePath, widget.name);
    await downloadModule(widget.remotePath, widgetPath);

    const clientPath = path.resolve(widgetPath, './client');
    const manifestPath = path.resolve(widgetPath, './manifest.json');
    const serverPath = path.resolve(widgetPath, './server/module.js');

    const widgetManifest = await fs.readJson(manifestPath);
    const WidgetComponent = await requireWidget(serverPath);
    // console.log('widgetManifest', widgetManifest);

    console.log('widgetComponent', WidgetComponent);

    const widgetHmtl = await renderComponent(<WidgetComponent />);

    console.log('widgetHmtl', widgetHmtl);

    // Т/к на клиенте чанки подключаются с помощью webpack, от нас требуется только
    // добавить все css файлы для модуля
    return {
      name: widget.name,
      component: () => <div></div>,
      assets: {
        js: [''], // Object
        css: [], // Object
      }
    };
  }
}
