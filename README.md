# dsh-learning-mode · 学习模式

一个面向 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Agent 预设（Agent Preset），模拟 Claude Code 官方 **Learning** 输出风格：**边做边教** —— 生动形象地解释新概念、用提问引导你思考、并显式留出练习让你亲手操作。

> Learning output style (Claude Code): *"Collaborative, learn-by-doing mode where Claude will not only share 'Insights' while coding, but also ask you to contribute small, strategic pieces of code yourself."*

## 三大支柱

| 支柱 | 行为 |
|---|---|
| **A · 生动阐释** | 讲解四步法：概念命名（中英双语，便于检索）→ 日常类比（并标注比喻的边界）→ 落到本任务的具体体现 → 最小可运行示例。按「表层 → 中层 → 深层」分层，按需加深；同一概念会话内不重复灌输 |
| **B · 引导思考** | 先问后答：在你能自己得出的关键结论处，先抛一个精准问题（预测-验证式）。卡住时走三级提示阶梯：L1 指观察点 → L2 指原理 → L3 揭示并讲解 |
| **C · 留白练习** | 把适合练手的小块工作显式留给你，统一标记 `TODO(你): …`（对应 Claude Code 的 `TODO(human)`）。小块、战略性、可自验收；安全/不可逆/决定正确性的步骤永不留白 |

配套**交互协议**：默认教学优先；你说「直接做 / 我来不及 / 尽快」即切直接模式完整执行；开场只问一次你的熟悉程度（入门/进阶/熟练）；尝试失败 ≥2 次自动降级为引导式揭示。

## 安装

要求：DSH `0.1.0-rc.x`（在 `~/.dsh` 下有 `profiles/` 的部署）。

```bash
# 方式一：clone 后复制
git clone https://github.com/<your-name>/dsh-learning-mode.git
cp -r dsh-learning-mode/learning-mode ~/.dsh/.agent-presets/

# 方式二：直接运行仓库内的安装脚本
bash dsh-learning-mode/install.sh
```

然后在 DSH 的 Web 界面**新建会话**，预设选择器里选 **学习模式** 即可（无需重启）。

### 自定义

- 改语气/身份：编辑 `learning-mode/agent.cordis.yml` 里的 `persona.text`。
- 改教学细则与措辞模板：编辑 `learning-mode/skills/learning-mode/SKILL.md`。
- 改名：只改 `learning-mode/preset.yml` 的 `name`（目录名 `learning-mode` 即预设 id，需匹配 `[a-z0-9][a-z0-9-]*`，改名需同步目录名）。

## 工作原理

- `agent.cordis.yml` 是 `standard` 预设的完整副本，仅两处改动：`persona` 换成教学身份（常驻系统提示词的三条铁律），`skill-filesystem` 增加 `customSkillDirs` 指向本预设自带的 `skills/` 目录（完整细则按需加载，不占常驻 token）。
- 工具集与标准编码 Agent 完全相同（Shell、文件、检索、Skills、计划、目标、子代理、工作流）。

## 许可证

MIT © 2026 CHplus0。预设组合改编自 [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的 `standard` agent preset（MIT © 2026 DeepSeek），详见 `LICENSE`。
