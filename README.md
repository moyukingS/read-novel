# 小说阅读器（Vue3 + Pinia + Naive UI）

一个现代化、极致体验的小说阅读器，基于 Vue 3、Pinia、Naive UI，支持自动导入、全局状态管理、章节高效加载、UI/UX 优化等特性。

## ✨ 项目特性

- **全局状态管理**：所有小说、章节、进度、主题等数据均通过 Pinia 统一管理，组件间数据高度一致。
- **自动导入**：集成 unplugin-auto-import、unplugin-vue-components，自动引入 Naive UI 组件、Pinia store、Vue API、Iconify 图标，无需手动 import。
- **高性能章节加载**：章节元数据与内容分离，切换章节仅加载当前内容，性能极佳。
- **现代化 UI/UX**：极简美观，支持深色模式、圆形进度条、图标按钮、动态网页标题等细节。
- **小说管理器**：支持小说上传、重命名、删除、选中高亮，所有操作全局同步。
- **数据一致性**：重命名、切换、删除等操作均保证 Pinia 状态与 IndexedDB 数据一致。
- **极致体验**：所有操作无多余弹窗、无自动收缩，交互流畅，细节打磨到位。

## 📦 技术栈

- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Naive UI](https://www.naiveui.com/)
- [Vite](https://vitejs.dev/)
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)
- [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)
- [Iconify](https://iconify.design/)

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev

# 构建生产环境
pnpm build
```

## 🗂️ 目录结构

```
start/
  ├─ src/
  │  ├─ components/      # 主要功能组件
  │  ├─ stores/          # Pinia 全局状态
  │  ├─ assets/          # 静态资源
  │  ├─ App.vue          # 入口页面
  │  ├─ main.js          # 入口文件
  │  └─ style.css        # 全局样式
  ├─ public/             # 公共资源
  ├─ vite.config.js      # Vite 配置
  ├─ package.json
  └─ README.md
```

## 📝 主要功能

- 小说上传、管理、重命名、删除
- 章节目录分页、点击跳转、高亮
- 当前章节内容渲染，支持手动跳转
- 小说名、章节名动态网页标题
- 进度自动保存与恢复
- 深色/浅色主题切换
- 全局数据与IndexedDB同步

## 💡 开发体验

- 所有全局数据通过 Pinia 统一管理，组件间无 props 传递冗余
- 自动导入常用 API、组件、图标，开发更高效
- 代码结构清晰，易于扩展和维护


## 📄 License

MIT
