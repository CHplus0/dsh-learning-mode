# dsh-learning-mode · 学习模式 (Learning Mode)

An agent preset for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) that teaches while coding, modeled on Claude Code's official **Learning** output style: explain concretely with usage scenarios, guide your thinking with questions, and leave explicit practice blanks for you to do by hand.
面向 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Agent 预设，模拟 Claude Code 官方 **Learning** 输出风格：**边做边教** —— 具体、形象地解释新概念（含使用情景）、用提问引导你思考、并显式留出练习让你亲手操作。

> Learning output style (Claude Code): *"Collaborative, learn-by-doing mode where Claude will not only share 'Insights' while coding, but also ask you to contribute small, strategic pieces of code yourself."*

## 三大支柱 / Three Pillars

| 支柱 / Pillar | 行为 / Behavior |
|---|---|
| **A · 具体阐释** / Concrete, scenario-grounded explanations | 灵活讲解（与当前任务绑定）：日常类比（把抽象变具体，边界按需点明）+ 情景阐释（何时用、用哪个、为什么结果不一致）按需选用；简单概念一两句带过，复杂概念才铺开。按「表层→中层→深层」分层，按需加深；同一概念会话内不重复灌输 / Flexible, task-tied explanations: everyday analogy (boundaries marked when applicable) + scenario grounding (when/which/why results differ), used as needed; simple concepts get a sentence or two, complex ones get expanded. Depth layered, deepen on demand; no re-teaching within a session |
| **B · 引导思考** / Guided thinking | 先问后答：在你能自己得出的关键结论处先抛一个精准问题（预测-验证式）。卡住时走三级提示阶梯：L1 指观察点 → L2 指原理 → L3 揭示并讲解 / Question first: at conclusions you can reach yourself, ask one precise predict-then-verify question. When stuck, climb the hint ladder: L1 point at what to look at → L2 point at the principle → L3 reveal with explanation |
| **C · 留白练习** / Practice blanks | 把适合练手的小块工作显式留给你，统一标记 `TODO(你)`（对应 Claude Code 的 `TODO(human)`）。小块、战略性、**贴合你当下的实际任务/场景**（探索新环境就接真实命令，执行计划任务时回归任务本身）、可自验收；安全/不可逆/决定正确性的步骤永不留白 / Leave small, strategic pieces to you, marked `TODO(你)` (Claude Code's `TODO(human)`). Small, strategic, **tied to what you're actually doing** (real commands when exploring a new environment; the task itself when executing a planned one), self-verifiable; never blank safety-critical, irreversible, or correctness-critical steps |

配套**交互协议** / Interaction protocol：默认教学优先；你说「直接做 / 我来不及 / 尽快」即切直接模式完整执行；开场只问一次你的熟悉程度（入门/进阶/熟练）；尝试失败 ≥2 次自动降级为引导式揭示。语言跟随你：中文进中文出，英文进英文出。
/ Teaching-first by default; "just do it / no time / asap" switches to direct mode; asks your familiarity level (beginner/intermediate/advanced) once at the start; ≥2 failed attempts downgrades to a guided reveal. Output language follows your input: Chinese in, Chinese out; English in, English out.

## 安装 / Install

Requires DSH `0.1.0-rc.x` (a deployment with `profiles/` under `~/.dsh`). 要求 DSH `0.1.0-rc.x`（在 `~/.dsh` 下有 `profiles/` 的部署）。

```bash
# 方式一：clone 后复制 / Option 1: clone and copy
git clone https://github.com/CHplus0/dsh-learning-mode.git
cp -r dsh-learning-mode/learning-mode ~/.dsh/.agent-presets/

# 方式二：直接运行安装脚本 / Option 2: run the installer
bash dsh-learning-mode/install.sh
```

Then open the DSH web UI, start a **new session** and pick **学习模式 (Learning Mode)** — no restart needed.
然后在 DSH 的 Web 界面**新建会话**，预设选择器里选 **学习模式** 即可（无需重启）。

### 自定义 / Customization

- 语气/身份 / Tone & identity：edit `learning-mode/agent.cordis.yml` → `persona.text`.
- 教学细则与措辞模板 / Style details & phrasing templates：edit `learning-mode/skills/learning-mode/SKILL.md`.
- 改名 / Rename：只改 `learning-mode/preset.yml` 的 `name`（目录名 `learning-mode` 即预设 id，需匹配 `[a-z0-9][a-z0-9-]*`，改名需同步目录名）/ edit only `name` in `learning-mode/preset.yml` (the directory name is the preset id, must match `[a-z0-9][a-z0-9-]*`; renaming requires renaming the directory too).

## 工作原理 / How it works

- `agent.cordis.yml` 是 `standard` 预设的完整副本，仅两处改动：`persona` 换成教学身份（常驻系统提示词的三条铁律），`skill-filesystem` 增加 `customSkillDirs` 指向本预设自带的 `skills/` 目录（完整细则按需加载，不占常驻 token）。
- 工具集与标准编码 Agent 完全相同（Shell、文件、检索、Skills、计划、目标、子代理、工作流）。
- / `agent.cordis.yml` is a full copy of the `standard` preset with two changes: the `persona` is replaced with the teaching identity (the three pillars, always in the system prompt), and `skill-filesystem` gains `customSkillDirs` pointing at this preset's bundled `skills/` directory (the full guide loads on demand, not in the standing prompt). The toolset is identical to the standard coding agent (Shell, files, search, Skills, planning, goals, subagents, workflows).

## 许可证 / License

MIT © 2026 CHplus0. The preset composition is adapted from the `standard` agent preset of [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (MIT © 2026 DeepSeek); see `LICENSE`.
MIT © 2026 CHplus0。预设组合改编自 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 `standard` agent preset（MIT © 2026 DeepSeek），详见 `LICENSE`。
