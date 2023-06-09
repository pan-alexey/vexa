import * as webpack from 'webpack';
import path from 'path';
import fs from 'fs-extra';

export interface ManifestPluginProps {
  output: string;
}

const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file);
const isJS = (file: string): boolean => /\.js(\?[^.]+)?$/.test(file);

export class ManifestAssetsPlugin {
  private output: string;

  constructor(opts: ManifestPluginProps) {
    this.output = opts.output;
  }

  apply(compiler: webpack.Compiler) {
    // Important use afterEmit hook
    compiler.hooks.afterEmit.tapAsync('vexa-manifest-plugin', async (compilation, next) => {
      const result: {
        js: Record<string, string>;
        css: Record<string, string>;
      } = {
        js: {},
        css: {},
      };

      // Get css files
      const promisesCss: Array<Promise<string>> = [];
      const promisesJS: Array<Promise<string>> = [];
      const filesCss: Array<string> = [];
      const filesJs: Array<string> = [];

      Object.keys(compilation.assets).forEach((key) => {
        if (isCSS(key) && compilation.outputOptions.path) {
          const file = path.resolve(compilation.outputOptions.path, key);
          filesCss.push(key);
          promisesCss.push(fs.readFile(file, 'utf8'));
        }

        if (isJS(key) && compilation.outputOptions.path) {
          const file = path.resolve(compilation.outputOptions.path, key);
          filesJs.push(key);
          promisesJS.push(fs.readFile(file, 'utf8'));
        }
      });

      const promiseCssAll = await Promise.all(promisesCss);
      const promiseJsAll = await Promise.all(promisesJS);
  
      const css: Record<string, string> = {};
      for (let i = 0; i < filesCss.length; i++) {
        const key = filesCss[i];
        const value = promiseCssAll[i];
        css[key] = value;
      }
      result.css = css;

      const js: Record<string, string> = {};
      for (let i = 0; i < filesJs.length; i++) {
        const key = filesJs[i];
        const value = promiseJsAll[i];
        js[key] = value;
      }
      result.js = js;

      await fs.ensureDirSync(path.dirname(this.output));
      await fs.writeJson(this.output, result);
      next();
    });
  }
}
