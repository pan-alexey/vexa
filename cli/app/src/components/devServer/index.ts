import * as http from 'http';
import path from 'path';
import { AddressInfo } from 'net';
import webpack from 'webpack';

import express, { Express, Request, Response, NextFunction } from 'express';
import { createHotServer } from 'webpack-hmr-server';
import fs from 'fs-extra';

interface Manifest {
  js: {
    initialJS: string[];
    allJS: string[];
  };
}

export interface DevServerProps {
  port: number;
}

export class DevServer {
  private expressApp: Express = express();
  private server = http.createServer(this.expressApp);
  private hotServer = createHotServer(this.server);
  private isReady = false;
  private port = 0;

  constructor(props: DevServerProps) {
    this.useReadyMiddleware();
    this.port = props.port;
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
}
