# 拾页 zine

“拾页 zine”是一个面向照片纸刊创作的静态展示站。项目参考 [Zeejay Zine](https://zeejayzine.com/) 的页面骨架与入口关系，使用原创素材重新实现，并按 `project-standards` 现行的微暖纸面、近黑油墨和荧光黄美术基线完成视觉适配。

线上地址：[https://zine.lrwei91.cn](https://zine.lrwei91.cn)

## 当前能力

- 桌面固定侧栏与移动端底部导航。
- 12 张原创纸刊作品组成的响应式瀑布流。
- 本地图片格式、数量和大小校验，以及浏览器内预览。
- 生成记录空状态、登录校验和作品详情原生弹层。
- JavaScript 关闭与减弱动效环境下的内容降级。
- 320、390、768、1024、1440 CSS px 响应式适配。

## 产品边界

这是前端静态演示，不连接真实账户、上传、生成或持久化服务。选择的图片只在当前浏览器页面内预览，不会上传或保存；账户、政策、记录和生成相关入口均为演示状态。

参考站仅用于信息结构和位置关系研究。本项目不使用其 Logo、作品图片、账户数据或社会证明。具体设计判断和素材来源见 [`design-brief.md`](design-brief.md)。

## 技术结构

项目不需要安装第三方依赖，也没有构建步骤：

```text
index.html          页面结构与静态内容
styles.css          视觉 token、布局和响应式样式
app.js              对话框、文件预览和渐进增强交互
public/assets/      原创 WebP 作品图片
tests/check.mjs     静态契约检查
vercel.json         Vercel 输出目录、缓存和安全响应头
design-brief.md     设计判断、参考登记和交互边界
AGENTS.md           后续 Agent 的项目级实施规则
```

## 本地运行

需要 Python 3 和 Node.js。在仓库根目录执行：

```bash
npm run dev
```

然后访问 [http://127.0.0.1:4173/](http://127.0.0.1:4173/)。

## 验证

```bash
npm run check
node --check app.js
```

`npm run check` 会核对入口文件、12 张作品图片和关键页面/交互契约。涉及视觉或交互的改动还应在真实浏览器中检查目标视口、键盘路径、对话框、减弱动效和控制台状态。

## 部署

生产环境部署在 Vercel，输出目录为仓库根目录，公开域名为 `zine.lrwei91.cn`。静态作品资源使用长期不可变缓存，页面响应包含基础安全头。部署配置见 [`vercel.json`](vercel.json)。

本地 `.vercel/` 只保存项目链接信息，已通过 `.gitignore` 排除，不应提交到仓库。
