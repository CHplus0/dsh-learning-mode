# dsh-learning-mode

English | [中文](README.zh.md)

An agent preset for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) that teaches while coding, modeled on Claude Code's official **Learning** output style: explain concretely with usage scenarios, guide your thinking with questions, and leave explicit practice blanks for you to do by hand.

> Learning output style (Claude Code): *"Collaborative, learn-by-doing mode where Claude will not only share 'Insights' while coding, but also ask you to contribute small, strategic pieces of code yourself."*

## Three Pillars

| Pillar | Behavior |
|---|---|
| **A · Concrete, scenario-grounded explanations** | Flexible, task-tied explanations: everyday analogy (boundaries marked when applicable) + scenario grounding (when/which/why results differ), used as needed; simple concepts get a sentence or two, complex ones get expanded. Depth layered (surface → medium → deep), deepen on demand; no re-teaching within a session |
| **B · Guided thinking** | Question first: at conclusions you can reach yourself, ask one precise predict-then-verify question. When stuck, climb the hint ladder: L1 point at what to look at → L2 point at the principle → L3 reveal with explanation |
| **C · Practice blanks** | Leave small, strategic pieces to you, marked `TODO(你)` (Claude Code's `TODO(human)`). Small, strategic, tied to what you're actually doing, self-verifiable; never blank safety-critical, irreversible, or correctness-critical steps |

**Interaction protocol**: Teaching-first by default; "just do it / no time / asap" switches to direct mode; asks your familiarity level (beginner/intermediate/advanced) once at the start; ≥2 failed attempts downgrades to a guided reveal. Output language follows your input: Chinese in, Chinese out; English in, English out.

## Examples

[Full `df` vs `du` worked example](docs/examples/df-vs-du.md) — one complete expansion of the scenario-grounding technique (command-line concepts). This file is **human documentation and is never loaded by any skill**: the learning-mode skill teaches only principles and forms (placeholder templates); concrete examples are invented at runtime from your current task, so fixed examples cannot degrade generalization. If you want to keep a permanent example, put it here — **not** in `learning-mode/skills/`.

## Install

Requires DSH `0.1.0-rc.x` (a deployment with `profiles/` under `~/.dsh`).

```bash
# Option 1: clone and copy
git clone https://github.com/CHplus0/dsh-learning-mode.git
cp -r dsh-learning-mode/learning-mode ~/.dsh/.agent-presets/

# Option 2: run the installer
bash dsh-learning-mode/install.sh
```

Then open the DSH web UI, start a **new session** and pick **学习模式 (Learning Mode)** — no restart needed.

### Customization

- Tone & identity: edit `learning-mode/agent.cordis.yml` → `persona.text`.
- Style details & phrasing templates: edit `learning-mode/skills/learning-mode/SKILL.md`.
- Rename: edit only `name` in `learning-mode/preset.yml` (the directory name is the preset id, must match `[a-z0-9][a-z0-9-]*`; renaming requires renaming the directory too).

## How it works

- `agent.cordis.yml` is a full copy of the `standard` preset with two changes: the `persona` is replaced with the teaching identity (the three pillars, always in the system prompt), and `skill-filesystem` gains `customSkillDirs` pointing at this preset's bundled `skills/` directory (the full guide loads on demand, not in the standing prompt). The toolset is identical to the standard coding agent (Shell, files, search, Skills, planning, goals, subagents, workflows).

## License

MIT © 2026 CHplus0. The preset composition is adapted from the `standard` agent preset of [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (MIT © 2026 DeepSeek); see `LICENSE`.
