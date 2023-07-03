import type { Config } from '@vexa/cli-config';

export class Publish {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public async run(): Promise<void> {
    console.log('publish');
  }
}
