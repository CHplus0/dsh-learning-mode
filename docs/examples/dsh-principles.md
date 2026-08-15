# DeepSeek Harness 原理讲解 —— 学习模式真实教学回合

> 面向人的文档（human documentation）：本文件**不参与任何 skill 加载**，也不在 `learning-mode/skills/` 目录内——学习模式的技能只教原则与形式（占位符模板），具体例子由模型在运行时根据你当下的任务现编，以保持泛化能力。本示例是 `learning-mode` 预设下一次**真实会话**的教学输出逐字记录，展示"具体阐释 + 引导思考 + 留白练习 + 开场校准"如何在实际输出中协作。
>
> This file is human documentation: it is **never loaded by any skill** and lives outside `learning-mode/skills/`. The learning-mode skill teaches only principles and forms; concrete examples are invented at runtime from the user's current task to preserve generalization. This is the verbatim teaching output of a real session on the `learning-mode` preset, showing how concrete explanations, guided thinking, practice blanks, and opening calibration work together in actual output.

---

## 会话背景 / Session context

- 用户提问 / User prompt：**请你阐释 Deepseek Harness 的原理。**
- 开场校准（只问一次）/ Opening calibration (asked once)：熟悉程度 = **进阶**；偏好 = **先讲概念再给例子**。
- 语言 / Language：中文（英文用户输出英文版，结构不变）。

## ① 开场定位（表层 + 校准前）/ Opening positioning (surface, before calibration)

我已经把这套系统的源码翻了一遍（它此刻就运行在你我对话的底层里——我用的这些工具、会话、目标机制，都是它的实例）。先给你一个"表层"定位，再问你校准问题，好决定讲多深。

**一句话**：DeepSeek Harness（`dsh`）是一个把「大模型 + 工具 + 沙箱 + 会话记忆」组装成可编程 Agent 环境的**插件化框架**——你正在用的这套 GUI 和后台，就是它跑起来的一个实例。

**一个类比**：把它想成乐高。底座是 `cordis`（一个 TypeScript 插件容器，负责依赖注入、生命周期、配置驱动加载）；`@deepseek-ai/dsh-*` 那 185 个包是乐高块（模型适配、bash 沙箱、文件工具、会话存储、子代理……）；**profile 是拼装图纸**，而 `cordis.patch.yml` 是你在图纸上改动的便签层。`dsh web`、`dsh --profile headless`、TUI 终端，本质是**同一副底座、三张不同图纸**拼出的三台机器。

在我展开讲"原理"之前，先校准一下讲解深度（只问这一次）。

> 校准后，模型又读了这台机器上的真实配置（`~/.dsh/profiles/web`、`dsh-base` bundle 的 patch），其中一次写盘被沙箱拦下——它把这次拒绝也用作第 4 层"沙箱与安全"的现场证据。

## ② 校准后正题（完整教学回合）/ The teaching turn (after calibration)

素材齐了，现场证据都在手边。开始正题。

---

## 🎯 目标

把 DeepSeek Harness（`dsh`）拆成**四层**讲清：启动层 → 组合层 → 运行时层 → Agent 循环层。每讲一个概念，就对照一份刚才从你机器上读到的真实文件。

---

## 📖 概念：四层架构

先给全貌一句话，再逐层展开：

> **DSH 是"配置即组合、插件即能力"的系统**——系统长什么样由层叠的 patch 配置树决定，能力由 185 个 `@deepseek-ai/dsh-*` 插件提供，插件之间靠 Cordis 的**服务（Service）**与**事件（Event）**解耦。

### 第 1 层 · 启动层（Launcher）：薄到极致的入口

`dsh` CLI（`lib/bin.js`）只做一件事：解析**自己的** flag（`--profile`、`--patch`、`--dump-config`），然后启动一个 profile。关键设计在源码注释里写得很直白：

> "The first token this parser does not recognize starts the inner arguments" —— 第一个认不出的 token 就是分界线。

**情景**：`dsh --profile web --port 8080` 中，`--port 8080` 不属于 launcher，原样交给 web 应用去解析。所以 `dsh web --help` 打印的是 **web 应用的帮助**，不是 launcher 的。

**类比**：launcher 像登机口检票员——只决定你上哪架航班（哪个 profile），飞机上的一切由 profile 自己管。这也带来一个约束：**launcher 的 flag 必须写在最前面**，且它的 flag 面要极小、极稳定，因为任何 surface 都依赖它。

### 第 2 层 · 组合层（Profile / Bundles / Patch）：配置树是"叠"出来的

这是 DSH 最核心的机制。配置树从**空根 `[]`** 开始，依次叠加：

```
空根 []
  → dsh.profile.bundles 里每个 bundle 的 patch（出厂图纸）
  → profile 自己的 cordis.patch.yml（你的涂改贴纸）
  → home 级 $DSH_HOME/cordis.patch.yml
  → --patch 指定的覆盖层
```

- **bundle** 是普通 npm 包，其 `package.json` 声明 `"dsh": {"bundle": {"patch": "./cordis.patch.yml"}}`，指向自己的补丁文件。
- patch 按 **id 寻址行**：`- id: llm` / `name: '@deepseek-ai/dsh-llm'`。**后写覆盖先写（last write wins per row）**。
- **易错点**：patch 替换的是整行 `config`，**不做深合并**——所以覆盖时必须重述该行拥有的全部字段（web-app 的 patch 注释里专门强调了这一点）。

