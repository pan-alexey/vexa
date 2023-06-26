import * as http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import type { Config } from '@vexa/cli-config';
import webpack from 'webpack';
import { renderHtml } from './render';

import express, { Express, Request, Response, NextFunction } from 'express';
import { createHotServer } from 'webpack-hmr-server';

interface Manifest {
  js: {
    initialJS: string[];
    allJS: string[];
  };
}

export interface DevServerProps {
  config: Config;
}

export interface Application {
  renderBody: (state: unknown) => Promise<string>;
  registry: {
    clear: () => void;
  };
}

export class DevServer {
  private application: Application | null = null;
  private expressApp: Express = express();
  private server = http.createServer(this.expressApp);
  private hotServer = createHotServer(this.server);
  private isReady = false;
  private port = 0;
  private config: Config;

  constructor(props: DevServerProps) {
    this.port = props.config.debug.httpPort;
    this.config = props.config;
    this.useReadyMiddleware();
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
      }, 20);

      req.on('close', () => {
        clearInterval(timer);
      });
    });
  }

  public registerRouter() {
    this.expressApp.get('*', async (req, res) => {
      if (this.application === null) {
        return res.end('not ready');
      }

      // clear application registry cache
      this.ready(false);
      // Дожидаемся предыдущих рендеров (т.к там могут быть lazy load компоненты)
      // Маловеротяно что рендеринг будет более 300ms
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.application.registry.clear();
      this.ready(true);

      const state = await this.config.debug.getState({
        url: req.url,
      });

      const html = await renderHtml(this.application, state);
      // const html = this.application?.renderWidget('widget.cms.navbar@1-dev');

      return res.end(html);
    });
  }

  public ready(status: boolean) {
    this.isReady = status;
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
    const port = this.port;
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

  public injectApp(application: Application | null) {
    this.application = application;
  }
}
