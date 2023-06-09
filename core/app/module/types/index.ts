export type WidgetName = string; // {type}.{owner}.{name}@{version}

export type WidgetType = 'context' | 'widget';

export interface WidgetMeta {
  type: WidgetType;
  owner: string;
  name: string;
  version: string;
  kind: 'dev' | 'debug' | 'common'
}
