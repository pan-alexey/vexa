import tar from 'tar';
import path from 'path';

/*
file: absolute path
cwd: absolute path with archive name (test.tgz)
*/
export const compress = (cwd: string, destination: string): Promise<void> => {
  return tar.c(
    {
      gzip: true,
      file: destination,
      cwd: cwd,
    },
    ['./'],
  );
};
