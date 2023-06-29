import path from 'path';
import fs from 'fs-extra';

interface Manifest {
  jsModule: string;
  css: Record<string, string>;
}

export const loadManifest = async (serverModulePath: string): Promise<Manifest> => {
  const modulePath = path.resolve(serverModulePath, 'manifest.json');
  return (await fs.readJson(modulePath)) as Manifest;
};
