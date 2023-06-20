import React from "react";
import { Registry } from "../registry";
import { Tracker } from "../tracker";

export interface LayoutProps {
  tracker: Tracker;
  registry: Registry;
}

export class Layout {
  private tracker: Tracker;
  private registry: Registry;

  constructor(props: LayoutProps) {
    this.registry = props.registry;
    this.tracker = props.tracker;
  }

  public async render() {
  }
}

/*
  // public async layout(widgets: Array<unknown>) {
  //   // mark here
  //   return await this.renderWidgets(widgets);
  // }

  // private async renderWidgets(widgets: Array<unknown>) {
  //   try {
  //     const promises: Array<string> = await Promise.all(widgets.map((widget) => this.renderWidgetByName(widget)));
  //     return promises.join('');
  //   } catch (error) {
  //     return ''
  //   }
  // }

  // private async renderWidgetByName(widget: unknown) {
  //   const { widgetName } = widget as { widgetName: string }

  //   // @ts-ignore
  //   const widgetSlots: Record<string, unknown> = widget.slots || {};
  //   const slots: Record<string, React.ReactElement>  = {};

  //   // fix here
  //   for (const key in widgetSlots) {
  //     if (Object.prototype.hasOwnProperty.call(widgetSlots, key)) {
  //       const html = await this.renderWidgets(widgetSlots[key] as Array<unknown>);
  //       slots[key] = <div dangerouslySetInnerHTML={{ __html: html }} />
  //     }
  //   }

  //   // mark
  //   const component = await this.getComponentWidget(widgetName, {slots});
  //   const html = await renderComponent(component);
  //   return html;
  // }

  // private getComponentWidget = async (name: string,  props: Record<string, unknown>): Promise<React.ReactElement> => {
  //   const widget = this.registry.getWidget(name);
  //   if (widget === null) {
  //     return <React.Fragment />;
  //   }
  //   const Component = widget.component;
  //   return <><Component {...props}/></>;
  // };

  // public async renderState() {}
*/