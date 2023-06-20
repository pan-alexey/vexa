import React from 'react';
import path from 'path';
import fs from 'fs-extra';
import { widgetsPath } from '../../constants';
import { getWidgetMeta } from '../../../common/widget/getWidgetMeta';
import { downloadModule } from '../../libs/download/downloadModule';
import { loadModule } from '../../libs/module/loadModule';
import { renderComponent } from '../../libs/render';
import type { WidgetMeta } from '../../../common/types';

const listRequire = (requirePath: string) => {
  Object.keys(__non_webpack_require__.cache).forEach((element) => {
    if (element.includes(requirePath)) {
      console.log(__non_webpack_require__.resolve(element));
    }
  });
};

export interface RegistryProps {
  resolveTemplates: Record<string, string>;
}

export interface RegistryWidget {
  name: string;
  component: React.ReactElement;
  requirePath?: string; // undefined if widget type is debug or core
  meta: WidgetMeta;
  assets: {
    css: Record<string, string>;
    js: Record<string, string>;
  };
}

export class Registry {
  private resolveTemplates: Record<string, string>;
  // constructor() {};

  public async loadWidget(widgetName: string, remoteUrl: string): Promise<unknown> {
    const meta = getWidgetMeta(widgetName);

    if (meta === null) {
      return null;
    }

    const downloadPath = path.resolve(widgetsPath, widgetName);
    const modulePath = path.resolve(downloadPath, './server');

    await downloadModule(remoteUrl, downloadPath);
    const Component1 = await loadModule(modulePath);

    const html = await renderComponent(<Component1 />);
    console.log('html', html);
    return '';
  }

  public async init() {
    const outputPath = path.resolve(process.cwd(), '.widgets');
    const downloadPath1 = path.resolve(outputPath, 'widgetName1');
    const modulePath1 = path.resolve(downloadPath1, './server');
    await downloadModule('http://127.0.0.1:8888/_static_/widget.tgz', downloadPath1);
    const Component1 = await loadModule(modulePath1);

    // const downloadPath2 = path.resolve(outputPath, 'widgetName2');
    // const modulePath2 = path.resolve(downloadPath2, './server');
    // await downloadModule('http://127.0.0.1:8082/dist.tgz', downloadPath2);
    // const Component2 = await loadModule(modulePath2);

    console.log('1: show required scripts');
    listRequire(outputPath);
    console.log('----------');
    const html = await renderComponent(
      <div>
        {/* <Component2 /> */}
        <Component1 />
      </div>,
    );
    console.log('2: show required scripts');
    listRequire(outputPath);
    return html;
  }
}
