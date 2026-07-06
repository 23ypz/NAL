# 部署说明：Vercel + Render + TiDB Cloud

本项目已经按免费部署方式做了基础修改：

- 前端请求统一使用 `/api`，避免上线后继续访问 `localhost:4000`。
- 新增 `frontend/vercel.json`，用于把前端 `/api/*` 请求转发到 Render 后端，并解决 Vue Router 刷新 404。
- 后端数据库连接支持 `DB_ENABLE_SSL=true`，适配 TiDB Cloud / 云数据库。
- 后端新增 `.env.example`，实际部署时在 Render 环境变量中填写。
- 数据库 `schema.sql` 已整理为统一表结构，并补充 `competition_favorites`、`system_configs`、`operation_logs`、`file_attachments` 等表。
- 新增 `backend/config/system.rules` 和 `backend/src/utils/configParser.js`，可用于课程报告中的“配置文件 + 文法分析”。

## 1. 上传 GitHub

解压压缩包后，进入项目根目录：

```bash
cd project
```

初始化 Git：

```bash
git init
git add .
git commit -m "init deploy ready version"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

注意：不要上传 `node_modules`、`dist`、`.env`。本项目已经配置 `.gitignore`。

## 2. 创建 TiDB Cloud 数据库

创建 TiDB Cloud Starter 数据库后，在连接页面复制：

- Host
- Port
- User
- Password
- Database

后面 Render 和本地初始化数据库都会用到这些信息。

## 3. 初始化远程数据库

进入后端目录：

```bash
cd backend
npm install
```

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

Windows PowerShell 可以用：

```powershell
Copy-Item .env.example .env
```

把 `.env` 改成你的 TiDB 信息：

```env
PORT=4000
NODE_ENV=development
DB_HOST=你的TiDB_HOST
DB_PORT=4000
DB_USER=你的TiDB_USER
DB_PASSWORD=你的TiDB_PASSWORD
DB_NAME=academic_light
DB_ENABLE_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=请换成一串很长的随机字符串
CORS_ORIGIN=
```

初始化数据库：

```bash
npm run init-db
```

看到 `MySQL / TiDB 初始化完成 ✅` 就成功了。

## 4. 部署 Render 后端

Render 创建 Web Service：

- Root Directory：`backend`
- Build Command：`npm install`
- Start Command：`npm start`

环境变量填写：

```env
PORT=4000
NODE_ENV=production
DB_HOST=你的TiDB_HOST
DB_PORT=4000
DB_USER=你的TiDB_USER
DB_PASSWORD=你的TiDB_PASSWORD
DB_NAME=academic_light
DB_ENABLE_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
JWT_SECRET=请换成一串很长的随机字符串
CORS_ORIGIN=
```

部署成功后，打开：

```text
https://你的后端地址.onrender.com/health
```

如果返回健康检查 JSON，说明后端成功。

## 5. 修改 frontend/vercel.json

打开：

```text
frontend/vercel.json
```

把：

```json
"destination": "https://YOUR_RENDER_BACKEND_URL.onrender.com/api/:path*"
```

改成你的 Render 后端地址，例如：

```json
"destination": "https://academic-light-backend.onrender.com/api/:path*"
```

然后提交：

```bash
git add .
git commit -m "set render backend url"
git push
```

## 6. 部署 Vercel 前端

Vercel 导入 GitHub 仓库，配置：

- Framework Preset：`Vite`
- Root Directory：`frontend`
- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：`dist`

部署完成后访问 Vercel 给出的域名。

## 7. 演示账号

初始化脚本内置三个演示账号，密码均为：

```text
Admin123!
```

账号：

```text
admin@academic-light.test
mentor@academic-light.test
student@academic-light.test
```

## 8. 常见错误

### 前端打开后接口失败

检查 `frontend/vercel.json` 中 Render 地址是否替换完成。

### 后端健康检查正常，但登录失败

检查数据库是否执行过：

```bash
npm run init-db
```

### Render 后端第一次打开很慢

免费 Web Service 可能会休眠。答辩演示前先访问一次 `/health` 预热。

### Vercel 刷新页面 404

确认 `frontend/vercel.json` 放在 `frontend` 目录下，并且第二条 rewrite 是：

```json
{
  "source": "/:path*",
  "destination": "/index.html"
}
```
