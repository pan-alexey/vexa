import * as webpack from 'webpack';
import path from 'path';
import fs from 'fs-extra';

export interface ManifestPluginProps {
  output: string;
}

const isCSS = (file: string): boolean => /\.css(\?[^.]+)?$/.test(file);

export class ManifestAssetsPlugin {
  private output: string;

  constructor(opts: ManifestPluginProps) {
    this.output = opts.output;
  }

  apply(compiler: webpack.Compiler) {
    // Important use afterEmit hook
    compiler.hooks.afterEmit.tapAsync('vexa-manifest-plugin', async (compilation, next) => {
      const result: {
        module: string;
        css: Record<string, string>;
      } = {
        module: 'module.js',
        css: {},
      };

      // Get css files
      const promises: Array<Promise<string>> = [];
      const files: Array<string> = [];
      Object.keys(compilation.assets).forEach((key) => {
        if (isCSS(key) && compilation.outputOptions.path) {
          const file = path.resolve(compilation.outputOptions.path, key);
          files.push(key);
          promises.push(fs.readFile(file, 'utf8'));
        }
      });
      const promiseAll = await Promise.all(promises);
      const css: Record<string, string> = {};
      for (let i = 0; i < files.length; i++) {
        const key = files[i];
        const value = promiseAll[i];
        css[key] = value;
      }
      result.css = css;

      await fs.writeJson(this.output, result);
      next();
    });
  }
}
