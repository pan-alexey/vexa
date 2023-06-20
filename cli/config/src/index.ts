export interface Config {
  name: string; // widget name
  output: string; // absolute path for build widget
  debug: {
    remotes: Record<string, string>;
    httpPort: number;
    getState: (props: { url: string }) => Promise<unknown>;
    // remoteBackend?: (props: { widgetName: string }) => Promise<null>;
  };
}

export type CliConfigCallback = () => Promise<Config>;

export class CliConfig {
  private callback: CliConfigCallback;
  constructor(callback: CliConfigCallback) {
    this.callback = callback;
  }

  public getConfig() {
    return this.callback;
  }
}
