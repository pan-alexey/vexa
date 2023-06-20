import { WidgetMeta } from '../types';

export const getWidgetMeta = (widgetName: string): null | WidgetMeta => {
  try {
    const [widgetPart = '', version = ''] = widgetName.split('@');
    const [type, owner, name] = widgetPart.split('.');

    if (type !== 'context' && type !== 'widget') {
      return null;
    }

    if (!owner || !version || !name) {
      return null;
    }

    const result: WidgetMeta = {
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
