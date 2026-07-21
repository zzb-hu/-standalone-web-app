---
name: pake-package-webapp
description: "Package any website or local web build into a lightweight desktop app using Pake (Tauri/Rust). Use when the user wants to: wrap a URL as a native app, build a desktop app from a website, use Pake CLI to package a page, customize app icons or bundle IDs, or mentions 'pake', 'tauri package', 'website to app', 'wrap site'. Also trigger when the user asks about Pake CLI options, proxy configuration for packaged apps, or icon handling."
version: 1.0.0
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Pake — 把网页打包成桌面应用

把任意 URL 或本地静态站一键打包成 macOS/Windows/Linux 三端原生桌面应用。基于 Tauri v2 + Rust + 系统 WebView，体积约 5MB（Electron 的 1/20）。

## 何时触发

- 用户说"打包网页""把 X 网站做成 App""用 Pake 打包""website to app"
- 用户提供一个网址，希望生成桌面安装包
- 用户提到 Pake CLI、Tauri 打包、圆角图标替换等

## 前置环境检查

打包前必须确认：

| 依赖 | 最低版本 | 检查命令 | 说明 |
|------|---------|---------|------|
| Rust | 1.85 | `rustc --version` | 必须。若 Rust 不在 PATH，尝试 `export PATH="$HOME/.cargo/bin:$PATH"` |
| Node.js | 18（推荐 22） | `node --version` | |
| WebView2 Runtime | - | Windows 10+ 自带 | 仅 Windows 需要 |
| MSVC Build Tools | VS 2022 / VS 18 Community | 看 `C:\Program Files\Microsoft Visual Studio\` | 仅 Windows 需要 |
| Xcode Command Line Tools | - | `xcode-select -p` | 仅 macOS 需要 |
| libwebkit2gtk-4.1 | - | `apt show libwebkit2gtk-4.1-dev` | 仅 Linux 需要 |

**Rust 路径注意**：本机 Rust 可能装在 `~/.cargo/bin/` 但不在 PATH。打包前执行：
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

### 各系统环境一键安装

克隆仓库后，按对应系统装好前置依赖即可直接 `pnpm install && node dist/cli.js <url> --name X`。

#### macOS（打 .dmg/.app）

```bash
# 1. Xcode Command Line Tools（提供 clang/SDK）
xcode-select --install

# 2. Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Node.js + pnpm（推荐用 fnm 或 nvm）
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 22 && fnm use 22
corepack enable && corepack prepare pnpm@10.26.2 --activate

# 4. 安装项目依赖
cd Pake
pnpm install

# 5. 打包
node dist/cli.js https://example.com --name Example --json
# 产物：Example.dmg / Example.app
```

#### Windows（打 .msi）

```powershell
# 1. Visual Studio Build Tools 2022（C++ 桌面开发工作负载）
#    下载：https://visualstudio.microsoft.com/visual-cpp-build-tools/
#    勾选"使用 C++ 的桌面开发"

# 2. WebView2 Runtime（Win10+ 通常已自带）
#    下载：https://developer.microsoft.com/microsoft-edge/webview2/

# 3. Rust
winget install Rustlang.Rustup   # 或访问 https://rustup.rs
# 重启终端后：
rustc --version

# 4. Node.js 22 + pnpm
winget install OpenJS.NodeJS.LTS
npm install -g pnpm@10.26.2

# 5. 安装项目依赖
cd Pake
pnpm install

# 6. 打包
node dist/cli.js https://example.com --name Example --json
# 产物：Example.msi
```

#### Linux（打 .deb/.AppImage/.rpm）

```bash
# Debian/Ubuntu
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev \
  build-essential curl wget file \
  libxdo-dev libssl-dev libgtk-3-dev \
  libayatana-appindicator3-dev librsvg2-dev

# Fedora
sudo dnf install -y webkit2gtk4.1-devel \
  openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel \
  gtk3-devel

# Arch
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file \
  openssl gtk3 libappindicator-gtk3 librsvg

# 通用：Rust + Node
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
curl -fsSL https://fnm.vercel.app/install | bash
fnm install 22 && fnm use 22
corepack enable && corepack prepare pnpm@10.26.2 --activate

# 安装项目依赖
cd Pake
pnpm install

