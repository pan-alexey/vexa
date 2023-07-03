import { Client } from 'minio';
import path from 'path';
import { walk } from './walk';

export interface UploaderProps {
  [x: string]: unknown;
  BUCKET_NAME: string;
  S3_ACCESS_KEY: string;
  S3_ENDPOINT: string;
  S3_ENDPOINT_PORT: string;
  S3_SECRET_KEY: string;
}

export class Uploader {
  private client: Client;
  private bucket = 'cdn';

  constructor(props: UploaderProps) {
    this.client = new Client({
      endPoint: props.S3_ENDPOINT,
      port: parseInt(props.S3_ENDPOINT_PORT),
      useSSL: false,
      accessKey: props.S3_ACCESS_KEY,
      secretKey: props.S3_SECRET_KEY,
    });
  }

  public async upload(name: string, file: string) {
    return new Promise((res, rej) => {
      this.client.fPutObject(this.bucket, name, file, function (err: Error) {
        if (err) {
          rej(err);
        }
        res(true);
      });
    });
  }

  public async uploadDir(dir: string, prefix = './') {
    const files = await walk(dir);
    const promises: Array<Promise<unknown>> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = path.join(prefix, path.relative(dir, file));
      promises.push(this.upload(name, file));
    }

    await Promise.all(promises);
  }
}