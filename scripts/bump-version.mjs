#!/usr/bin/env node

// Bumps the version field across the four release-version files.
// Usage: node scripts/bump-version.mjs <x.y.z>

import fs from "node:fs";
import path from "node:path";

const newVersion = process.argv[2];
if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error("Usage: node scripts/bump-version.mjs <x.y.z>");
  console.error("Example: node scripts/bump-version.mjs 3.16.0");
  process.exit(1);
}

const root = process.cwd();

// Validate all four target files exist and are readable up front, so we
// can fail atomically instead of leaving the repo in a half-bumped state.
const targets = [
  { label: "package.json", file: "package.json" },
  { label: "src-tauri/Cargo.toml", file: path.join("src-tauri", "Cargo.toml") },
  { label: "src-tauri/Cargo.lock", file: path.join("src-tauri", "Cargo.lock") },
  {
    label: "src-tauri/tauri.conf.json",
    file: path.join("src-tauri", "tauri.conf.json"),
  },
];
for (const t of targets) {
  const abs = path.join(root, t.file);
  if (!fs.existsSync(abs)) {
    console.error(`Required file not found: ${t.file}`);
    console.error("Run this script from the Pake repository root.");
    process.exit(1);
  }
}

// Read all contents first.
let pkgRaw, cargoTomlRaw, cargoLockRaw, tauriConfRaw;
try {
  pkgRaw = fs.readFileSync(path.join(root, "package.json"), "utf8");
  cargoTomlRaw = fs.readFileSync(
    path.join(root, "src-tauri", "Cargo.toml"),
    "utf8",
  );
  cargoLockRaw = fs.readFileSync(
    path.join(root, "src-tauri", "Cargo.lock"),
    "utf8",
  );
  tauriConfRaw = fs.readFileSync(
    path.join(root, "src-tauri", "tauri.conf.json"),
    "utf8",
  );
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Failed to read version files: ${detail}`);
  process.exit(1);
}

// Parse and mutate.
const pkg = JSON.parse(pkgRaw);
const oldVersion = pkg.version;
if (oldVersion === newVersion) {
  console.error(`Version is already ${newVersion}; nothing to do.`);
  process.exit(0);
}
pkg.version = newVersion;
const newPkgRaw = JSON.stringify(pkg, null, 2) + "\n";

const cargoTomlVersionRegex = /^(version\s*=\s*)"[^"]+"/m;
if (!cargoTomlVersionRegex.test(cargoTomlRaw)) {
  console.error(
    'Cannot find version = "..." in src-tauri/Cargo.toml [package] section',
  );
  process.exit(1);
}
const newCargoTomlRaw = cargoTomlRaw.replace(
  cargoTomlVersionRegex,
  `$1"${newVersion}"`,
);

const cargoLockVersionRegex =
  /(\[\[package\]\]\s+name = "pake"\s+version = )"[^"]+"/;
if (!cargoLockVersionRegex.test(cargoLockRaw)) {
  console.error(
    'Cannot find [[package]] name = "pake" version = "..." in src-tauri/Cargo.lock',
  );
  process.exit(1);
}
const newCargoLockRaw = cargoLockRaw.replace(
  cargoLockVersionRegex,
  `$1"${newVersion}"`,
);

const tauriConf = JSON.parse(tauriConfRaw);
tauriConf.version = newVersion;
const newTauriConfRaw = JSON.stringify(tauriConf, null, 2) + "\n";

// All four inputs parsed and mutated successfully: now write them out.
try {
  fs.writeFileSync(path.join(root, "package.json"), newPkgRaw);
  fs.writeFileSync(path.join(root, "src-tauri", "Cargo.toml"), newCargoTomlRaw);
  fs.writeFileSync(path.join(root, "src-tauri", "Cargo.lock"), newCargoLockRaw);
  fs.writeFileSync(
    path.join(root, "src-tauri", "tauri.conf.json"),
    newTauriConfRaw,
  );
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(
    `Failed to write version files: ${detail}\n` +
      "  Repository may be in an inconsistent state; inspect each file manually.",
  );
  process.exit(1);
}

console.log(`Bumped version: ${oldVersion} -> ${newVersion}`);
console.log("");
console.log("Files updated:");
console.log("  - package.json");
console.log("  - src-tauri/Cargo.toml");
console.log("  - src-tauri/Cargo.lock");
console.log("  - src-tauri/tauri.conf.json");
console.log("");
console.log("Next steps:");
console.log(
  "  1. pnpm run cli:build          # rebuild dist/cli.js (embeds version)",
);
console.log("  2. git add -A");
console.log('  3. git commit -m "chore(release): v' + newVersion + '"');
console.log("  4. git tag V" + newVersion);
console.log("  5. git push origin main --tags");
