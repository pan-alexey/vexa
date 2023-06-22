import type { Widget } from '../';

export const getAllWidgetNames = (layout: Widget[]): Array<string> => {
  const widgets: Record<string, boolean> = {};

  layout.forEach((widget) => {
    const name = widget.name;
    widgets[name] = true;
  });

  return Object.keys(widgets);
};
