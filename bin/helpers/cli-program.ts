import chalk from 'chalk';
import { program, Option } from 'commander';
import packageJson from '../../package.json';
import { CLI_OPTIONS_METADATA } from './cli-options-metadata';
import { DEFAULT_PAKE_OPTIONS as DEFAULT } from '../defaults';
import { validateNumberInput, validateUrlInput } from '../utils/validate';

export function getCliProgram() {
  const { green, yellow } = chalk;
  const logo = `${chalk.green(' ____       _')}
${green('|  _ \\ __ _| | _____')}
${green('| |_) / _` | |/ / _ \\')}
${green('|  __/ (_| |   <  __/')}  ${yellow('https://github.com/tw93/pake')}
${green('|_|   \\__,_|_|\\_\\___|  can turn any webpage into a desktop app with Rust.')}
`;

  const cmd = program
    .addHelpText('beforeAll', logo)
    .usage(`[url] [options]`)
    .helpOption('-h, --help', 'Show all CLI options')
    .showHelpAfterError()
    .argument('[url]', 'The web URL you want to package', validateUrlInput);

  // Register every option from the single metadata source.
  for (const meta of CLI_OPTIONS_METADATA) {
    if (!meta.cliFlag || !meta.attributeName) {
      // Skip malformed entries silently; generate-schema.mjs already warns.
      continue;
    }
    const option = new Option(
      meta.cliFlag,
      meta.description || '',
    );

    // Default value from DEFAULT_PAKE_OPTIONS
    const defaultValue = (DEFAULT as unknown as Record<string, unknown>)[meta.attributeName];
    if (defaultValue !== undefined) {
      option.default(defaultValue);
    }

    // Custom arg parsers
    switch (meta.customParser) {
      case 'inject':
        option.argParser((val: string, previous: string[] | undefined) => {
          if (!val) return DEFAULT.inject;
          const files = val
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
          return previous ? [...previous, ...files] : files;
        });
        break;
      case 'zoom':
        option.argParser((value: string) => {
          const zoom = Number(value);
          if (!Number.isInteger(zoom) || zoom < 50 || zoom > 200) {
            throw new Error('--zoom must be an integer between 50 and 200');
          }
          return zoom;
        });
        break;
      case 'hideOnClose':
        option.argParser((value: string | undefined) => {
          if (value === undefined) return true;
          if (value === 'true') return true;
          if (value === 'false') return false;
          throw new Error('--hide-on-close must be true or false');
        });
        break;
      case 'number':
        option.argParser(validateNumberInput);
        break;
    }

    // Hide from --help when marked
    if (meta.hideHelp) {
      option.hideHelp();
    }

    cmd.addOption(option);
  }

  return cmd
    .version(packageJson.version, '-v, --version')
    .configureHelp({
      sortSubcommands: true,
      visibleOptions: (command) => {
        const options = [...command.options];
        const helpOption = (command as unknown as { _helpOption?: Option })
          ._helpOption;
        if (helpOption) {
          options.push(helpOption);
        }
        return options;
      },
      optionTerm: (option) => {
        return option.flags;
      },
      optionDescription: (option) => {
        return option.description;
      },
    });
}