# 打包
node dist/cli.js https://example.com --name Example --json
# 产物：Example.deb / Example.AppImage / Example.rpm
```

### 交叉编译限制 ❗

**Pake 基于 Tauri（Rust），不支持交叉编译到需要原生 WebView 的目标平台。**

| 在哪个平台运行 | 能打包的目标 |
|--------------|------------|
| Windows | 只能打 Windows MSI |
| macOS | 只能打 macOS DMG/APP（可加 `--multi-arch` 打 universal binary） |
| Linux | 只能打 Linux DEB/AppImage/RPM |

要同时打三端：
- **方案 A（推荐）**：用 GitHub Actions，项目自带 `.github/workflows/pake-cli.yaml` 和 `single-app.yaml`，在 macOS/Windows/Linux 三个 runner 上并行构建
- **方案 B**：在三台不同系统的机器上分别跑 Pake

## 标准 CLI 命令

进入 Pake 仓库目录后：

```bash
cd <pake-repo>
export PATH="$HOME/.cargo/bin:$PATH"
node dist/cli.js <url> --name <AppName> [options] --json
```

`--json` 在脚本/agent 中**必须**传：日志走 stderr，stdout 输出单个 JSON 结果对象。

### 输出格式

成功：
```json
{"ok":true,"name":"X","platform":"win32","arch":"x64","outputs":[{"path":"...","sizeBytes":N,"format":"msi"}],"warnings":[],"error":null}
```

失败：
```json
{"ok":false,"name":null,"platform":"win32","arch":null,"outputs":[],"warnings":[],"error":{"code":"INVALID_INPUT|ENV_MISSING|BUILD_FAILED|UNEXPECTED","message":"...","hint":"..."}}
```

退出码：0=成功，2=参数错误，3=构建失败，4=环境缺失，1=未知错误。

## 打包参数速查

### 常用参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--name <string>` | 应用名 | 必填 |
| `--icon <path>` | 自定义图标路径 | 自动从网站 favicon 获取 |
| `--width <number>` | 窗口宽 | 1200 |
| `--height <number>` | 窗口高 | 780 |
| `--user-agent <string>` | 自定义 UA | 平台默认 |
| `--fullscreen` | 全屏启动 | false |
| `--hide-title-bar` | macOS 隐藏标题栏 | false |
| `--hide-window-decorations` | Windows/Linux 隐藏窗口装饰 | false |
| `--multi-arch` | macOS universal binary | false |
| `--inject <files>` | 注入 CSS/JS（逗号分隔） | 无 |
| `--debug` | 调试输出 | false |
| `--json` | 机器可读输出 | false |
| `--config <path>` | 声明式 JSON 配置 | 无 |

### 隐藏但有用

| 参数 | 说明 |
|------|------|
| `--identifier <string>` | Bundle ID，默认 `com.pake.a<md5>` |
| `--targets <string>` | 输出格式：`deb/appimage/rpm/zst`（Linux）、`x64/arm64`（Windows）、`intel/apple/universal/dmg/app`（macOS） |
| `--proxy-url <url>` | 应用内置代理（HTTP/SOCKS5，烧入二进制） |
| `--show-system-tray` | 系统托盘 |
| `--hide-on-close [bool]` | 关闭时隐藏到托盘 |
| `--start-to-tray` | 启动到托盘 |
| `--activation-shortcut <string>` | 全局激活快捷键 |
| `--multi-window` | 多窗口 |
| `--new-window` | 允许弹窗（OAuth 流程） |
| `--safe-domain <domains>` | SSO 回调域 |
| `--incognito` | 无痕模式（注意：会导致登录态不持久） |
| `--use-local-file` | 递归拷贝本地目录 |
| `--no-bundle` | Linux 跳过打包输出原始 exe |
| `--iterative-build` | 快速调试模式 |

完整参数见 `docs/cli-usage.md` 或 `node dist/cli.js --help`。

## 打包踩坑总结

### 坑 1：网站功能按钮失效（点赞/评论/收藏/分享）❗

**典型场景**：抖音、B 站等国内网站打包后，交互按钮失效。

**根因 A**：网站前端 UA 检测，识别 WebView 为非主流浏览器后降级。
**解决**：用 `--user-agent` 设置标准 Chrome UA：
```bash
--user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
```
- macOS 用 Safari UA：`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15`
- Linux 用 Chrome UA：`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36`

**根因 B**：`--incognito` 导致每次新会话，cookies/localStorage 不持久，登录态不完整。
**解决**：**不要**加 `--incognito`，除非用户明确要求无痕模式。

### 坑 2：首次编译慢 ⏳

首次打包会编译全部 Tauri Rust 依赖，Windows 10-15 分钟，macOS/Linux 5-10 分钟。后续构建复用 `src-tauri/target/` 缓存，约 1-2 分钟。

**不要中断**首次构建，耐心等待。

### 坑 3：图标格式要求

| 平台 | 图标格式 | 尺寸要求 |
|------|---------|---------|
| macOS | `.icns` | 推荐 256x256 起，自动套 squircle 蒙版 |
| Windows | `.ico` | 推荐 256x256，多尺寸（16/24/32/48/64/128/256） |
| Linux | `.png` | 推荐 512x512 |

