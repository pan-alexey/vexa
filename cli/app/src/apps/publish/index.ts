import type { Config } from '@vexa/cli-config';
import path from 'path';
import { Uploader } from './utils/upload';

export class Publish {
  private config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  public async run(): Promise<void> {
    const conf = await this.config.publish();
    const dist = path.resolve(process.cwd(), 'dist');
    const uploader = new Uploader(conf);
    await uploader.uploadDir(dist, this.config.name);
  }
}
