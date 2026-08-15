/**
 * dsh-learning-mode — cordis plugin row for the dsh-learning-mode bundle.
 *
 * The single host row of this bundle. Its only job is to install the
 * packaged `preset/learning-mode/` directory (the 学习模式 agent preset) into
 * `$DSH_HOME/.agent-presets/<presetId>/`, so the preset becomes selectable
 * in every profile once the bundle is installed via `dsh plugin add`.
 *
 * Zero runtime dependencies: everything comes from Node builtins, so the
 * bundle activates in any profile without extra packages.
 *
 * Idempotent and best-effort, mirroring the pattern used by dsh-data-agent:
 * - an existing target directory is left untouched (user edits survive);
 * - a failure logs a warning with manual install instructions instead of
 *   failing the boot.
 *
 * @module dsh-learning-mode
 */
import { access, cp, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** Cordis plugin name (diagnostics only). */
const name = "learning-mode-installer";

/** Default preset id (the directory name under `$DSH_HOME/.agent-presets/`). */
const DEFAULT_PRESET_ID = "learning-mode";

/**
 * Resolve the harness home the same way @deepseek-ai/dsh-home-paths does:
 * `$DSH_HOME` when set, otherwise `~/.dsh`.
 */
function resolveDshHome() {
	return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}

/**
 * Install the packaged `preset/learning-mode/` directory into
 * `$DSH_HOME/.agent-presets/<presetId>/`. Idempotent: an existing target
 * directory is left untouched (user edits survive). Best-effort — a failure
 * logs a warning with manual install instructions instead of failing the
 * boot.
 */
async function installPreset(ctx, presetId) {
	const targetDir = join(resolveDshHome(), ".agent-presets", presetId);
	try {
		await access(targetDir);
		ctx.logger.info("dsh-learning-mode: preset \"%s\" already present at %s, skipping install", presetId, targetDir);
		return;
	} catch {}
	const sourceDir = fileURLToPath(new URL("../preset/learning-mode/", import.meta.url));
	try {
		await mkdir(targetDir, { recursive: true });
		await cp(sourceDir, targetDir, { recursive: true });
		ctx.logger.info("dsh-learning-mode: installed preset \"%s\" to %s", presetId, targetDir);
	} catch (error) {
		ctx.logger.warn(
			"dsh-learning-mode: failed to install preset \"%s\" to %s (%s); copy plugin/preset/learning-mode/ manually to enable 学习模式",
			presetId,
			targetDir,
			error instanceof Error ? error.message : String(error)
		);
	}
}

/**
 * Cordis plugin entry. `config.presetId` overrides the installed directory
 * name; `config.installPreset: false` skips the install entirely.
 */
function apply(ctx, config = {}) {
	const presetId = config.presetId ?? DEFAULT_PRESET_ID;
	const install = config.installPreset ?? true;
	if (install) installPreset(ctx, presetId);
}

export { apply, installPreset, name, resolveDshHome };
