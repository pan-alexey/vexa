export type WidgetType = 'widget' | 'context';

export interface WidgetMeta {
  type: WidgetType;
  owner: string;
  name: string;
  version: string;
}
