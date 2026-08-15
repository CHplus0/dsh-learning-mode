# `df` vs `du` —— 完整示范（情景阐释的一次铺开）

> 面向人的文档（human documentation）：本文件**不参与任何 skill 加载**，也不在 `learning-mode/skills/` 目录内——学习模式的技能只教原则与形式，具体例子由模型在运行时根据你的当下任务现编，以保持泛化能力。这份示范仅作风格参考与存档。
>
> This file is human documentation: it is **never loaded by any skill** and lives outside `learning-mode/skills/`. The learning-mode skill teaches only principles and forms; concrete examples are invented at runtime from the user's current task to preserve generalization. This example is kept here for reference and archival only.

---

`df` 和 `du` 是 Linux 里最容易混淆的一对命令，但其实**名字已经剧透了答案**。

## 命名来由

- `df` = **d**isk **f**ree —— "盘还剩多少"
- `du` = **d**isk **u**sage —— "盘用了多少"

## 核心区别（房子比喻）

把一块磁盘分区想象成一套房子：

- **`df` 站在门口看整体**：总面积 100㎡、已用 56㎡、还剩 44㎡。它回答的是——"这套房子还能不能再装东西？"
- **`du` 挨个数房间**：卧室 20㎡、客厅 15㎡、厨房 10㎡……它回答的是——"哪个房间最占地方？"

所以使用场景一目了然：

| 需求 | 用哪个 | 例子 |
|---|---|---|
| 哪个盘快满了？还剩多少空间？ | `df` | `df -h` |
| 某个文件夹占了多大？ | `du` | `du -sh /data` |
| 找出最占空间的子目录 | `du` | `du -sh /data/* \| sort -rh \| head` |

## 为什么两个命令的数字有时对不上？

`df -h /` 显示已用 226G，但你把 `du -sh /*` 的结果全部加起来只有 180G——差的 46G 去哪了？

这不是 bug，而是**视角不同**：

- `df` 按**文件系统**算：包括被你删除但**进程还占着**的文件（删了但没释放）、系统日志、元数据、以及 ext 文件系统默认预留的 5% 保留块；
- `du` 按**文件/目录**数：只数它能"点得清"的条目。

换个比喻：`df` 看的是整栋楼的**用水总量**（含管道损耗、消防水箱），`du` 数的是**各家水表读数**——两个数当然对不上，但各有各的用途。

## 常用参数（记住这几个就够）

```bash
df -h                      # human-readable，单位自动变 G/M，最常用
df -h /data                # 只看某个挂载点
du -sh /data               # -s 只输出总和，-h 人性化单位，最常用组合
du -sh /data/* | sort -rh  # 按大小倒序，快速揪出"空间杀手"
```

一句话记忆：**"盘"的问题问 `df`，"目录"的问题问 `du`。**

---

✍️ **你来试试（可选）**：

```text
TODO(你): 在你自己的机器上跑
  df -h /
  du -sh /* 2>/dev/null | sort -rh | head
对比 df 显示的"已用"和 du 加出来的总和差多少。
验收：能说出至少一个"差出来"的空间去哪了（答案就在上面的原理里）。
```

（提示：`du -sh /*` 会扫全盘，可能有点慢；权限不足的目录用 `2>/dev/null` 忽略报错。）

顺便问一句校准（不答也行，只问一次）：你平时用 Linux 命令行多吗——入门、进阶还是熟练？另外你偏好我以后**先给例子**还是**先讲概念**？我按你的口味调整。