**圆角图标制作**：用户若要求圆角图标（如 B 站风格），用 SVG 绘制后 sharp 光栅化：
```javascript
// SVG <rect rx="22%" /> 实现圆角，四角透明
const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" ry="112" fill="#FB7299"/>
  ...其他元素...
</svg>`;
await sharp(Buffer.from(svg)).resize(256, 256).png().toFile('icon.png');
```

然后手动构建 ICO（嵌入多尺寸 PNG）。详见 [图标制作脚本模板](#图标制作脚本模板)。

### 坑 4：本地 SPA 不支持 history-mode

`pake ./dist --name X` 仅支持 hash 路由。history-mode（`history.pushState`）会 404。

**解决方案**（计划中，未实现）：未来用 `--use-local-server` 内置 tiny_http。

### 坑 5：Google OAuth 拒绝

`--new-window` + `--safe-domain` 能缓解大多数 SSO，但 Google OAuth 明确拒绝嵌入式 WebView。

**方案**：文档告知用户用浏览器登录，或用原生客户端。

### 坑 6：Linux Wayland/niri WebKit 兼容

Niri 等纯 Wayland 合成器上点击/键盘可能失效。运行时设 `PAKE_LINUX_WEBKIT_SAFE_MODE=0 ./YourApp.AppImage`。

### 坑 7：代理只配置应用，不代理图标下载

`--proxy-url` 只配打包出的应用的 WebView 代理。CLI 本身的图标下载用 Node fetch，不走该代理。

国内用户拉 Google favicons 失败时，手动下载：
```bash
curl -x http://<proxy-host>:<port> -o /tmp/icon.png "<icon-url>"
pake "<URL>" --icon /tmp/icon.png
```

## 标准打包流程

### 1. 确认环境
```bash
rustc --version   # 必须 ≥1.85
node --version    # 必须 ≥18
```

### 2. 进入 Pake 仓库
```bash
cd /path/to/Pake
export PATH="$HOME/.cargo/bin:$PATH"
```

### 3. 执行打包
```bash
# 基础打包
node dist/cli.js https://example.com --name Example --json

# 国内网站（抖音/B 站等）必加 UA
node dist/cli.js https://www.douyin.com/ --name Douyin \
  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36" \
  --width 1280 --height 800 \
  --json

# 自定义图标
node dist/cli.js https://example.com --name Example \
  --icon /path/to/icon.ico \
  --json

# 本地静态站
node dist/cli.js ./dist --name MyApp --json
```

### 4. 交付产物
- Windows: `.msi`（默认）或 `.exe`
- macOS: `.dmg` 或 `.app`
- Linux: `.deb`、`.AppImage`、`.rpm`

产物路径在 `--json` 输出的 `outputs[].path` 字段。

## 声明式配置（推荐用于复杂场景）

```bash
cat > app.json <<'EOF'
{
  "$schema": "https://raw.githubusercontent.com/tw93/Pake/main/schema/pake.schema.json",
  "url": "https://example.com",
  "name": "MyApp",
  "width": 1280,
  "hideTitleBar": true,
  "userAgent": "Mozilla/5.0 ..."
}
EOF
node dist/cli.js --config app.json --json
```

字段是 CLI 选项的 camelCase 形式，外加 `url`。CLI 显式参数优先于配置文件。

## 图标制作脚本模板

当用户要求圆角图标时，参考以下脚本：

```javascript
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 1. SVG 绘制（圆角矩形 rx=22%）
const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" ry="112" fill="#FB7299"/>
  <!-- 在此添加应用图标元素 -->
</svg>`;

// 2. 光栅化为 PNG
const svgBuf = Buffer.from(svg);
await sharp(svgBuf).resize(512, 512).png().toFile('icon_512.png');
await sharp(svgBuf).resize(256, 256).png().toFile('icon_256.png');

// 3. 构建 ICO（嵌入多尺寸 PNG）
const sizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = {};
for (const s of sizes) {
  pngs[s] = await sharp(svgBuf).resize(s, s).png().toBuffer();
}

const headerSize = 6 + sizes.length * 16;
let offset = headerSize;
const entries = [];
for (const s of sizes) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(s === 256 ? 0 : s, 0);
  entry.writeUInt8(s === 256 ? 0 : s, 1);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngs[s].length, 8);
  entry.writeUInt32LE(offset, 12);
  entries.push(entry);
  offset += pngs[s].length;
}
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
const ico = Buffer.concat([header, ...entries, ...sizes.map(s => pngs[s])]);
fs.writeFileSync('icon.ico', ico);
```

## 验证打包结果

1. **安装后检查 UA**：打开 App，`Ctrl+Shift+I` 开 DevTools，控制台输入 `navigator.userAgent`，应返回设置的 UA
2. **检查图标**：快捷方式图标 + 窗口左上角图标都应是自定义的
3. **检查功能**：登录、点赞、评论等交互按钮应正常
4. **检查 Bundle ID**：`mdls -name kMDItemCFBundleIdentifier <path>.app`（macOS）

## 不该做的事

- 不要用 `--incognito` 打包需要登录的网站
- 不要在首次编译时中断（会留下半编译缓存）
- 不要用 `npm install -g pake-cli`（直接用 `node dist/cli.js` 即可）
- 不要忘记 `export PATH="$HOME/.cargo/bin:$PATH"`（Rust 不在默认 PATH 时）
- 不要用 `pnpm run dev` 打包（那是开发模式，用 `node dist/cli.js`）
