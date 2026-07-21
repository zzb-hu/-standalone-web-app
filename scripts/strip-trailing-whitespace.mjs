#!/usr/bin/env node

// Strips trailing whitespace from .js/.ts files under tests/.
// Replaces the original BSD sed invocation in `pnpm run format` that failed
// on GNU sed (Linux/Windows).

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const testsDir = path.join(root, 'tests');

if (!fs.existsSync(testsDir)) {
  // No tests directory in this project; nothing to do.
  process.exit(0);
}

// Track visited real paths to skip symlink cycles safely.
const visited = new Set();

function walk(dir) {
  let realDir;
  try {
    realDir = fs.realpathSync(dir);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`skip unreadable dir ${dir}: ${detail}`);
    return;
  }
  if (visited.has(realDir)) return;
  visited.add(realDir);

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`skip unreadable dir ${dir}: ${detail}`);
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    // Use isDirectory on Dirent to follow symlinks; realpath check above
    // guards against cycles.
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
      let src;
      try {
        src = fs.readFileSync(full, 'utf8');
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.error(`skip unreadable file ${full}: ${detail}`);
        continue;
      }
      const stripped = src.replace(/[ \t]+$/gm, '');
      if (stripped !== src) {
        try {
          fs.writeFileSync(full, stripped);
          console.log(`stripped trailing whitespace: ${path.relative(root, full)}`);
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error);
          console.error(`failed to write ${full}: ${detail}`);
        }
      }
    }
  }
}

try {
  walk(testsDir);
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`strip-trailing-whitespace failed: ${detail}`);
  process.exit(1);
}
