import { Application as MainApp } from './application';
import { getSelfModulePath } from './libs/module/self-module';
import fs from 'fs-extra';
import path from 'path';

export class Application extends MainApp {
  private assets: {
    css: Record<string, string>,
    js: Record<string, string>,
  } = {
    css: {},
    js: {},
  };

  public async init() {
    await this.loadAssets();
  }

  private async loadAssets() {
    const appPackagePath = getSelfModulePath();
    const clientPath = path.resolve(appPackagePath, './dist/client');
    const manifestPath = path.resolve(clientPath, './manifest.json');
    this.assets = await fs.readJSON(manifestPath);
  }

  public getAppAssets(): Record<string, string> {
    return this.assets.js
  }
}