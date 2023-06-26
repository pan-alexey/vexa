import { Registry } from './components/registry';
import { Layout } from './components/layout';
export interface ApplicationProps {
  remoteUrls: Record<string, string>;
}

// Class Composite.
export class Application {
  public readonly registry: Registry;
  public readonly layout: Layout;

  constructor(props: ApplicationProps) {
    this.registry = new Registry({
      remoteUrls: props.remoteUrls,
    });

    this.layout = new Layout({
      registry: this.registry,
    });
  }

  public async renderBody(state: unknown): Promise<string> {
    return await this.layout.render(state);
  }
}
