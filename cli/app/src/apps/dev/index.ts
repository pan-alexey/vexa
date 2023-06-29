import path from 'path';
import fs from 'fs-extra';
import { throttle } from 'lodash';
import * as constants from '../../shared/constants';
import { watchBuilder as serverDist } from '../../components/builders/server.dist';
import { watchBuilder as clientDist } from '../../components/builders/client.dist';
import { watchBuilder as serverApp } from '../../components/builders/server.app';
import { WatchBuilder, MultiBuilder, BuilderState } from '@vexa/tools-builder';
import * as terminal from '../../shared/libs/terminal';
import { compress } from '../../shared/libs/compress';
import { getBuildStatus } from '../../shared/helpers/buildStatus';
import { DevServer } from '../../components/devServer';
import type { Config } from '@vexa/cli-config';
import type { Application as CoreApp } from '@vexa/core-app';

type Builders = {
  // appClient: WatchBuilder;
  // appServer: WatchBuilder;
  // widgetClient: WatchBuilder;
  serverDist: WatchBuilder;
  serverApp: WatchBuilder;
  clientDist: WatchBuilder;
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

    // validate config here

    this.builder = new MultiBuilder({
      serverDist: serverDist(this.config),
      clientDist: clientDist(this.config),
      serverApp: serverApp(this.config),
    });

    this.server = new DevServer({
      config: config,
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
    this.server.public(path.resolve(process.cwd(), './node_modules/.vexa.widgets'), `/_assets_`); // for share assets
    this.server.public(constants.widgetDist, `/${constants.widgetStaticPath}`);
    this.server.registerRouter();
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
    console.log('building', state.serverApp.progress, state.serverDist.progress);
  }

  private async done(state: State) {
    terminal.clear();
    console.log('done');

    const statuses = {
      serverApp: getBuildStatus(state.serverApp),
      serverDist: getBuildStatus(state.serverDist),
      clientDist: getBuildStatus(state.clientDist),
    };

    console.log(`Build application: ${statuses.serverApp}`);
    console.log(`Build widget (server): ${statuses.serverDist}`);
    console.log(`Build widget (client): ${statuses.clientDist}`);

    console.log(state.clientDist.compiler.stats?.toString());

    try {
      if (statuses.serverApp !== 'error' && statuses.serverDist !== 'error') {
        await this.processDone();
        await this.registerApp();
        console.log(`Dev server run in http://127.0.0.1:${this.server.getPort()}`);
        console.log(
          `Widget tgz allow in http://127.0.0.1:${this.server.getPort()}/${constants.widgetStaticPath}/widget.tgz`,
        );

        this.server.ready(true);
        return;
      }
    } catch (error) {
      console.log('Error register application');
    }

    if (statuses.serverApp === 'error') {
      console.log(state.serverApp.compiler.stats?.toString());
    }
    this.server.ready(false);
  }

  private async registerApp() {
    try {
      const app = (await this.requireApp()) as CoreApp;
      this.server.injectApp(app);
    } catch (error) {
      console.log('registerApp:error', error);
      this.server.injectApp(null);
    }
  }

  private async processDone() {
    await fs.mkdirp(constants.widgetDist);
    // await fs.emptyDir(constants.widgetDist);
    await fs.copy(constants.widgetBuild, constants.widgetDist, { recursive: true, overwrite: true });
    await compress(constants.widgetBuild, path.resolve(constants.widgetDist, 'widget.tgz'));
  }

  public async requireApp() {
    const appServerDist = constants.widgetAppDistServer;
    const modulePath = path.resolve(appServerDist, './index.js');

    // Clear require cache for server application
    Object.keys(require.cache).forEach((element) => {
      if (element.includes(appServerDist)) {
        delete require.cache[require.resolve(element)];
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getApplication = require(modulePath).getApplication as (config: Config) => unknown;
    const application = getApplication(this.config);
    return application;
  }
}
