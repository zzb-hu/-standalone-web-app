#!/usr/bin/env node

// Generates schema/pake.schema.json from bin/schema/cli-options-metadata.json.
// This is the single source of truth for the --config JSON contract.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const metadataPath = path.join(root, 'bin', 'schema', 'cli-options-metadata.json');

let metadata;
try {
  const raw = fs.readFileSync(metadataPath, 'utf8');
  metadata = JSON.parse(raw);
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Failed to read/parse ${metadataPath}: ${detail}`);
  process.exit(1);
}

if (!Array.isArray(metadata)) {
  console.error(
    `Expected ${metadataPath} to contain a JSON array, got ${typeof metadata}`,
  );
  process.exit(1);
}

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://raw.githubusercontent.com/tw93/Pake/main/schema/pake.schema.json',
  title: 'Pake CLI config file',
  description:
    'Declarative config for `pake --config <path>`. Fields mirror the camelCase CLI options; an explicit CLI flag always wins over a config field. Invocation concerns (--json, --config) are CLI-only.',
  type: 'object',
  additionalProperties: false,
  properties: {
    $schema: {
      type: 'string',
      description: 'Optional reference to this schema for editor validation.',
    },
    url: {
      type: 'string',
      description:
        'Web URL, local HTML file, or local directory to package. A positional CLI argument wins over this field.',
    },
  },
};

for (const meta of metadata) {
  if (!meta || typeof meta !== 'object') {
    console.error(`Skipping non-object metadata entry: ${JSON.stringify(meta)}`);
    continue;
  }
  if (meta.cliOnly) continue;
  if (!meta.attributeName || typeof meta.attributeName !== 'string') {
    console.error(
      `Skipping metadata entry without attributeName: ${JSON.stringify(meta)}`,
    );
    continue;
  }
  if (!meta.schemaType) {
    console.error(
      `Skipping metadata entry "${meta.attributeName}" without schemaType`,
    );
    continue;
  }

  const prop = { type: meta.schemaType, description: meta.description };

  if (meta.defaultValue !== undefined && meta.defaultValue !== null) {
    prop.default = meta.defaultValue;
    // Don't include empty-string defaults for cleanliness
    if (meta.schemaType === 'string' && meta.defaultValue === '') {
      delete prop.default;
    }
  }

  if (meta.schemaMin !== undefined && meta.schemaMin !== null) {
    prop.minimum = meta.schemaMin;
  }
  if (meta.schemaMax !== undefined && meta.schemaMax !== null) {
    prop.maximum = meta.schemaMax;
  }
  if (meta.schemaType === 'array') {
    prop.items = { type: 'string' };
  }

  schema.properties[meta.attributeName] = prop;
}

const outPath = path.join(root, 'schema', 'pake.schema.json');
try {
  fs.writeFileSync(outPath, JSON.stringify(schema, null, 2) + '\n');
  console.log(
    `Generated ${outPath} with ${Object.keys(schema.properties).length} properties`,
  );
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Failed to write ${outPath}: ${detail}`);
  process.exit(1);
}
