import path from 'path';
import { resolvePackageFile } from '../libs/packages';

export const packagePath = process.cwd();
export const widgetDist = path.resolve(packagePath, './dist') as string;
export const widgetSource = path.resolve(packagePath, './src/index.tsx') as string;
export const widgetBootstrap = resolvePackageFile('@vexa/cli-app/module/bootstrap.ts') as string;

// export const widgetBuild = path.resolve(packagePath, './dist') as string;
export const widgetBuild = path.resolve(packagePath, './node_modules/.vexa.build') as string;
export const widgetBuildServer = path.resolve(widgetBuild, './server') as string;
export const widgetBuildClient = path.resolve(widgetBuild, './client') as string;
