import React from 'react';
import { WidgetRegistry } from './registry';

export interface RenderProps {
  registryCachePath: string;
}

export class Render {
  private widgetRegistry: WidgetRegistry;

  constructor (props: RenderProps) {
    this.widgetRegistry = new WidgetRegistry({
      cachePath: props.registryCachePath,
    })
  }

  public async prepareWidgets() {}

  public getRegistryInstance(): WidgetRegistry {
    return this.widgetRegistry;
  }
}
