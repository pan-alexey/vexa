import path from 'path';
import { resolvePackageFile } from '../libs/packages';

// For build widget packages
export const packagePath = process.cwd();
export const widgetDist = path.resolve(packagePath, './dist') as string;
export const widgetSource = path.resolve(packagePath, './src/index.tsx') as string;

export const widgetNullEntry = resolvePackageFile('@vexa/cli-app/module/null.ts') as string;
export const widgetBuild = path.resolve(packagePath, './node_modules/.vexa.build') as string;
export const widgetBuildServer = path.resolve(widgetBuild, './server') as string;
export const widgetBuildClient = path.resolve(widgetBuild, './client') as string;

// For dev application
export const widgetAppClient = resolvePackageFile('@vexa/cli-app/module/app.client.tsx') as string;
export const widgetAppServer = resolvePackageFile('@vexa/cli-app/module/app.server.tsx') as string;

export const widgetAppDist = path.resolve(packagePath, './node_modules/.vexa.app') as string;
export const widgetAppDistServer = path.resolve(widgetAppDist, './server') as string;
export const widgetAppDistClient = path.resolve(widgetAppDist, './client') as string;
