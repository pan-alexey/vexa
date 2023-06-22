/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import fs from 'fs-extra';

export const isJS = (file: string) => /\.js(\?[^.]+)?$/.test(file);

export const findChunksScripts = async (containerPath: string) => {
  const list = await fs.readdir(containerPath);
  return list.filter(isJS);
};

export const loadModule = async (containerPath: string): Promise<unknown> => {
  // @ts-ignore
  await __webpack_init_sharing__('default');

  const modulePath = path.resolve(containerPath, 'module.js');
  // @ts-ignore
  const container = __non_webpack_require__(modulePath);

  try {
    // @ts-ignore
    await container.init(__webpack_share_scopes__.default);
  } catch (e) {
    // already was initialized
  }

  // @ts-ignore
  const module = await container.get('widget');

  return module().default as unknown;
};
