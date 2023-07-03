export interface RemoteState {
  layout: [];
}

export interface Config {
  name: string; // widget name
  publish: () => Promise<{
    [x: string]: unknown;
    BUCKET_NAME: string;
    S3_ACCESS_KEY: string;
    S3_ENDPOINT: string;
    S3_ENDPOINT_PORT: string;
    S3_SECRET_KEY: string;
  }>;
  debug: {
    remotes: Record<string, string>;
    httpPort: number;
    getState: (props: { url: string }) => Promise<unknown>;
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
