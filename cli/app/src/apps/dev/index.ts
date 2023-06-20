import path from 'path';
import fs from 'fs-extra';
import { throttle } from 'lodash';
import * as constants from '../../shared/constants';
import { watchBuilder as serverProd } from '../../components/builders/server.prod';
import { WatchBuilder, MultiBuilder, BuilderState } from '@vexa/tools-builder';
import * as terminal from '../../shared/libs/terminal';
import { compress } from '../../shared/libs/compress';

import { DevServer } from '../../components/devServer';
// import { DevServer } from '../server';
// import * as builders from '../../../builders';
// import { compress } from '../../../utils/compress';
// import * as terminal from '../terminal';
// import * as constants from '../../../builders/constants';

import type { Config } from '@vexa/cli-config';

type Builders = {
  // appClient: WatchBuilder;
  // appServer: WatchBuilder;
  // widgetClient: WatchBuilder;
  serverProd: WatchBuilder;
};

type Builder = MultiBuilder<Builders>;
type State = {
  [key in keyof Builders]: BuilderState;
};

export class Application {
  private config: Config;
  private builder: Builder;
  private server: DevServer;

  constructor(config: Config) {
    this.config = config;

    this.builder = new MultiBuilder({
      serverProd: serverProd(this.config),
    });

    this.server = new DevServer({
      port: config.debug.httpPort,
    });
  }

  public async run() {
    await this.prepare();
    await this.runServer();

    await this.registerBuilder();
    await this.builder.run();
  }

  public async prepare() {
    await fs.emptyDir(constants.widgetBuild);
    await fs.emptyDir(constants.widgetDist);
  }

  private async runServer() {
    this.server.public(constants.widgetDist, '/_static_');

    await this.server.listen();
  }

  private async registerBuilder() {
    const throttleProcess = throttle(this.process, 50);
    this.builder
      .on('start', (state) => {
        throttleProcess('start', state, this);
      })
      .on('progress', (state) => {
        throttleProcess('progress', state, this);
      })
      .on('done', async (state) => {
        await throttleProcess('done', state, this);
      });
  }

  private process(status: 'start' | 'progress' | 'done', state: State, ctx: Application) {
    switch (status) {
      case 'start':
        ctx.start();
        break;
      case 'progress':
        ctx.progress(state);
        break;
      case 'done':
        ctx.done(state);
        break;
      default:
        break;
    }
  }

  private start() {
    terminal.clear();
    this.server.ready(false);
    console.log('start');
  }

  private progress(state: State) {
    terminal.clear();
    console.log('building');
  }

  private async done(state: State) {
    terminal.clear();
    console.log('done');

    this.server.ready(true);
    await this.processDone();

    console.log('constants.widgetDist', constants.widgetDist);
    console.log(`Local widget in http://127.0.0.1:${this.server.getPort()}/_static_/widget.tgz`);
  }

  private async processDone() {
    await fs.emptyDir(constants.widgetDist);
    await fs.copy(constants.widgetBuild, constants.widgetDist, { overwrite: true });
    await compress(constants.widgetBuild, path.resolve(constants.widgetDist, 'widget.tgz'));
  }
}
