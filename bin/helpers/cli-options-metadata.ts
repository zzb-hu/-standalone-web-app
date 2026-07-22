import metadata from '../schema/cli-options-metadata.json';

export interface CliOptionMeta {
  attributeName: string;
  cliFlag: string;
  description: string;
  defaultValue?: unknown;
  schemaType: 'string' | 'number' | 'boolean' | 'array';
  schemaMin?: number;
  schemaMax?: number;
  hideHelp?: boolean;
  cliOnly?: boolean;
  platformOnly?: 'macos' | 'windows' | 'linux';
  customParser?: 'inject' | 'zoom' | 'hideOnClose' | 'number';
}

export const CLI_OPTIONS_METADATA: CliOptionMeta[] =
  metadata as CliOptionMeta[];
