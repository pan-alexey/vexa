import type { Config } from '@vexa/cli-config';
import { Application as AppDev } from './apps/dev';

export class App {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public async run(mode: 'build' | 'dev') {
    switch (mode) {
      case 'dev':
        new AppDev(this.config).run();
        break;
      default:
        break;
    }
  }
}
