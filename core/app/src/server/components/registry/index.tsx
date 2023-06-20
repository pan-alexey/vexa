import React from 'react';
import path from 'path';
import fs from 'fs-extra';
import { downloadModule } from '../../libs/download/downloadModule';

import { loadModule } from '../../libs/module/loadModule';
import { renderComponent } from '../../libs/render';

const listRequire = (requirePath: string) => {
  Object.keys(__non_webpack_require__.cache).forEach((element) => {
    if (element.includes(requirePath)) {
      console.log(__non_webpack_require__.resolve(element));
    }
  });
};

export class Registry {
  // constructor() {};

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
