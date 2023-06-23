import { ComponentMeta } from '../types';

export const getMeta = (widgetName: string): null | ComponentMeta => {
  try {
    const [widgetPart = '', version = ''] = widgetName.split('@');
    const [type, owner, name] = widgetPart.split('.');

    if (type !== 'context' && type !== 'widget') {
      return null;
    }

    if (!owner || !version || !name) {
      return null;
    }

    const result: ComponentMeta = {
      type: type,
      owner: owner,
      name: name,
      version: version,
    };

    return result;
  } catch (error) {
    return null;
  }
};
