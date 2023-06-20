import * as CommonTypes from "../types";

export type WidgetMeta = CommonTypes.WidgetMeta;

export interface RemoteWidget {
  name: string;
  remote: string;
};

export interface LayoutWidget {
  name: string;
  type: 'widget' | 'context';
  props: Record<string, unknown>;
  slots: Record<string, LayoutWidget[]>
};

export interface State {
  // params for browser
  public: {
    widget: 'http://127.0.0.1:8080/assets/widget/',
    host: 'http://127.0.0.1:8080/assets/host/',
  },
  // params for node js
  $widgets: Array<RemoteWidget>, // backend only
  layout: LayoutWidget[],
}
