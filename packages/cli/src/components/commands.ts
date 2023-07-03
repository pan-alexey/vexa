import { Command, Option } from 'commander';
const program = new Command();

export interface CommandConfig {
  config: string;
  mode: 'build' | 'dev' | 'publish' | 'test';
}

export default (): Promise<CommandConfig> =>
  new Promise((resolve) => {
    program.name('vexa-cli').description('CLI to build widget').version('1.0.0');
    program
      .command('build')
      .description('Build for prod')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'build',
          config: args.config,
        };

        resolve(result);
      });

    program
      .command('dev')
      .description('Run development mode')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'dev',
          config: args.config,
        };

        resolve(result);
      });

    program
      .command('publish')
      .description('Publish widget to storage')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'publish',
          config: args.config,
        };

        resolve(result);
      });

    program
      .command('test')
      .description('Test widget')
      .addOption(
        new Option('-c, --config <config>', 'configuration path').default('./config/main.ts', './config/main.ts'),
      )
      .action((args) => {
        const result: CommandConfig = {
          mode: 'test',
          config: args.config,
        };

        resolve(result);
      });

    program.parse();
  });