**现场证据**（你这台机器）：`~/.dsh/profiles/web/package.json` 里 `bundles: ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app"]`——两张出厂图纸；而 `cordis.yml` 是空根 `[]`，你的 `cordis.patch.yml` 是 `[]`。真正的成品树不在磁盘上，**在启动那一刻组合出来**。`dsh --dump-config` 就是"打印成品清单"，`--dump-default-config` 是"只看出厂图纸"。

### 第 3 层 · 运行时层（Cordis 插件树）：一切皆服务

组合出的树被 Cordis Loader 挂载成插件树。**Cordis** 是个 TypeScript 插件框架（依赖注入 + 作用域 + 生命周期清理 + 配置驱动加载），每个插件行变成一个实例，往 `ctx` 上注册服务：

| 服务 | 作用 |
|---|---|
| `ctx.llm` | 模型调用（`dsh-llm`，适配器注册 + 单一流式 API） |
| `ctx.tools` | 工具注册与执行管线（`dsh-tools`） |
| `ctx.agents` | Agent 注册表（`dsh-agent`，接口层） |
| `ctx.sessions` | 会话（持久化、投影） |
| `ctx.systemPrompt` | 提示词组装 |

插件间靠**事件**通信，比如 `llm/stream`（可拦截/包装每一次模型调用，做缓存、日志）、`tools/pre-execute`（允许/拒绝/询问门）、`session/event`（会话事件流）。解耦到什么程度？`dsh-session-projection` 的契约是：**"框架负责驱动，域插件只注册纯函数"**——插件持有 `init/apply/view` 三个纯函数，框架订阅事件、逐条喂给它们。

**设计原则**（源码里反复出现的原话）：`dsh-agent-loop` 的 README 宣称 **"这是整个 harness 里唯一包含循环逻辑的包，其余都是抽象服务或插件"**。新行为一律进插件，不进循环。这换来的是可插拔、可测试，甚至配置热更新（HMR：改 patch 不重启进程）。

### 第 4 层 · Agent 循环（dsh-agent-loop）：机器怎么"跑起来"

结构是 **session（持久会话）→ turn（一轮交互）→ step（模型一次推理 + 一次或多次工具调用）**。几个值得注意的机制：

- **创建/恢复是"带回滚的事务"**：构造私有 session → 注册 → 广播 `agent/created` → 才开始驱动；任何一步失败则整体回滚。
- **工具执行管线**：`pre-execute`（ask/allow/deny 门，`ask` 走人工审批服务）→ guard → `execute`（超时/重试包装）→ `post-execute` → `finalizeContent` → `tools/result`（只读通知）。
- **会话持久化是 append-only JSONL**（默认 zstd 压缩），事件 seq 连续、`assistant/chunk` 一个不丢；恢复 = 从日志重建历史。现场证据：`~/.dsh/sessions/--home-administrator-OwnProjects--/session-*/session.jsonl.zstd`——你我此刻的对话，正以这种格式落在这台机器上。
- **上下文管理**：compaction（基础压缩 + 工具结果裁剪）；且每个包的 README 都标注自己的 **KV cache 效应**（哪些 prompt 段稳定不失效缓存、哪些会失效）——这是为"长会话省钱"做的显式设计。
- **沙箱与安全**：`fs-sandbox` 围栏文件写入、`bash-sandbox` 限制命令、`approval` 做人工确认。你现在这个会话的文件策略是 `workspace-write`——这就是 `dsh-sandbox-policy` 在起作用，我前面那次写 `~/.dsh` 被拒，正是这道围栏。

**同一底座、三张图纸**：`dsh-base` 是共享核心；`dsh-web-app`（浏览器 UI，你正在用的）、`dsh-headless`（一次性问答跑完退出）、TUI 终端——三张图纸拼出三台机器。web 的浏览器端也是插件化的（`dsh-client-*` 一堆 React 插件，靠 `window.__DSH_BOOT__` 注入），与后端共用同一套会话/事件语义。

---

## 🧭 引导

在"唯一循环包"这个设计上停一下，你猜：

> **如果 agent 循环不是唯一的、而是散落在各个插件里，会失去什么？**（提示：想想"新行为进插件"换来的三个东西——可插拔、可测试、可热更新——分别对应哪个反面场景。）

答案在 L3（需要时回复"揭晓"），但先试着自己推。

---

## ✍️ 你来试试

一个贴合你正在做的事（理解这套系统）的小练习：

```text
# TODO(你): 在这台机器上读 ~/.dsh/profiles/web/ 下的 cordis.patch.yml 和 package.json，
# 回答：我想给 web profile 加一个配置覆盖（比如把 session-query-sqlite 的 openAt 改成 'first-search'），
# 应该改哪个文件？为什么不能直接改 bundle 包（node_modules 里的 @deepseek-ai/dsh-web-app/cordis.patch.yml）里的那行？
# （提示：想想 patch 层叠顺序和 last-write-wins；再想想 npm 安装的包是什么性质）
```

**验收方式**：把答案写出来（不用真的改文件），对照——答案应是"改 `~/.dsh/profiles/web/cordis.patch.yml`（用户层），因为它在所有 bundle 层之后、last write wins；且 bundle 是 npm 安装的只读出厂层，改了也会在重装/升级时丢失"。答完或卡住，回复我，我帮你对照或给提示。

---

## ✅ 验收

"完成"长什么样：你能用自己的话讲清——**launcher 只认自己的 flag、配置树由 patch 层叠组合、运行时是 Cordis 服务树、循环逻辑收敛在唯一一个包里**——并且能说出现在改 web 配置该动哪个文件。若哪一层想深挖（比如工具管线的 `ask` 门、projection 为什么要求事件带完整状态、或 KV cache 效应怎么算的），说"展开讲讲"，我们下钻。
