import React from 'react';
import path from 'path';
import fs from 'fs-extra';

export const isJS = (file: string) => /\.js(\?[^.]+)?$/.test(file);

export const findChunksScripts = async (containerPath: string) => {
  const list = await fs.readdir(containerPath);
  return list.filter(isJS);
};

export const loadModule = async (containerPath: string): Promise<React.ElementType> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await __webpack_init_sharing__('default');

  const modulePath = path.resolve(containerPath, 'module.js');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const container = __non_webpack_require__(modulePath);

  const module = await container.get('widget');

  /*
  // require all widget lazy chunks
  const chunksPath = path.resolve(containerPath, './chunks');
  const chunks = await findChunksScripts(chunksPath);
  for (let i = 0; i < chunks.length; i++) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    __non_webpack_require__(path.resolve(containerPath, chunks[i]));
  }
  */

  return module().default as React.ElementType;
};
