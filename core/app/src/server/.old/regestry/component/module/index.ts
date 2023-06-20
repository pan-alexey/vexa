import React from 'react';

export const loadComponent = async (containerPath: string): Promise<React.ElementType> => {
  await __webpack_init_sharing__('default');
  const container = __non_webpack_require__(containerPath);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const module = await container.get('widget');
  return module().default as React.ElementType;
};
