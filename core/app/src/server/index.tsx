import React from 'react';

type Widget = {
  name: string;
  component: React.ElementType;
  assets: {
    js: string[];
    css: string[];
  };
};

export class WidgetRegistry {
  private widgets: Record<string, Widget> = {};
  public registerWidget(widget: Widget) {
    this.widgets[widget.name] = widget;
  }
}

export interface RenderProps {
  registry: WidgetRegistry;
}

export class Render {
  private registry: WidgetRegistry;

  constructor(props: RenderProps) {
    this.registry = props.registry;
  }

  public async renderHead() {}
  public async renderBody() {}
  public renderStream() {}
}

const remoteData = {
  layout: [
    {
      name: 'widget.cms.navbar@1.1.1',
      slots: {
        slotName: [],
      },
    },
    {
      name: 'context.platform.root@1.1.1',
      slots: {
        children: [{ name: 'widget.cms.navbar@1.1.1' }, { name: 'widget.platform.navbar@1.1.1' }],
      },
    },
    { name: 'widget.cms.navbar@1.1.1' },
    { name: 'widget.platform.navbar@1.1.1' },
  ],
};

const widgets = ['widget.cms.navbar@1.1.1', 'context.platform.root@1.1.1', 'widget.platform.navbar@1.1.1'];
