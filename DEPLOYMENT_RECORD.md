# 个人介绍网站 Docker 部署记录

## 项目概述

这是一个基于 Next.js 的个人介绍网站，包含：
- **前端**: Next.js 应用 (端口 3000)
- **后端**: Express API 服务 (端口 3001)
- **Nginx**: 反向代理 (端口 8080)

## 架构说明

```
                                    ┌──────────────┐
                                    │   Nginx      │
         ┌──────────────┐          │   :8080      │
         │   浏览器      │  ──────►  │              │
         └──────────────┘           │ /frontend──►│──► Frontend:3000
                                    │ /backend ──►│──► Backend:3001
                                    └──────────────┘
```

- **端口 8080**: Nginx 统一入口
- **/frontend**: 转发到 Next.js 前端 (3000)
- **/backend**: 转发到 Express 后端 (3001)

---

## 执行过程记录

### 1. 项目初始化

```bash
# 创建 Next.js 项目
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint --app --src-dir --no-import-alias --use-npm

# 安装图标库
cd my-portfolio
npm install lucide-react
```

### 2. 项目结构

```
my-portfolio/
├── docker-compose.yml          # Docker Compose 配置
├── Dockerfile                  # 前端 Dockerfile
├── next.config.ts             # Next.js 配置 (添加 basePath)
├── nginx/
│   ├── Dockerfile            # Nginx Dockerfile
│   └── nginx.conf            # Nginx 反向代理配置
└── backend/
    ├── Dockerfile            # 后端 Dockerfile
    ├── package.json           # 后端依赖
    └── server.js              # Express API 服务
```

### 3. 关键配置文件

#### docker-compose.yml

```yaml
services:
  nginx:
    build: ./nginx
    ports:
      - "8080:8080"
    depends_on:
      - frontend
      - backend

  frontend:
    build: .
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
```

#### nginx/nginx.conf (核心配置)

```nginx
# 上游服务定义
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:3001;
}

server {
    listen 8080;

    # 前端路由
    location /frontend/ {
        proxy_pass http://frontend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端 API
    location /backend/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 遇到的问题及解决方案

### 问题 1: Docker 镜像拉取失败

**错误信息:**
```
failed to fetch anonymous token: Get "https://auth.docker.io/token?scope=repository%3Alibrary%2Fnode%3Apull&service=registry.docker.io": dial tcp: i/o timeout
```

**原因:** Docker Hub 网络连接不稳定，尤其是从中国大陆访问时经常超时。

**解决方案:**

1. 配置 Docker 镜像加速器

   编辑 `~/.docker/daemon.json`:
   ```json
   {
     "builder": {
       "gc": {
         "defaultKeepStorage": "20GB",
         "enabled": true
       }
     },
     "experimental": false,
     "registry-mirrors": [
       "https://registry.docker-cn.com",
       "https://docker.mirrors.ustc.edu.cn",
       "https://hub-mirror.c.163.com"
     ]
   }
   ```

2. 重启 Docker Desktop 使配置生效

3. 手动预拉取基础镜像
   ```bash
   docker pull nginx:latest
   docker pull node:18-alpine
   ```

### 问题 2: 后端 Dockerfile 构建失败

**错误信息:**
```
The `npm ci` command can only install with an existing package-lock.json
```

**原因:** 后端目录没有 package-lock.json 文件。

**解决方案:**

修改 `backend/Dockerfile`:
```dockerfile
# 原来
RUN npm ci --production

# 改为
RUN npm install --production
```

---

## 部署命令

### 开发模式 (本地运行)

```bash
cd my-portfolio

# 启动前端
npm run dev

# 启动后端 (另一个终端)
cd backend
npm install
npm start
```

访问:
- 前端: http://localhost:3000
- 后端: http://localhost:3001

### Docker 部署

```bash
cd my-portfolio

# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问:
- 前端: http://localhost:8080/frontend/
- 后端 API: http://localhost:8080/backend/api/profile

