import { WidgetTypes } from '../../types';

export const getWidgetInfo = (name: string): null | { type: WidgetTypes; name: string } => {
  const [widgetType = '', widgetName = ''] = name.split('.');

  if (widgetName === '' || widgetType === '') {
    return null;
  }

  if (!['widget', 'context'].includes(widgetType)) {
    return null;
  }

  return {
    type: widgetType as WidgetTypes,
    name: widgetName,
  };
};
