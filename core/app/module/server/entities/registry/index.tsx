import path from 'path';
import fs from 'fs-extra';
import { Tracker } from '../tracker';
import { parseWidgetName } from '../../../common/widget';
import { downloadModule } from '../../libs/module/download-module';
import { requireWidget } from '../../libs/module/federation-module';
import type { RemoteWidget, DebugWidget, WidgetMeta, WidgetManifest } from '../../types';

export interface WidgetRegistryProps {
  tracker: Tracker;
};

export interface Widget {
  name: string;
  component: React.ElementType;
  meta: WidgetMeta;

  assets?: {
    css: Record<string, string>;
    js: Record<string, string>;
  },
  backendMeta?: {
    requirePath: string;
    remotePath: string;
  }
}

export class WidgetRegistry {
  private tracker: Tracker;
  private widgets: Record<string, Widget> = {};
  private cachePath: string = path.resolve(process.cwd(), './node_modules/.widget.registry');

  constructor(props: WidgetRegistryProps) {
    this.tracker = props.tracker;
  }

  public getCachePath = () => {
    return this.cachePath;
  }

  public getWidget(name: string): null | Widget {
    const widget = this.widgets[name];

    if (!widget) {
      return null;
    }

    return widget
  }

  public registerWidget(widget: Widget) {
    this.widgets[widget.name] = widget;
  }

  public async prepareWidget(remoteWidget: RemoteWidget) {
      const widget = this.widgets[remoteWidget.name];
      if (!widget) {
        // this.tracker.benchmark('prepare_widget').start();
        // tracker.counter('metric_name').inc();
        // tracker.gauge('metric_name').set({ method: 'GET', statusCode: '200' }, 100);
        // tracker.benchmark('').start('');
        await this.loadRemoteWidget(remoteWidget);
        // tracker.benchmark.end('');
        // this.tracker.benchmark('prepare_end').start();
        return;
      }
  }

  public async purgeWidget(name: string, requirePath: string) {
    // @ts-ignore
    Object.keys(__non_webpack_require__.cache).forEach((element) => {
      if (element.includes(requirePath)) {
        // @ts-ignore
        delete __non_webpack_require__.cache[__non_webpack_require__.resolve(element)];
      }
    });
    delete this.widgets[name];
    await fs.remove(requirePath);
  }

  public async loadRemoteWidget(remoteWidget: RemoteWidget): Promise<void> {
    const { remotePath, name } = remoteWidget;

    const widgetMeta: WidgetMeta | null = parseWidgetName(name);
    if (widgetMeta === null) {
      return;
    }

    const requirePath = path.resolve(this.cachePath, name);
    await downloadModule(remotePath, requirePath);
    const manifestPath = path.resolve(requirePath, './manifest.json');
    const serverPath = path.resolve(requirePath, './server/module.js');
    const widgetManifest: WidgetManifest = await fs.readJson(manifestPath);
    const WidgetComponent = await requireWidget(serverPath);
  
    this.registerWidget({
      name,
      component: WidgetComponent,
      meta: widgetMeta,
      backendMeta: {
        requirePath,
        remotePath,
      }
    })
  }
}
