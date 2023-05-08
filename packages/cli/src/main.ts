import { CliConfig } from '@vexa/cli-config';
import type { Config } from '@vexa/cli-config';
export type { Config };

export const config = (configFn: () => Promise<Config>) => {
  return new CliConfig(configFn);
};

module.exports = config; // for js library;
export default config;
