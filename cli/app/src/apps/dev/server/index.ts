import * as http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import webpack from 'webpack';
import type { Config } from '@vexa/cli-config';
import express, { Express, Request, Response, NextFunction } from 'express';
import { createHotServer } from 'webpack-hmr-server';
import fs from 'fs-extra';

interface Manifest {
  js: {
    initialJS: string[];
    allJS: string[];
  };
}

export class DevServer {
  private expressApp: Express = express();
  private server = http.createServer(this.expressApp);
  private hotServer = createHotServer(this.server);
  private isReady = false;
  private port = 0;
  private appConfig: Config;
  private manifest: Manifest = {
    js: {
      initialJS: [],
      allJS: [],
    },
  };
  private ssrApp: null | SsrApp = null;

  constructor(appConfig: Config) {
    this.appConfig = appConfig;
    this.useReadyMiddleware();
    // this.registerStaticDev();
  }

  private useReadyMiddleware(): void {
    this.expressApp.use((req: Request, res: Response, next: NextFunction) => {
      if (this.isReady) {
        return next();
      }
      const timer = setInterval(() => {
        if (this.isReady) {
          clearInterval(timer);
          next();
        }
      }, 100);

      req.on('close', () => {
        clearInterval(timer);
      });
    });
  }

  public registerStaticDev() {
    this.expressApp.get('*', async (req, res) => {
      if (this.ssrApp === null) {
        res.send('not ready');
      }

      const state = await this.appConfig.debug.getState({
        url: req.path,
      });

      const layout = await this.ssrApp.layout((state as any).layout);

      const initialJS = this.manifest.js.initialJS;
      const headWidgetScript = initialJS
        .map((asset) => {
          return ` <script defer src="/client/${asset}"></script>`;
        })
        .join('');

      res.send(`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>MF</title>
            <script>window.__state__ = ${JSON.stringify(state)};</script> 
            ${headWidgetScript}
          </head>
          <body>
            <div id="root">${layout}</div>
          </body>
        </html>`);
    });
  }

  public async _registerManifest(jsonPath: string) {
    try {
      this.manifest = (await fs.readJSON(jsonPath)) as Manifest;
    } catch (error) {}
  }

  public async _regiseterSSR(modulePath: string) {
    try {
      // clear require cache for server application
      // delete require.cache[require.resolve(modulePath)];
      const dirname = path.dirname(modulePath);
      Object.keys(require.cache).forEach((element) => {
        if (element.includes(dirname)) {
          delete require.cache[require.resolve(element)];
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const application = require(modulePath).getApplication as () => unknown;

      this.ssrApp = application();
    } catch (error) {}
  }

  public sendHmr(stats: webpack.Stats) {
    this.hotServer.reloadModules({ client: stats });
  }

  public ready(status: boolean) {
    this.isReady = status;
    // may be need close active connection
  }

  public public(path: string, root?: string) {
    if (root) {
      this.expressApp.use(root, express.static(path));
      return;
    }

    this.expressApp.use(express.static(path));
  }

  public getPort() {
    return this.port;
  }

  public async listen() {
    const port = this.appConfig.debug.httpPort;

    this.port = await new Promise((resolve, reject) => {
      let startFinished = false;
      this.server.listen(port, () => {
        const address = this.server.address();
        if (!address) {
          return reject();
        }
        startFinished = true;
        resolve((address as AddressInfo).port);
      });
      this.server.once('error', (err) => {
        if (!startFinished && err) {
          reject(err);
        }
      });
    });
  }
}
