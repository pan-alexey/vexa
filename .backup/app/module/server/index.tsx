import fs from 'fs-extra';
import path from 'path';
import { Application as MainApp } from './application';
import { getSelfModulePath } from './libs/module/self-module';
export { Tracker } from './components/tracker';

export class Application extends MainApp {
  private hostAssets: {
    css: Record<string, string>,
    js: Record<string, string>,
  } = {
    css: {},
    js: {},
  };

  public async init() {
    await this.loadAppAssets();
  }

  public getHostClientPath() {
    const appPackagePath = getSelfModulePath();
    const clientPath = path.resolve(appPackagePath, './dist/client');
    return clientPath;
  }

  public getHostJs() {
    return this.hostAssets.js;
  }

  public getHostCss() {
    return this.hostAssets.css;
  }

  private async loadAppAssets() {
    const clientPath = this.getHostClientPath();
    const manifestPath = path.resolve(clientPath, './manifest.json');
    this.hostAssets = await fs.readJSON(manifestPath);
  }
}