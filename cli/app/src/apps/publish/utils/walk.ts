import fs from 'fs-extra';
import path from 'path';

export async function walk(dir: string, filelist: string[] = []) {
  const files = await fs.readdir(dir);

  // TODO Promise all;
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = await fs.stat(filepath);

    if (!stat.isDirectory()) {
      filelist.push(filepath);
    } else {
      filelist = await walk(filepath, filelist);
    }
  }

  return filelist;
}
