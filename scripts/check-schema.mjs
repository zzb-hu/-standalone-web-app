#!/usr/bin/env node

// CI gate: snapshot schema, regenerate, compare. Fail if drift detected.
// Usage: pnpm run schema:check

import fs from "node:fs";
import { execSync } from "node:child_process";

const schemaPath = "schema/pake.schema.json";

// Snapshot the current schema before regeneration.
// Missing file counts as empty string (first run).
const before = fs.existsSync(schemaPath)
  ? fs.readFileSync(schemaPath, "utf8")
  : "";

// Re-generate. generate-schema.mjs exits non-zero on failure; surface that.
try {
  execSync("node scripts/generate-schema.mjs", {
    stdio: "inherit",
    cwd: process.cwd(),
  });
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Schema generation failed: ${detail}`);
  process.exit(1);
}

// Compare with the snapshot.
let after;
try {
  after = fs.readFileSync(schemaPath, "utf8");
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Cannot read regenerated schema at ${schemaPath}: ${detail}`);
  process.exit(1);
}

if (before !== after) {
  console.error(
    "\n❌ schema/pake.schema.json is out of sync with bin/schema/cli-options-metadata.json.\n" +
      "   Run `pnpm run schema:generate` to update it, then commit the change.\n",
  );
  // Restore the original snapshot so the working tree is left untouched.
  try {
    if (before) {
      fs.writeFileSync(schemaPath, before);
    } else {
      fs.unlinkSync(schemaPath);
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Could not restore original schema after drift: ${detail}`);
  }
  process.exit(1);
}

console.log("✓ schema/pake.schema.json is up to date with metadata.");
