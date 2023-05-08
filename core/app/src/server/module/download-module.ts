import * as Http from 'http';
import * as Https from 'https';
import * as Url from 'url';
import * as tar from 'tar';
import mkdirp from 'mkdirp';

// Manual testing

const customAgents = {
  http: new Http.Agent({ keepAlive: true }),
  https: new Http.Agent({ keepAlive: true }),
}

export const download = async (url: string, output: string) => new Promise((resolve, reject) => {
  const uri = Url.parse(url);
  if (!uri.protocol || !['https:', 'http:'].includes(uri.protocol)) {
    return reject('protocol not supported');
  }

  const get = uri.protocol === 'https:' ? Https.get : Http.get;
  const agent = uri.protocol === 'https:' ? customAgents.https : customAgents.http;

  const tarPipe = tar.extract({
    C: output,
  })

  get(url, { agent, headers: { 'user-agent': 'nodejs' } }, (response) => {
    response
      .pipe(tarPipe)
      .on('error', () => {
        reject('Error tar')
      })
      .on('finish', () => {
        resolve(output)
      })
  });
});

export const donwloadModule = async (url: string, output: string) => {
  await mkdirp(output);
  await download(url, output);
}
