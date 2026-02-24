# ClipAiMan 品牌重命名与工作流优化方案

## 一、品牌重命名

### 当前名称
- **ClipAiMan** (clipaiman)
- 中文: 漫剧师

### 建议新名称

| 名称 | 定位 | 特点 |
|------|------|------|
| **MangaFlow** | 漫剧工作流 | 简洁 + 流程感 |
| **StoryMotion** | 故事动起来 | 动作感 |
| **ToonStudio** | 卡通工作室 | 专业感 |
| **ComicAI** | AI 漫画 | 直接明了 |

### 推荐: **MangaFlow**

理由:
- 简洁易记
- 体现"漫剧" + "流程"双重含义
- 国际化友好
- 适合 n8n 风格的可视化

---

## 二、n8n 风格工作流设计

### 核心特点 (n8n 风格)

1. **节点式可视化** - 每个步骤是独立节点
2. **拖拽连接** - 节点之间可以连线
3. **实时状态** - 节点显示执行状态
4. **可配置** - 点击节点可编辑参数

### 节点设计

```
┌─────────────┐
│ 📄 上传小说  │────┐
└─────────────┘       │
                      ▼
┌─────────────┐       │
│ 🔍 智能解析  │──────┤
└─────────────┘       │
                      ▼
┌─────────────┐       │
│ 📝 剧本生成  │──────┤
└─────────────┘       │
              ... (可拖拽排序)
```

### 节点状态

| 状态 | 样式 |
|------|------|
| pending | 灰色 |
| running | 蓝色 + 加载动画 |
| success | 绿色 + ✓ |
| error | 红色 + ✗ |
| paused | 黄色 + ⏸ |

---

## 三、工作流优化 (10 步 → 8 步)

### 优化方案

合并相似步骤，减少用户操作:

| 原步骤 | 优化后 | 说明 |
|--------|--------|------|
| 小说上传 | 1. 导入 | 合并上传+解析 |
| 智能解析 | | |
| 剧本生成 | 2. 生成 | AI 生成 |
| 分镜设计 | 3. 分镜 | AI 分镜 |
| 角色设计 | 4. 角色 | 合并设计+渲染 |
| 场景渲染 | | |
| 动态合成 | 5. 合成 | 自动化 |
| 配音配乐 | 6. 配音 | 合并 |
| 对口型 | | |
| 导出发布 | 7. 导出 | 一步到位 |

**结果: 10 步 → 7 步**

---

## 四、技术实现

### 组件结构

```
src/components/business/
├── WorkflowBuilder/          # n8n 风格工作流构建器
│   ├── index.tsx           # 主组件
│   ├── WorkflowCanvas.tsx  # 画布区域
│   ├── NodePanel.tsx      # 节点面板
│   ├── ConnectionLine.tsx  # 连接线
│   └── NodeConfig.tsx     # 节点配置
└── DramaWorkflowViewer/    # 现有组件 (保留兼容)
```

### 状态管理

```typescript
interface WorkflowNode {
  id: string;
  type: DramaWorkflowStep;
  status: 'pending' | 'running' | 'success' | 'error' | 'paused';
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
}
```

---

## 五、实施计划

### Phase 1: 品牌重命名
- [ ] 更新 package.json 名称
- [ ] 更新 tauri.conf.json
- [ ] 更新文档和注释

### Phase 2: 工作流简化
- [ ] 合并 10 步为 7 步
- [ ] 更新 WORKFLOW_STEPS 配置

### Phase 3: n8n 风格可视化
- [ ] 创建 WorkflowBuilder 组件
- [ ] 实现节点拖拽
- [ ] 实现连接线
- [ ] 集成到主页面
