import React from 'react';

export type WidgetTypes = 'widget' | 'context';

export interface ComponentContext {
  name: string;
  hook: () => unknown; // fn useContext;
}

export interface ComponentProps {
  contexts: unknown[];
  data?: unknown;
  children?: React.ReactNode;
}

export interface WidgetContext {
  provider: React.FC<{ children: React.ReactNode }>;
  hooks: unknown[];
}

export interface RemoteWidget {
  name: string; // nameContext - component context
  props: Record<string, unknown>;
  important?: boolean;
  children?: RemoteWidget[];
}
