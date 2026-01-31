# 将 VitePress 博客部署到 Ubuntu 服务器（Nginx 8899 端口）

## 复制即用（dist 在 /home/blog，端口 8899）

**1. 创建 Nginx 配置：**

```bash
sudo tee /etc/nginx/sites-available/blog-8899 << 'EOF'
server {
    listen 8899;
    server_name localhost;
    root /home/blog;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

**2. 启用站点并重载 Nginx：**

```bash
sudo ln -sf /etc/nginx/sites-available/blog-8899 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**3. 防火墙放行 8899（如已开 ufw）：**

```bash
sudo ufw allow 8899
sudo ufw reload
```

然后访问：`http://你的服务器IP:8899`。

---

## 403 Forbidden 排查与修复

Nginx 用 `www-data` 用户读文件，403 一般是**目录权限**或**路径不对**。

**1. 先确认网站文件在哪、有没有 index.html：**

```bash
ls -la /home/blog/
ls -la /home/blog/index.html
```

- 若 **没有** `index.html`，但能看到 `/home/blog/dist/index.html`，说明 root 配错了，应改为 `root /home/blog/dist;`，改完后执行：`sudo nginx -t && sudo systemctl reload nginx`。
- 若有 `index.html`，继续下面步骤。

**2. 给 Nginx 开权限（复制整段执行）：**

```bash
# 让 Nginx 能进入 /home 和 /home/blog
sudo chmod 755 /home /home/blog
# 让 Nginx 能读所有网站文件
sudo chmod -R 755 /home/blog
# 若上面仍 403，可把目录属主改成 www-data（按需使用）
# sudo chown -R www-data:www-data /home/blog
```

**3. 重载 Nginx 再访问：**

```bash
sudo systemctl reload nginx
```

再打开 `http://你的服务器IP:8899` 试一次。

---

## 一、在本地构建静态文件

在项目根目录执行：

```bash
pnpm install
pnpm build
```

构建完成后，静态文件会生成在 **`.vitepress/dist`** 目录。

---

## 二、把构建产物上传到服务器

任选一种方式即可。

### 方式 A：用 scp 上传

```bash
# 在本地项目根目录执行，把 .vitepress/dist 整个目录上传到服务器
scp -r .vitepress/dist 你的用户名@服务器IP:/home/你的用户名/blog
```

例如：

```bash
scp -r .vitepress/dist root@192.168.1.100:/home/ubuntu/blog
```

### 方式 B：在服务器上拉代码并构建

```bash
# SSH 登录服务器后
cd /home/你的用户名
git clone 你的仓库地址 blog
cd blog
pnpm install   # 若未安装 pnpm: npm i -g pnpm
pnpm build
```

此时网站文件在：`/home/你的用户名/blog/.vitepress/dist`。

---

## 三、在服务器上配置 Nginx（监听 8899）

### 1. 创建站点配置文件

```bash
sudo vim /etc/nginx/sites-available/blog-8899
```

写入以下内容（**注意把路径和 `server_name` 改成你的**）：

```nginx
server {
    listen 8899;
    server_name localhost;   # 有域名可改成你的域名，如 blog.example.com
    root /home/你的用户名/blog/.vitepress/dist;   # 改成你实际上传的 dist 路径
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**如果用 scp 上传的是 `dist` 目录到 `/home/ubuntu/blog`，则 root 写：**

```nginx
root /home/ubuntu/blog/dist;
```

### 2. 启用站点并检查配置

```bash
sudo ln -s /etc/nginx/sites-available/blog-8899 /etc/nginx/sites-enabled/
sudo nginx -t
```

若显示 `syntax is ok` 和 `test is successful`，再重载 Nginx：

```bash
sudo systemctl reload nginx
```

---

## 四、防火墙放行 8899 端口（如已开防火墙）

```bash
sudo ufw allow 8899
sudo ufw reload
```

---

## 五、访问网站

在浏览器访问：

- 无域名：`http://你的服务器IP:8899`
- 有域名且已解析：`http://你的域名:8899`

---

## 六、后续更新部署

每次改完博客后：

1. 本地执行：`pnpm build`
2. 重新上传 `.vitepress/dist` 到服务器（覆盖原目录），或是在服务器上 `git pull` 后执行 `pnpm build`
3. 无需重启 Nginx，刷新页面即可看到新内容

---

## 常见问题

| 问题 | 处理 |
|------|------|
| 刷新子页面 404 | 检查 Nginx 里是否有 `try_files $uri $uri/ $uri.html /index.html;` |
| 403 Forbidden | 检查 `root` 路径是否正确，以及目录权限：`ls -la /path/to/dist` |
| 端口不通 | 检查 `ufw`、云厂商安全组是否放行 8899 |

把上面所有「你的用户名」「服务器IP」「实际路径」换成你自己的即可完成部署。
