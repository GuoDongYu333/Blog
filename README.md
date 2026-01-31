# 博客

基于 [VitePress](https://vitepress.dev/) 的个人博客。

## 开发

```bash
npm install
npm run dev
```

在浏览器打开 http://localhost:5173

## 构建

```bash
npm run build
```

静态文件输出到 `.vitepress/dist`。

## 预览构建结果

```bash
npm run preview
```

## 目录说明

- `index.md` - 首页
- `blog/` - 博客文章目录，在此新建 `.md` 即可写新文章
- `about.md` - 关于页
- `.vitepress/config.js` - 站点与主题配置（导航、侧栏等）

新文章写好后，在 `.vitepress/config.js` 的 `sidebar['/blog/']` 里添加对应链接即可在侧边栏显示。
