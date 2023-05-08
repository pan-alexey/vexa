export type WidgetName = string; // {type}.{owner}.{name}@{version}

export type WidgetType = 'context' | 'widget';

export interface WidgetMeta {
  type: WidgetType;
  owner: string;
  name: string;
  version: string;
}

export interface Widget {
  name: WidgetName;
  slots?: Record<string, Widget[]>;
  isDev?: boolean;
}

export interface RemoteWidgets {
  layout: Widget[];
}
