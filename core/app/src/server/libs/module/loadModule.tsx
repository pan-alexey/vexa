/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from 'path';
import fs from 'fs-extra';

export const loadModule = async (serverModulePath: string): Promise<unknown> => {
  const modulePath = path.resolve(serverModulePath, 'module.js');

  // @ts-ignore
  await __webpack_init_sharing__('default');

  // @ts-ignore
  const container = __non_webpack_require__(modulePath);
  if (!container) {
    const file = await fs.readFileSync(modulePath);
    console.log('file', file.toString());
  }

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
