import path from 'path';
import fs from 'fs-extra';
import { throttle } from 'lodash';
import { WatchBuilder, MultiBuilder, BuilderState } from '@vexa/tools-builder';
import { DevServer } from '../server';
import * as builders from '../../../builders';
import { compress } from '../../../utils/compress';
import type { Config } from '@vexa/cli-config';
import * as terminal from '../terminal';
import * as constants from '../../../builders/constants';

type Builders = {
  appClient: WatchBuilder;
  appServer: WatchBuilder;
  widgetClient: WatchBuilder;
  widgetServer: WatchBuilder;
};

type Builder = MultiBuilder<Builders>;

type State = {
  [key in keyof Builders]: BuilderState;
};

export class AppBuilder {
  private config: Config;
  private builder: Builder;
  private server = new DevServer();

  constructor(config: Config) {
    this.config = config;

    // register dev
    const appClientBuilder = builders.makeAppClient();
    const appServerBuilder = builders.makeAppServer();

    const widgetBuilder = builders.makeWidgetWatch(this.config.name);

    if (appClientBuilder === null || appServerBuilder === null || widgetBuilder === null) {
      throw new Error('Error in cli-app package');
    }

    this.builder = new MultiBuilder({
      appClient: appClientBuilder,
      appServer: appServerBuilder,
      widgetClient: widgetBuilder.client,
      widgetServer: widgetBuilder.server,
    });

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

  private process(status: 'start' | 'progress' | 'done', state: State, ctx: AppBuilder) {
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
    // prepare folders (create and clear)
  }

  private progress(state: State) {
    terminal.clear();
    console.log('progress...');
    console.log('[app] client', state.appClient.progress.progress, state.appClient.progress.message);
    console.log('[app] server', state.appServer.progress.progress, state.appServer.progress.message);
  }

  private async done(state: State) {
    // TODO create normal terminal output message
    if (state.appClient.compiler.stats && !state.appClient.compiler.stats.hasErrors()) {
      this.server.public(constants.appOutput.client);
      this.server._registerManifest(constants.appOutput.clientManifest);
      this.server.sendHmr(state.appClient.compiler.stats);
    }

    if (!state.appServer.compiler.stats?.hasErrors()) {
      console.log('update server');
      await this.server._regiseterSSR(path.resolve(constants.appOutput.server, 'index.js'));
    }

    if (!state.widgetClient.compiler.stats?.hasErrors()) {
      console.log('update server');
      await this.server._regiseterSSR(path.resolve(constants.appOutput.server, 'index.js'));
    }

    await fs.emptyDir(this.config.output);
    await fs.copy(constants.widgetTempPath, this.config.output, { overwrite: true });
    await compress(constants.widgetTempPath, path.resolve(this.config.output, 'widget.tgz'));
    await fs.emptyDir(constants.widgetTempPath);
    this.server.public(this.config.output, '/_widget_');

    this.server.ready(true);
    terminal.clear();

    console.log('state:');
    Object.keys(state).forEach((key: string) => {
      const item = state[key as keyof Builders];
      console.log(` - ${key}: `, item.compiler.stats?.hasErrors());
    });

    console.log('');
    console.log(`Server run in http://127.0.0.1:${this.server.getPort()}`);
    console.log(`Local widget in http://127.0.0.1:${this.server.getPort()}/_widget_`);
  }

  public async run() {
    // mkdir shared
    const port = this.config.debug.httpPort;

    // public
    await this.server.listen(port);
    await this.builder.run();
  }
}
