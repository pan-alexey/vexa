import tar from 'tar';
import path from 'path';

/*
file: absolute path
cwd: absolute path with archive name (test.tgz)
*/
export const compress = (cwd: string, destanation: string): Promise<void> => {
  return tar.c(
    {
      gzip: true,
      file: destanation,
      cwd: cwd,
    },
    ['./'],
  );
};
