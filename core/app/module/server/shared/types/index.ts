import { WidgetMeta }  from "../../types";

export { WidgetMeta };

export interface WidgetManifest {
  module: string;
  css: Record<string, string>;
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
