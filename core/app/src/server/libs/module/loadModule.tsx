import React from 'react';
import path from 'path';
import fs from 'fs-extra';

const isJS = (file: string) => /\.js(\?[^.]+)?$/.test(file);

const findChunksScripts = async (containerPath: string) => {
  const list = await fs.readdir(containerPath);

  return list.filter(isJS);
};

export const loadModule = async (containerPath: string): Promise<React.ElementType> => {
  await __webpack_init_sharing__('default');

  const modulePath = path.resolve(containerPath, 'module.js');
  const chunksPath = path.resolve(containerPath, './chunks');

  const container = __non_webpack_require__(modulePath);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const module = await container.get('widget');

  const chunks = await findChunksScripts(chunksPath);

  console.log('list', chunks);

  // load lazy chunks
  // __non_webpack_require__(path.resolve(test, './chunks/src_index_tsx-f979a3ba82b68bf50cc0.js'));
  // __non_webpack_require__(path.resolve(test, './chunks/src_components_lazy_tsx-8601c34b837bf491246c.js'));

  // __non_webpack_require__('')
  return module().default as React.ElementType;
};