---

## Nginx 配置要点说明

1. **upstream**: 定义后端服务地址 (服务名:端口)
2. **location /frontend/**: 匹配 `/frontend` 路径，proxy_pass 转发到前端容器
3. **location /backend/**: 匹配 `/backend` 路径，转发到后端 API
4. **proxy_set_header**: 传递真实 IP 和协议信息给后端

### location 匹配规则

- `location /frontend/` - 匹配以 /frontend/ 开头的路径
- `proxy_pass http://frontend/` - 转发时去掉前缀

示例:
- `/frontend/` -> 转发到 `http://frontend/` -> `/`
- `/frontend/about` -> 转发到 `http://frontend/about` -> `/about`

---

## 修改个人信息的步骤

编辑 `src/app/page.tsx`:

1. **姓名**: 修改第 47 行 `王宇亮`
2. **求职意向**: 修改第 54 行 `求职意向：杭州、上海`
3. **技能列表**: 修改 skills 数组
4. **项目经验**: 修改 projects 数组
5. **社交链接**: 修改 GitHub、LinkedIn、Email 链接
6. **头像**: 替换 `public/avatar.jpg`

修改后需要重新构建:
```bash
docker-compose up --build --force-recreate
```

---

## 相关文件路径

- 项目根目录: `/Users/cassandra/Documents/fronted-code/next/my-portfolio`
- Docker 配置: `docker-compose.yml`
- Nginx 配置: `nginx/nginx.conf`
- 前端代码: `src/app/page.tsx`
- 后端代码: `backend/server.js`

---

## 补充问题记录 (2026-02-17 更新)

### 问题 3: Node.js 版本不兼容

**错误信息:**
```
You are using Node.js 18.20.8. For Next.js, Node.js version ">=20.9.0" is required.
```

**原因:** Next.js 16 需要 Node.js >= 20.9.0，但 Dockerfile 使用的是 node:18-alpine。

**解决方案:**

修改前端 `Dockerfile`，将 node:18-alpine 改为 node:20-alpine：

```dockerfile
# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# ...

# Stage 2: Production runner
FROM node:20-alpine AS runner
```

然后预拉取镜像：
```bash
docker pull node:20-alpine
```

---

### 问题 4: 访问页面提示 404

**错误信息:**
```
This page could not be found.404
```

**原因:** Nginx 配置中使用 `proxy_pass http://frontend/` 会将路径 `/frontend/xxx` 转为 `/xxx`，但 Next.js 期望的是完整路径。

**解决方案:**

使用 `rewrite` 规则去掉前缀，同时保留完整路径转发到后端：

```nginx
location /frontend/ {
    rewrite ^/frontend(.*)$ $1 break;
    proxy_pass http://frontend;
    # ...
}
```

---

### 问题 5: 重定向次数过多 (ERR_TOO_MANY_REDIRECTS)

**原因:** 同时使用了 Next.js 的 `basePath` 配置和 Nginx 路径重写，导致循环重定向。

**解决方案:**

1. 移除 Next.js 的 `basePath` 配置 (`next.config.ts`)
2. 保留 Nginx 的 rewrite 规则

---

### 问题 6: 样式不显示

**原因:** HTML 中静态资源路径是 `/_next/...`，但 Nginx 只处理了 `/frontend/_next/...`。

**解决方案:**

添加额外的 location 处理不带前缀的静态资源：

```nginx
# 处理前端静态文件 (不带前缀)
location /_next/ {
    proxy_pass http://frontend;
    # ...
}
```

---

### 最终成功输出

```
Attaching to backend-1, frontend-1, nginx-1
backend-1  | Backend server running on port 3001
frontend-1  | ✓ Ready in 52ms
nginx-1    | Configuration complete; ready for start up
```

### 访问地址

- 前端: http://localhost:8080/frontend/
- 后端 API: http://localhost:8080/backend/api/profile
- 健康检查: http://localhost:8080/health

---

### 问题 7: 304 Not Modified

**说明:** 304 是 HTTP 缓存状态码，表示"文件未修改，使用本地缓存"。

**原理:**
- 浏览器首次请求资源，服务器返回 200 + 文件内容
- 浏览器缓存该文件
- 再次请求时，浏览器发送 `If-Modified-Since` 或 `ETag`
- 服务器检查后发现文件没变化，返回 304
- 浏览器使用本地缓存，不重新下载

**这是正常现象，好处:**
- 提升页面加载速度
- 节省服务器带宽

**相关状态码:**
| 状态码 | 含义 |
|--------|------|
| 200 | 首次请求，资源从服务器下载 |
| 304 | 资源未修改，使用本地缓存 |
| 404 | 文件不存在 |

---

### 如何验证后端服务是否正常运行

```bash
# 测试后端 API
curl http://localhost:8080/backend/api/profile

# 测试后端健康检查
curl http://localhost:8080/backend/api/health
```

**后端服务已成功部署！** 返回数据：
```json
{"name":"王宇亮","title":"前端开发工程师","location":"杭州、上海","email":"wangyuliang@example.com","github":"https://github.com","linkedin":"https://linkedin.com"}
```

---

### Docker 命令汇总

```bash
# 启动所有服务
docker-compose up --build -d

# 查看日志
docker-compose logs -f

# 重启特定服务
docker-compose restart nginx

# 停止所有服务
docker-compose down
```

---

## 部署到公网 (Vercel)

### 方案说明

Vercel 是 Next.js 的官方托管平台，免费额度足够个人展示使用。

**访问地址示例：**
- 前端：`https://your-name.vercel.app`

### 部署步骤

#### 1. 推送代码到 GitHub

```bash
# 初始化 git（如果还没有）
cd my-portfolio
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
# 在 GitHub 上创建空仓库，然后：
git remote add origin https://github.com/你的用户名/my-portfolio.git
git push -u origin main
```

#### 2. 部署到 Vercel

1. 访问 https://vercel.com 并用 GitHub 登录
2. 点击 "Add New..." -> "Project"
3. 选择刚才推送的仓库
4. 配置：
   - Framework Preset: Next.js
   - Build Command: `npm run build` (默认)
   - Output Directory: `.next` (默认)
5. 点击 "Deploy"

等待 1-2 分钟，部署完成后会得到一个 `.vercel.app` 域名。

#### 3. 自定义域名（可选）

- 进入 Project Settings -> Domains
- 添加自己的域名（如 yuliang.dev）
- 按提示配置 DNS 记录

### 验证部署

Vercel 部署成功！

**公网访问地址：**
- https://my-portfolio-eta-sage-59.vercel.app

把这个链接发给招聘方或放到简历里即可！

---

## 部署到 Cloudflare Pages（免费国内加速）

### 方案说明

Cloudflare Pages 是免费静态网站托管，国内访问速度较快，无需翻墙。

**访问地址示例：**
- `https://your-project.pages.dev`

### 部署步骤

#### 1. 部署到 Cloudflare Pages

1. 访问 https://pages.cloudflare.com
2. 用 GitHub 登录
3. 点击 "Create a project"
4. 选择 `my-portfolio` 仓库
5. 配置：
   - Project name: `my-portfolio`
   - Production branch: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`（注意是 out 不是 .next）
6. 点击 "Save and Deploy"

等待 1-2 分钟，完成后会得到 `*.pages.dev` 域名。

**重要说明：**
- Next.js 配置了 `output: "export"` 后，静态文件会导出到 `out` 目录
- 不是 `.next` 目录（那是 Next.js 默认的 SSR 输出）！
- 这就是为什么之前一直失败的原因

#### 2. 自定义域名（可选）

- 进入项目 Settings -> Custom domains
- 添加自己的域名
- 按提示配置 DNS

---

*文档创建时间: 2026-02-17*
*最后更新: 2026-02-18*
