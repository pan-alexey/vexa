import { Registry } from './components/registry';
import { Layout } from './components/layout';
import { widgetsPath } from './constants';
export interface ApplicationProps {
  remoteUrls: Record<string, string>;
}

// Class Composite.
export class Application {
  public readonly registry: Registry;
  public readonly layout: Layout;
  public readonly widgetsPath: string = widgetsPath;

  constructor(props: ApplicationProps) {
    this.registry = new Registry({
      remoteUrls: props.remoteUrls,
    });

    this.layout = new Layout({
      registry: this.registry,
    });
  }

  public async renderHead(props: {
    state: unknown;
    publicTemplate: string;
    ignoreModuleNames?: Array<string>;
  }): Promise<{
    js: Array<string>;
    css: Record<string, string>;
  }> {
    return await this.layout.renderHead(props);
  }

  public async renderState(props: { state: unknown; publicTemplate: string }) {
    return this.layout.renderState(props);
  }

  public async renderBody(state: unknown): Promise<string> {
    return await this.layout.render(state);
  }
}
