import * as CommonTypes from "../types";

// Server Types
export type WidgetMeta = CommonTypes.WidgetMeta;

export interface WidgetManifest {
  css: Record<string, string>
}

export interface RemoteWidget {
  name: string;
  remotePath: string;
};

export interface Widget {
  name: string;
  component: React.ElementType
  meta: WidgetMeta;
  manifest: WidgetManifest;
  backendMeta?: {
    requirePath: string;
    remotePath: string;
  }
}

export interface DebugWidget extends Omit<Widget, 'backendMeta'> {}
