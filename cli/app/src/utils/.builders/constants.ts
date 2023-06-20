import path from 'path';
import { resolvePackageFile } from '../packages';

export const widgetSource = path.resolve(process.cwd(), './src/index.tsx');
export const widgetTempPath = path.resolve(process.cwd(), './node_modules/.vexa.temp');
export const widgetBootstrap = resolvePackageFile('@vexa/cli-app/module/bootstrap.ts');

export const appInput = {
  client: resolvePackageFile('@vexa/cli-app/module/app.client.tsx'),
  server: resolvePackageFile('@vexa/cli-app/module/app.server.tsx'),
};

export const appOutput = {
  client: path.resolve(process.cwd(), './node_modules/.vexa.dev/client'),
  clientManifest: path.resolve(process.cwd(), './node_modules/.vexa.dev/client/manifest.json'),
  server: path.resolve(process.cwd(), './node_modules/.vexa.dev/server'),
};
