import type { Widget } from '../types';

const getNames = (layout: Widget[]): Record<string, boolean> => {
  const widgets: Record<string, boolean> = {};

  layout.forEach((widget) => {
    const name = widget.name;
    widgets[name] = true;
    const slots = widget.slots || {};
    Object.keys(slots).forEach((slotKey) => {
      Object.assign(widgets, getNames(slots[slotKey]));
    });
  });

  return widgets;
};

export const getModuleNames = (layout: Widget[]): Array<string> => {
  return Object.keys(getNames(layout));
};
