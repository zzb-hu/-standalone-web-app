#!/usr/bin/env node

/**
 * sync-skills.mjs — One-way sync from WorkBuddy skills to Claude Code skills.
 *
 * Source:  .workbuddy/skills/<name>/SKILL.md
 * Target:  .claude/skills/<name>/SKILL.md
 *
 * Strategy: copy (not symlink) to avoid Windows symlink issues.
 * Incremental: only copies files whose mtime is newer than the target.
 * Idempotent: running twice with no source changes is a no-op.
 *
 * Usage:
 *   node scripts/sync-skills.mjs              # sync (incremental)
 *   node scripts/sync-skills.mjs --force      # sync (overwrite all)
 *   node scripts/sync-skills.mjs --check      # check drift, exit 1 if out of sync
 *   node scripts/sync-skills.mjs --clean      # remove Claude targets not in source
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const SOURCE_DIR = path.join(root, '.workbuddy', 'skills');
const TARGET_DIR = path.join(root, '.claude', 'skills');

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force');
const CHECK = args.has('--check');
const CLEAN = args.has('--clean');

// --- helpers ---

function listSkillDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function isNewer(src, dst) {
  if (!fs.existsSync(dst)) return true;
  return fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs;
}

function filesAreIdentical(src, dst) {
  if (!fs.existsSync(dst)) return false;
  const a = fs.readFileSync(src);
  const b = fs.readFileSync(dst);
  return a.length === b.length && a.equals(b);
}

// --- main ---

const sourceSkills = listSkillDirs(SOURCE_DIR);
const targetSkills = listSkillDirs(TARGET_DIR);

if (sourceSkills.length === 0) {
  console.error(`No skills found in ${SOURCE_DIR}`);
  process.exit(1);
}

let copied = 0;
let skipped = 0;
let drift = 0;

for (const skillName of sourceSkills) {
  const srcSkillDir = path.join(SOURCE_DIR, skillName);
  const dstSkillDir = path.join(TARGET_DIR, skillName);
  const srcFile = path.join(srcSkillDir, 'SKILL.md');
  const dstFile = path.join(dstSkillDir, 'SKILL.md');

  if (!fs.existsSync(srcFile)) {
    console.warn(`  skip ${skillName}: no SKILL.md in source`);
    continue;
  }

  if (CHECK) {
    if (!filesAreIdentical(srcFile, dstFile)) {
      console.error(`  drift: ${skillName}/SKILL.md differs`);
      drift++;
    } else {
      console.log(`  ok:    ${skillName}/SKILL.md`);
    }
    continue;
  }

  if (FORCE || isNewer(srcFile, dstFile)) {
    copyFile(srcFile, dstFile);
    console.log(`  synced: ${skillName}/SKILL.md`);
    copied++;
  } else {
    console.log(`  up-to-date: ${skillName}/SKILL.md`);
    skipped++;
  }
}

// Clean: remove target skills that no longer exist in source.
if (CLEAN) {
  for (const skillName of targetSkills) {
    if (!sourceSkills.includes(skillName)) {
      const staleDir = path.join(TARGET_DIR, skillName);
      fs.rmSync(staleDir, { recursive: true, force: true });
      console.log(`  removed stale: ${skillName}/`);
    }
  }
}

if (CHECK) {
  if (drift > 0) {
    console.error(`\n${drift} skill(s) out of sync. Run: node scripts/sync-skills.mjs`);
    process.exit(1);
  }
  console.log(`\nAll ${sourceSkills.length} skill(s) in sync.`);
  process.exit(0);
}

console.log(
  `\nDone: ${copied} copied, ${skipped} up-to-date, ${sourceSkills.length} total.`,
);
