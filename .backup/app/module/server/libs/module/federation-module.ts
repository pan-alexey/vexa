import React from 'react';

export const requireWidget = async (containerPath: string): Promise<React.ReactElement> => {
  await __webpack_init_sharing__('default');
  const container = __non_webpack_require__(containerPath);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const module = await container.get('widget');
  return module().default as React.ReactElement;
};
