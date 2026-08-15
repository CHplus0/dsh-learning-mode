/**
 * Sync the repo-root preset (the single source of truth) and LICENSE into the
 * publishable package layout before `npm pack` / `npm publish`.
 *
 * The plugin package ships `preset/learning-mode/` and `LICENSE` (declared in
 * `files`), but those are generated — editing the preset happens at the repo
 * root, never here. `prepack` runs this script, so a fresh clone + publish
 * always carries the current preset.
 */
import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, "..");
const repo = join(pkg, "..");

await mkdir(join(pkg, "preset"), { recursive: true });
await cp(join(repo, "learning-mode"), join(pkg, "preset", "learning-mode"), { recursive: true });
await cp(join(repo, "LICENSE"), join(pkg, "LICENSE"));
console.log("dsh-learning-mode: synced learning-mode/ and LICENSE into plugin/");
