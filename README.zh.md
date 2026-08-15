# dsh-learning-mode · 学习模式

[English](README.md) | 中文

面向 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Agent 预设，模拟 Claude Code 官方 **Learning** 输出风格：**边做边教** —— 具体、形象地解释新概念（含使用情景）、用提问引导你思考、并显式留出练习让你亲手操作。

> Learning output style (Claude Code): *"Collaborative, learn-by-doing mode where Claude will not only share 'Insights' while coding, but also ask you to contribute small, strategic pieces of code yourself."*

## 三大支柱

| 支柱 | 行为 |
|---|---|
| **A · 具体阐释** | 灵活讲解（与当前任务绑定）：日常类比（把抽象变具体，边界按需点明）+ 情景阐释（何时用、用哪个、为什么结果不一致）按需选用；简单概念一两句带过，复杂概念才铺开。按「表层→中层→深层」分层，按需加深；同一概念会话内不重复灌输 |
| **B · 引导思考** | 先问后答：在你能自己得出的关键结论处先抛一个精准问题（预测-验证式）。卡住时走三级提示阶梯：L1 指观察点 → L2 指原理 → L3 揭示并讲解 |
| **C · 留白练习** | 把适合练手的小块工作显式留给你，统一标记 `TODO(你)`（对应 Claude Code 的 `TODO(human)`）。小块、战略性、**贴合你当下的实际任务/场景**（练习长在你正在做的事上）、可自验收；安全/不可逆/决定正确性的步骤永不留白 |

**交互协议**：默认教学优先；你说「直接做 / 我来不及 / 尽快」即切直接模式完整执行；开场只问一次你的熟悉程度（入门/进阶/熟练）；尝试失败 ≥2 次自动降级为引导式揭示。语言跟随你：中文进中文出，英文进英文出。

## 示例

[《DeepSeek Harness 原理讲解》——学习模式真实会话的逐字教学输出](docs/examples/dsh-principles.md)——完整展示"具体阐释 + 引导思考 + 留白练习 + 开场校准"如何协作。这份文件是**面向人的文档，不参与任何 skill 加载**：学习模式的 skill 只教原则与形式（占位符模板），具体例子由模型在运行时根据你当下的任务现编，避免固定例子削弱泛化。想给 skill 留一个永久例子时，请放这里，**不要**放进 `learning-mode/skills/`。

## 安装

要求 DSH `0.1.0-rc.x`（在 `~/.dsh` 下有 `profiles/` 的部署）。

```bash
# 方式一：clone 后复制
git clone https://github.com/CHplus0/dsh-learning-mode.git
cp -r dsh-learning-mode/learning-mode ~/.dsh/.agent-presets/

# 方式二：直接运行安装脚本
bash dsh-learning-mode/install.sh
```

然后在 DSH 的 Web 界面**新建会话**，预设选择器里选 **学习模式** 即可（无需重启）。

### 自定义

- 语气/身份：编辑 `learning-mode/agent.cordis.yml` → `persona.text`。
- 教学细则与措辞模板：编辑 `learning-mode/skills/learning-mode/SKILL.md`。
- 改名：只改 `learning-mode/preset.yml` 的 `name`（目录名 `learning-mode` 即预设 id，需匹配 `[a-z0-9][a-z0-9-]*`，改名需同步目录名）。

## 工作原理

- `agent.cordis.yml` 是 `standard` 预设的完整副本，仅两处改动：`persona` 换成教学身份（常驻系统提示词的三条铁律），`skill-filesystem` 增加 `customSkillDirs` 指向本预设自带的 `skills/` 目录（完整细则按需加载，不占常驻 token）。
- 工具集与标准编码 Agent 完全相同（Shell、文件、检索、Skills、计划、目标、子代理、工作流）。

## 许可证

MIT © 2026 CHplus0。预设组合改编自 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 `standard` agent preset（MIT © 2026 DeepSeek），详见 `LICENSE`。
