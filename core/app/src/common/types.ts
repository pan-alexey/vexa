export type ComponentType = 'widget' | 'context';

export interface ComponentMeta {
  type: ComponentType;
  owner: string;
  name: string;
  version: string;
}
