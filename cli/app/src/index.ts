import type { Config } from '@vexa/cli-config';
import { Application as AppDev } from './apps/dev';

import { Publish } from './apps/publish';

export class App {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public async run(mode: 'build' | 'dev' | 'publish') {
    switch (mode) {
      case 'dev':
        new AppDev(this.config).run();
        break;
      case 'publish':
        new Publish(this.config).run();
        break;
      default:
        break;
    }
  }
}
