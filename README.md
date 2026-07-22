<h4 align="right"><strong>English</strong> | <a href="#中文文档">简体中文</a></h4>
<p align="center">
    <img src=https://gw.alipayobjects.com/zos/kfa/logo-modified.png width=138/>
</p>
<h1 align="center">Pake</h1>
<p align="center"><strong>Turn any webpage into a desktop app with one command, supports macOS, Windows, and Linux</strong></p>
<p align="center"><strong>一行命令将任意网页打包成轻量级桌面应用，支持 macOS、Windows 和 Linux</strong></p>

<div align="center">
    <a href="https://twitter.com/HiTw93" target="_blank">
    <img alt="twitter" src="https://img.shields.io/badge/follow-Tw93-red?style=flat-square&logo=Twitter"></a>
    <a href="https://t.me/+9f9gf4ZrFSQ2OWVl" target="_blank">
    <img alt="telegram" src="https://img.shields.io/badge/chat-telegram-blueviolet?style=flat-square&logo=Telegram"></a>
    <a href="https://github.com/tw93/Pake/releases" target="_blank">
    <img alt="GitHub downloads" src="https://img.shields.io/github/downloads/tw93/Pake/total.svg?style=flat-square"></a>
    <a href="https://github.com/tw93/Pake/releases/latest" target="_blank">
    <img alt="GitHub release" src="https://img.shields.io/github/release/tw93/Pake.svg?style=flat-square"></a>
    <a href="https://github.com/tw93/Pake/commits" target="_blank">
    <img alt="GitHub commit" src="https://img.shields.io/github/commit-activity/m/tw93/Pake?style=flat-square"></a>
</div>

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Popular Packages](#popular-packages)
- [CLI Reference](#cli-reference)
- [Declarative Config](#declarative-config)
- [GitHub Actions](#github-actions)
- [Pake Action Integration](#pake-action-integration)
- [Advanced Usage](#advanced-usage)
- [Development](#development)
- [Version Management](#version-management)
- [Release Workflow](#release-workflow)
- [FAQ / Troubleshooting](#faq--troubleshooting)
- [Shortcuts Reference](#shortcuts-reference)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [Support](#support)
- [License](#license)
- [Trademark](#trademark)
- [中文文档](#中文文档)

---

## Features

- 🎐 **Lightweight**: Installer is nearly 20 times smaller than Electron packages, typically under 10M on disk
- 🚀 **Fast**: Built with Rust Tauri, much faster than traditional JS frameworks with lower memory usage
- ⚡ **Easy to use**: One-command packaging via CLI or online building, no complex configuration needed
- 📦 **Feature-rich**: Supports shortcuts, immersive windows, drag & drop, style customization, ad removal

## Getting Started

Choose your path based on your needs:

| Path                                      | Who it's for   | What you need                          |
| ----------------------------------------- | -------------- | -------------------------------------- |
| **[Popular Packages](#popular-packages)** | Beginners      | Just download ready-made apps          |
| **[GitHub Actions](#github-actions)**     | Beginners      | A GitHub account, no local environment |
| **[CLI Tool](#cli-reference)**            | Developers     | Node.js + Rust                         |
| **[Custom Development](#development)**    | Advanced users | Full dev environment                   |

### Quick Start (CLI)

```bash
# Install Pake CLI
pnpm install -g pake-cli

# Basic usage - automatically fetches website icon
pake https://github.com --name GitHub

# Advanced usage with custom options
pake https://weekly.tw93.fun --name Weekly --icon https://cdn.tw93.fun/pake/weekly.icns --width 1200 --height 800 --hide-title-bar
```

### Prerequisites

- **Node.js** >= 18.0.0 (recommended >= 22.0.0)
- **Rust** >= 1.85.0 (installed automatically if missing)
- **Platform-specific**:
  - macOS: Xcode Command Line Tools (`xcode-select --install`)
  - Windows: Visual Studio Build Tools with MSVC + WebView2 Runtime (Win10+ built-in)
  - Linux: `libwebkit2gtk-4.1-dev`, `build-essential`, and companion libraries

<details>
<summary>📖 Linux platform-specific install commands</summary>

**Debian/Ubuntu:**

```bash
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

**Fedora:**

```bash
sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget file \
  libappindicator-gtk3-devel librsvg2-devel gtk3-devel
```

**Arch:**

```bash
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file \
  openssl gtk3 libappindicator-gtk3 librsvg
```

</details>

### Agent / Script Mode

Using Pake from a script or AI agent? Pass `--json` for machine-readable results:

```bash
pake https://example.com --name MyApp --json
# stdout → {"ok":true,"name":"MyApp","platform":"darwin","arch":"arm64",
#            "outputs":[{"path":"/abs/MyApp.dmg","sizeBytes":5242880,"format":"dmg"}],
#            "warnings":[],"error":null}
```

Exit codes: `0` success, `2` invalid input, `3` build failure, `4` missing environment, `1` unexpected.

Config schema: https://raw.githubusercontent.com/tw93/Pake/main/schema/pake.schema.json

## Popular Packages

Download ready-made apps from [Releases](https://github.com/tw93/Pake/releases):

| App           | Mac                                                                           | Windows                                                                           | Linux                                                                                |
| ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| WeRead        | [dmg](https://github.com/tw93/Pake/releases/latest/download/WeRead.dmg)       | [msi](https://github.com/tw93/Pake/releases/latest/download/WeRead_x64.msi)       | [deb](https://github.com/tw93/Pake/releases/latest/download/WeRead_x86_64.deb)       |
| Twitter       | [dmg](https://github.com/tw93/Pake/releases/latest/download/Twitter.dmg)      | [msi](https://github.com/tw93/Pake/releases/latest/download/Twitter_x64.msi)      | [deb](https://github.com/tw93/Pake/releases/latest/download/Twitter_x86_64.deb)      |
| DeepSeek      | [dmg](https://github.com/tw93/Pake/releases/latest/download/DeepSeek.dmg)     | [msi](https://github.com/tw93/Pake/releases/latest/download/DeepSeek_x64.msi)     | [deb](https://github.com/tw93/Pake/releases/latest/download/DeepSeek_x86_64.deb)     |
| ChatGPT       | [dmg](https://github.com/tw93/Pake/releases/latest/download/ChatGPT.dmg)      | [msi](https://github.com/tw93/Pake/releases/latest/download/ChatGPT_x64.msi)      | [deb](https://github.com/tw93/Pake/releases/latest/download/ChatGPT_x86_64.deb)      |
| Gemini        | [dmg](https://github.com/tw93/Pake/releases/latest/download/Gemini.dmg)       | [msi](https://github.com/tw93/Pake/releases/latest/download/Gemini_x64.msi)       | [deb](https://github.com/tw93/Pake/releases/latest/download/Gemini_x86_64.deb)       |
| Grok          | [dmg](https://github.com/tw93/Pake/releases/latest/download/Grok.dmg)         | [msi](https://github.com/tw93/Pake/releases/latest/download/Grok_x64.msi)         | [deb](https://github.com/tw93/Pake/releases/latest/download/Grok_x86_64.deb)         |
| YouTube       | [dmg](https://github.com/tw93/Pake/releases/latest/download/YouTube.dmg)      | [msi](https://github.com/tw93/Pake/releases/latest/download/YouTube_x64.msi)      | [deb](https://github.com/tw93/Pake/releases/latest/download/YouTube_x86_64.deb)      |
| YouTube Music | [dmg](https://github.com/tw93/Pake/releases/latest/download/YouTubeMusic.dmg) | [msi](https://github.com/tw93/Pake/releases/latest/download/YouTubeMusic_x64.msi) | [deb](https://github.com/tw93/Pake/releases/latest/download/YouTubeMusic_x86_64.deb) |
| Notion        | [dmg](https://github.com/tw93/Pake/releases/latest/download/Notion.dmg)       | [msi](https://github.com/tw93/Pake/releases/latest/download/Notion_x64.msi)       | [deb](https://github.com/tw93/Pake/releases/latest/download/Notion_x86_64.deb)       |
| Excalidraw    | [dmg](https://github.com/tw93/Pake/releases/latest/download/Excalidraw.dmg)   | [msi](https://github.com/tw93/Pake/releases/latest/download/Excalidraw_x64.msi)   | [deb](https://github.com/tw93/Pake/releases/latest/download/Excalidraw_x86_64.deb)   |
| XiaoHongShu   | [dmg](https://github.com/tw93/Pake/releases/latest/download/XiaoHongShu.dmg)  | [msi](https://github.com/tw93/Pake/releases/latest/download/XiaoHongShu_x64.msi)  | [deb](https://github.com/tw93/Pake/releases/latest/download/XiaoHongShu_x86_64.deb)  |
| Flomo         | [dmg](https://github.com/tw93/Pake/releases/latest/download/Flomo.dmg)        | [msi](https://github.com/tw93/Pake/releases/latest/download/Flomo_x64.msi)        | [deb](https://github.com/tw93/Pake/releases/latest/download/Flomo_x86_64.deb)        |

More apps available at [Releases page](https://github.com/tw93/Pake/releases).

## CLI Reference

### Installation

```bash
# Recommended
pnpm install -g pake-cli

# Alternative
npm install -g pake-cli

# Run without installing
npx pake-cli [url] [options]
```

### Basic Usage

```bash
pake [url] [options]
```

The URL can be:

- A web URL: `pake https://example.com --name Example`
- A local HTML file: `pake ./page.html --name MyPage`
- A local directory (must contain `index.html`): `pake ./dist --name MyTool`

> **Note**: For local packaging, hash-based routing works out of the box; history-mode SPA routing is not yet supported.

### All Parameters

<details>
<summary>📋 Click to expand full parameter table (40+ options)</summary>

#### Application

| Parameter                | Description                            | Default            |
| ------------------------ | -------------------------------------- | ------------------ |
| `[url]`                  | Web URL, local HTML file, or directory | Required           |
| `--name <string>`        | Application name                       | Required           |
| `--identifier <string>`  | Bundle ID (hidden)                     | Auto from URL+name |
| `--icon <string>`        | Application icon path/URL              | Auto from favicon  |
| `--app-version <string>` | App version (hidden)                   | `1.0.0`            |
| `--title <string>`       | Window title (hidden)                  | App name           |

#### Window

| Parameter                   | Description                  | Default |
| --------------------------- | ---------------------------- | ------- |
| `--width <number>`          | Window width                 | 1200    |
| `--height <number>`         | Window height                | 780     |
| `--min-width <number>`      | Minimum width (hidden)       | 0       |
| `--min-height <number>`     | Minimum height (hidden)      | 0       |
| `--zoom <number>`           | Initial zoom 50-200 (hidden) | 100     |
| `--fullscreen`              | Start fullscreen             | false   |
| `--maximize`                | Start maximized (hidden)     | false   |
| `--hide-title-bar`          | macOS: hide title bar        | false   |
| `--hide-window-decorations` | Win/Linux: hide decorations  | false   |
| `--always-on-top`           | Always on top (hidden)       | false   |
| `--resizable`               | Window resizable             | true    |

#### Behavior

| Parameter                        | Description                            | Default |
| -------------------------------- | -------------------------------------- | ------- |
| `--dark-mode`                    | Force dark mode (hidden)               | false   |
| `--disabled-web-shortcuts`       | Disable web shortcuts (hidden)         | false   |
| `--activation-shortcut <string>` | Global activation shortcut (hidden)    | empty   |
| `--enable-find`                  | In-page Find UI Ctrl+F/G (hidden)      | false   |
| `--force-internal-navigation`    | Keep all links in window               | false   |
| `--internal-url-regex <string>`  | Internal URL regex                     | empty   |
| `--safe-domain <domains>`        | Comma-separated safe domains           | empty   |
| `--new-window`                   | Allow popups (auth, tabs)              | false   |
| `--multi-instance`               | Allow multiple instances (hidden)      | false   |
| `--multi-window`                 | Multiple windows per instance (hidden) | false   |

#### System Tray

| Parameter                     | Description                            | Default                          |
| ----------------------------- | -------------------------------------- | -------------------------------- |
| `--show-system-tray`          | Show system tray                       | false (macOS) / true (Win/Linux) |
| `--system-tray-icon <string>` | Custom tray icon (hidden)              | App icon                         |
| `--hide-on-close [bool]`      | Hide on close instead of exit (hidden) | true (macOS) / false             |
| `--start-to-tray`             | Start minimized to tray (hidden)       | false                            |

#### Build & Packaging

| Parameter                     | Description                                  | Default          |
| ----------------------------- | -------------------------------------------- | ---------------- |
| `--targets <string>`          | Output format (platform-specific)            | Platform default |
| `--multi-arch`                | macOS: universal binary (Intel+Apple)        | false            |
| `--no-bundle`                 | Linux: skip packaging, raw exe (hidden)      | false            |
| `--keep-binary`               | Keep raw binary alongside installer (hidden) | false            |
| `--iterative-build`           | Rapid debug mode, app only (hidden)          | false            |
| `--use-local-file`            | Copy local dir recursively                   | false            |
| `--inject <files>`            | Inject CSS/JS (comma-separated)              | empty            |
| `--proxy-url <url>`           | Proxy for app WebView (hidden)               | empty            |
| `--user-agent <string>`       | Custom User-Agent (hidden)                   | Platform default |
| `--ignore-certificate-errors` | Ignore cert errors (hidden)                  | false            |

#### Platform-Specific

| Parameter                       | Description                              | Default |
| ------------------------------- | ---------------------------------------- | ------- |
| `--install`                     | macOS: install to /Applications (hidden) | false   |
| `--camera`                      | macOS: camera permission (hidden)        | false   |
| `--microphone`                  | macOS: microphone permission (hidden)    | false   |
| `--incognito`                   | Incognito/private mode (hidden)          | false   |
| `--wasm`                        | Enable WebAssembly (hidden)              | false   |
| `--enable-drag-drop`            | Enable drag & drop (hidden)              | false   |
| `--installer-language <string>` | Windows installer language (hidden)      | `en-US` |

#### CLI Mode

| Parameter         | Description                   | Default |
| ----------------- | ----------------------------- | ------- |
| `--debug`         | Debug build with more output  | false   |
| `--json`          | Machine-readable output       | false   |
| `--config <path>` | Load options from JSON config | empty   |

#### Targets by Platform

| Platform | Valid targets                                                            |
| -------- | ------------------------------------------------------------------------ |
| macOS    | `intel`, `apple`, `universal`, `app`, `dmg`                              |
| Windows  | `x64`, `arm64`                                                           |
| Linux    | `deb`, `appimage`, `rpm`, `zst`, and `-arm64` variants (comma-separated) |

</details>

### Output Formats

| Platform | Format                                                |
| -------- | ----------------------------------------------------- |
| macOS    | `.dmg`, `.app` (universal binary with `--multi-arch`) |
| Windows  | `.msi`                                                |
| Linux    | `.deb`, `.AppImage`, `.rpm`, `.zst`                   |

### Icons

- Auto-fetched from site favicon when `--icon` is omitted (multiple sources: logo.dev, brandfetch, clearbit, Google favicons)
- Auto-converted to platform format: `.icns` (macOS), `.ico` (Windows), `.png` (Linux)
- macOS icons get a squircle mask automatically
- Prefer 256x256 or larger PNGs; SVG also works

### Docker

```bash
docker run --rm -v $(pwd):/output ghcr.io/tw93/pake:latest \
  https://example.com --name MyApp --json
```

## Declarative Config

```bash
cat > app.json <<'EOF'
{
  "$schema": "https://raw.githubusercontent.com/tw93/Pake/main/schema/pake.schema.json",
  "url": "https://example.com",
  "name": "MyApp",
  "width": 1280,
  "hideTitleBar": true
}
EOF
pake --config app.json --json
```

Fields are camelCase CLI option names plus `url`. Explicit CLI flags win over config fields. Unknown fields fail fast.

## GitHub Actions

Build Pake apps online without installing development tools locally.

### Quick Steps

1. **Fork** [this project](https://github.com/tw93/Pake/fork)
2. Go to **Actions** tab -> select `Build App With Pake CLI`
3. Fill in the form (same parameters as CLI options)
4. Click **Run Workflow**
5. Green checkmark = build success. Find your app in **Artifacts**.

**Build times**: First run ~10-15 min, subsequent ~5 min (uses cache).

### Using Pake as a GitHub Action

```yaml
- name: Build Pake App
  uses: tw93/Pake@v3
  with:
    url: "https://example.com"
    name: "MyApp"
```

| Input        | Description      | Required | Default |
| ------------ | ---------------- | -------- | ------- |
| `url`        | Target URL       | ✅       |         |
| `name`       | App name         | ✅       |         |
| `output-dir` | Output directory |          | `dist`  |
| `icon`       | Custom icon      |          |         |
| `width`      | Window width     |          | `1200`  |
| `height`     | Window height    |          | `780`   |
| `debug`      | Debug mode       |          | `false` |

Multi-platform example:

```yaml
jobs:
  build:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: tw93/Pake@v3
        with:
          url: "https://example.com"
          name: "CrossPlatformApp"
```

## Advanced Usage

### Style Customization

Edit `src-tauri/src/inject/style.js` to customize appearance:

- Remove ads or modify page styles
- Apply CSS before page loads

### JavaScript Injection

Edit `src-tauri/src/inject/event.js` for custom keyboard shortcuts and behaviors.

Use `--inject file1.css,file2.js` to inject custom files.

### Container Communication

Pake supports communication between the web page and Rust backend via Tauri's IPC:

```javascript
// In the web page
await window.__TAURI__.core.invoke("download_file", { url: "..." });
```

```rust
// In Rust (src-tauri/src/app/invoke.rs)
#[tauri::command]
async fn download_file(url: String) -> Result<(), String> { ... }
```

### Window Configuration

Window options in `pake.json`:

- `hide_title_bar`: macOS only (immersive header)
- `hide_window_decorations`: Windows and Linux only
- `fullscreen`, `maximize`, `always_on_top`, `dark_mode`

### Static File Packaging

- **Directory**: Must contain `index.html` at root
- **Single file**: Use `--use-local-file` to copy sibling files
- **Routing**: Hash-based works; history-mode SPA not yet supported

### macOS Media Permissions

```bash
pake https://meet.google.com --name GoogleMeet --camera --microphone
```

## Development

### Prerequisites

- Node.js >= 22.0.0 (recommended LTS; >= 18.0.0 also works)
- Rust >= 1.85.0 (required for edition2024 support)
- Platform-specific:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Windows**: Visual Studio Build Tools with MSVC
  - **Linux**: `libwebkit2gtk-4.1-dev`, `build-essential`, system dependencies

### Installation & Commands

```bash
# Clone
git clone https://github.com/tw93/Pake.git
cd Pake

# Install dependencies
pnpm install

# Development (Tauri only)
pnpm run dev

# Development (CLI + Tauri, recommended for CLI changes)
pnpm run cli:dev -- https://web.telegram.org/k/

# Faster dev (skip checks)
pnpm run cli:dev --iterative-build

# Build CLI (TypeScript -> dist/cli.js)
pnpm run cli:build

# Build for current platform
pnpm run build

# macOS universal binary
pnpm run build:mac

# Run tests
npx vitest run                    # Unit + integration (fast)
pnpm test -- --no-build           # Full suite minus multi-arch real build
pnpm test                         # Everything including release flow

# Format code
pnpm run format

# Release check
pnpm run release:check

# Schema generation (from CLI metadata)
pnpm run schema:generate
pnpm run schema:check

# Sync skills from WorkBuddy to Claude Code
pnpm run sync:skills              # incremental sync
pnpm run sync:skills:check       # check drift (used in release:check)

# Bump version (4 files synced)
pnpm run bump:version -- 3.16.0
```

### Skill Synchronization

Skills live in `.workbuddy/skills/` (source of truth) and are **automatically synced** to `.claude/skills/` for Claude Code compatibility.

```bash
# Manual sync (incremental -- only copies changed files)
pnpm run sync:skills

# Force overwrite all
node scripts/sync-skills.mjs --force

# Check if in sync (CI gate)
pnpm run sync:skills:check

# Clean stale targets
node scripts/sync-skills.mjs --clean
```

Editing `.workbuddy/skills/` in Claude Code triggers automatic sync via PostToolUse hook. The hook runs `sync-skills.mjs` and notifies the agent.

**Source of truth**: `.workbuddy/skills/` -- always edit here. `.claude/skills/` is a read-only mirror.

### Code Conventions

- **No Chinese comments** in any source file (Rust / TypeScript / any file)
- Comments and identifiers in English; follow the existing language of surrounding prose
- Use `PakeError` with `{code, hint}` for predictable CLI failures
- In `--json` mode: stdout is reserved for the single JSON result; never `console.log` in `bin/`
- No `panic!` / `.unwrap()` / `.expect()` on user-reachable Rust paths

### Project Structure

```
Pake/
├── bin/                        # CLI source (TypeScript)
│   ├── cli.ts                  # Main CLI entry (Commander.js)
│   ├── types.ts                # Type definitions
│   ├── defaults.ts             # Default option values
│   ├── schema/                 # CLI options metadata (single source of truth)
│   ├── builders/               # Platform builders (Mac/Win/Linux)
│   ├── helpers/                # Business logic (merge, config, rust)
│   ├── options/                # User input handling
│   └── utils/                  # Utility functions
├── src-tauri/                  # Tauri Rust application
│   ├── src/                    # Rust source
│   │   ├── lib.rs              # Main entry
│   │   ├── app/                # Window, menu, setup, invoke
│   │   └── inject/             # Injected JS/CSS
│   ├── Cargo.toml              # Rust dependencies
│   ├── tauri.conf.json         # Tauri configuration
│   └── pake.json               # Default app config
├── schema/                     # pake.schema.json (--config JSON schema)
├── scripts/                    # Utility scripts
├── tests/                      # Unit and integration tests
├── .workbuddy/skills/          # AI Agent skills (flat structure)
├── .github/workflows/          # CI/CD
├── default_app_list.json       # Popular apps for release builds
└── package.json
```

### Branch Strategy

Only `main` branch. All development and releases happen here directly.

### Cross-Compilation Limit

Pake uses Tauri (Rust) with system WebView. **Cross-compilation is not supported** for platforms requiring native WebView:

| Running on | Can build for               |
| ---------- | --------------------------- |
| Windows    | Windows MSI only            |
| macOS      | macOS DMG/APP only          |
| Linux      | Linux DEB/AppImage/RPM only |

To build for all three platforms, use GitHub Actions (three runners) or build on each platform separately.

## Version Management

Four files must be updated in sync for every release:

| File                        | Field                        |
| --------------------------- | ---------------------------- |
| `package.json`              | `"version"`                  |
| `src-tauri/Cargo.toml`      | `version` under `[package]`  |
| `src-tauri/Cargo.lock`      | `version` for package `pake` |
| `src-tauri/tauri.conf.json` | `"version"`                  |

**One-command bump:**

```bash
pnpm run bump:version -- X.Y.Z
```

Tag format: `V<major.minor.patch>` with uppercase `V` (e.g. `V3.13.1`).

After version bump, rebuild CLI:

```bash
pnpm run cli:build
```

## Release Workflow

Pushing a `V*` tag triggers:

1. **release-apps** -- reads `default_app_list.json`
2. **create-release** -- creates GitHub Release placeholder
3. **build-cli** -- builds and uploads CLI artifact
4. **build-popular-apps** -- builds all apps in parallel (macOS/Windows/Linux)
5. **publish-docker** -- builds and pushes Docker image to GHCR

Also triggers `npm-publish.yml` (Trusted Publishing to npm).

Quality checks: `.github/workflows/quality-and-test.yml` runs on every push.

## FAQ / Troubleshooting

<details>
<summary>🔧 Build Issues</summary>

#### Rust Version Error: "feature 'edition2024' is required"

Update Rust to >= 1.85.0: `rustup update stable`

#### Linux: "Can't detect any appindicator library" on Ubuntu 24.04

```bash
sudo apt install libayatana-appindicator3-dev
```

#### Linux: AppImage Build Fails with "failed to run linuxdeploy"

```bash
# Option 1: Set NO_STRIP
NO_STRIP=1 pake <url> --name X --targets appimage

# Option 2: Install gdk-pixbuf loaders
sudo apt install librsvg2-common gdk-pixbuf2.0-bin
sudo gdk-pixbuf-query-loaders --update-cache

# Option 3: Build DEB instead
pake <url> --name X --targets deb
```

#### Linux: AppImage Opens but Buttons/Keyboard Don't Work on Wayland

```bash
PAKE_LINUX_WEBKIT_SAFE_MODE=0 ./YourApp.AppImage
```

#### Linux: "cargo: command not found" After Installing Rust

```bash
source ~/.cargo/env  # macOS/Linux
# Or reopen terminal
```

#### Windows: Installation Timeout During First Build

First build compiles all Tauri dependencies (10-15 min). Be patient. Or set `PAKE_USE_CN_MIRROR=1` for Chinese mirror.

#### Windows: Missing Visual Studio Build Tools

Install [Visual Studio Build Tools 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with "Desktop development with C++" workload.

#### macOS: Build Fails with Module Compilation Errors

Create `src-tauri/.cargo/config.toml`:

```toml
[env]
MACOSX_DEPLOYMENT_TARGET = "15.0"
SDKROOT = "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk"
```

</details>

<details>
<summary>⚙️ Runtime Issues</summary>

#### Website Features Not Working (Login, Upload, Buttons)

**Most common cause**: User-Agent detection. Set a standard Chrome UA:

```bash
pake https://www.douyin.com --name Douyin \
  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36"
```

**Second cause**: `--incognito` breaks login state. Don't use `--incognito` for sites requiring login.

**Google OAuth**: May reject embedded WebViews regardless of flags. Use `--new-window --safe-domain` for most SSO flows.

#### App Icon Not Showing Correctly

- macOS: `.icns` format, 256x256+
- Windows: `.ico` format, 256x256 with multiple sizes
- Linux: `.png` format, 512x512
- Use `--icon <path>` to specify custom icon

#### App Uses More Memory Than Expected

The ~5MB is the installer size, not runtime memory. WebView processes use additional memory.

</details>

<details>
<summary>📦 Installation Issues</summary>

#### Permission Denied When Installing Globally

```bash
# Use npx (no install needed)
npx pake-cli [url] [options]

# Or fix npm permissions
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Or use pnpm
pnpm install -g pake-cli
```

</details>

## Shortcuts Reference

| Mac                                                       | Windows/Linux                                       | Function              |
| --------------------------------------------------------- | --------------------------------------------------- | --------------------- |
| <kbd>⌘</kbd> + <kbd>[</kbd>                               | <kbd>Ctrl</kbd> + <kbd>←</kbd>                      | Previous page         |
| <kbd>⌘</kbd> + <kbd>]</kbd>                               | <kbd>Ctrl</kbd> + <kbd>→</kbd>                      | Next page             |
| <kbd>⌘</kbd> + <kbd>↑</kbd>                               | <kbd>Ctrl</kbd> + <kbd>↑</kbd>                      | Scroll to top         |
| <kbd>⌘</kbd> + <kbd>↓</kbd>                               | <kbd>Ctrl</kbd> + <kbd>↓</kbd>                      | Scroll to bottom      |
| <kbd>⌘</kbd> + <kbd>r</kbd>                               | <kbd>Ctrl</kbd> + <kbd>r</kbd>                      | Refresh               |
| <kbd>⌘</kbd> + <kbd>w</kbd>                               | <kbd>Ctrl</kbd> + <kbd>w</kbd>                      | Hide window           |
| <kbd>⌘</kbd> + <kbd>-</kbd>                               | <kbd>Ctrl</kbd> + <kbd>-</kbd>                      | Zoom out              |
| <kbd>⌘</kbd> + <kbd>=</kbd>                               | <kbd>Ctrl</kbd> + <kbd>=</kbd>                      | Zoom in               |
| <kbd>⌘</kbd> + <kbd>0</kbd>                               | <kbd>Ctrl</kbd> + <kbd>0</kbd>                      | Reset zoom            |
| <kbd>⌘</kbd> + <kbd>L</kbd>                               | <kbd>Ctrl</kbd> + <kbd>L</kbd>                      | Copy URL              |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>⌥</kbd> + <kbd>V</kbd> | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>   | Paste and Match Style |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>H</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd>   | Go to Home            |
| <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>I</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>   | Toggle DevTools       |
| <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>⌫</kbd>                | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Del</kbd> | Clear Cache & Restart |
| <kbd>⌃</kbd> + <kbd>⌘</kbd> + <kbd>F</kbd>                | <kbd>F11</kbd>                                      | Toggle Fullscreen     |

Double-click the title bar to switch fullscreen. On Windows/Linux, use `--hide-window-decorations` for frameless windows.

## Contributing

Welcome to create [pull requests](https://github.com/tw93/Pake/compare/) for bugfix, new features, docs, or suggestions.

### PR Triage

Sort every community PR into one of three outcomes:

- **Merge as-is**: implementation is sound. Verify locally (build + tests), merge, thank the author.
- **Right direction, needs work**: push fixes directly onto the contributor's branch to preserve authorship.
- **Out of scope**: close as not planned with a one-line explanation.

It's good practice to create a feature request issue before implementing a new feature. For typos or doc readability improvements, just create a PR directly.

## Code of Conduct

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity, level of experience, education, socio-economic status, nationality, appearance, race, religion, or sexual identity.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

The full [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) applies. Report issues to tw93@qq.com.

## Support

- The most direct way to support is getting [Mole for Mac](https://mole.fit), the author's paid Mac cleanup app.
- Give it a ⭐, [share it](https://twitter.com/intent/tweet?url=https://github.com/tw93/Pake&text=Pake%20-%20Turn%20any%20webpage%20into%20a%20desktop%20app), or open an issue/PR.
- Feed the author's cats TangYuan and Coke 🥩 at <https://cats.tw93.fun?name=Pake>

## License

Pake is open source under GPL-3.0, see [LICENSE](LICENSE) and [Pake Output Exception](LICENSE-EXCEPTION); apps you build with Pake are entirely yours to use and distribute. If you fork Pake into your own product, give it a different name and credit Pake as the source.

## Trademark

"Pake" and the Pake logo are trademarks of the Pake project (Tw93). The code license covers the code, not the brand. If you publish a fork or derived product, use your own name and icon, don't imply endorsement, and don't use the Pake name for paid or competing products.

---

## 中文文档

Pake 是一个用 Rust + Tauri 把网页打包成桌面应用的工具，一键命令生成 macOS、Windows、Linux 三端原生安装包，体积仅约 5MB（Electron 的 1/20）。

### 特性

- 🎐 **轻量**：安装包比 Electron 小 20 倍，通常不到 10M
- 🚀 **快速**：基于 Rust Tauri，比传统 JS 框架更快，内存占用更低
- ⚡ **易用**：一行命令打包，无需复杂配置
- 📦 **功能丰富**：快捷键、沉浸式窗口、拖拽、样式定制、去广告

### 快速开始

```bash
# 安装 CLI
pnpm install -g pake-cli

# 基础用法 - 自动获取网站图标
pake https://github.com --name GitHub

# 高级用法
pake https://weekly.tw93.fun --name Weekly --width 1200 --height 800 --hide-title-bar
```

### 前置环境

- Node.js >= 18（推荐 22）
- Rust >= 1.85（缺失时自动安装）
- macOS：Xcode 命令行工具
- Windows：Visual Studio Build Tools + WebView2 运行时
- Linux：`libwebkit2gtk-4.1-dev` 等

### 打包国内网站注意事项

**抖音、B站等网站打包后点赞/评论按钮失效的解决方案**：

```bash
# 1. 设置标准 Chrome UA（关键！）
pake https://www.douyin.com --name Douyin \
  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36" \
  --width 1280 --height 800

# 2. 不要加 --incognito（会导致登录状态不持久）
```

### 三端打包限制

Pake 基于 Tauri（Rust），**不支持交叉编译**：

| 在哪个系统运行 | 能打包的目标                  |
| -------------- | ----------------------------- |
| Windows        | 只能打 Windows MSI            |
| macOS          | 只能打 macOS DMG/APP          |
| Linux          | 只能打 Linux DEB/AppImage/RPM |

要同时打三端：用 GitHub Actions（项目自带 workflow）或三台机器分别跑。

### 输出格式

| 平台    | 格式                                    |
| ------- | --------------------------------------- |
| macOS   | `.dmg`、`.app`（支持 universal binary） |
| Windows | `.msi`                                  |
| Linux   | `.deb`、`.AppImage`、`.rpm`、`.zst`     |

### 开发

```bash
git clone https://github.com/tw93/Pake.git
cd Pake
pnpm install

# 开发模式
pnpm run dev

# CLI 开发模式
pnpm run cli:dev -- https://example.com

# 构建 CLI
pnpm run cli:build

# 运行测试
npx vitest run

# 格式化代码
pnpm run format
```

### 版本管理

```bash
# 一键 bump 四文件版本号
pnpm run bump:version -- 3.16.0

# 然后重建 CLI 并提交
pnpm run cli:build
git add -A
git commit -m "chore(release): v3.16.0"
git tag V3.16.0
git push origin main --tags
```

### 代码规范

- 源码注释一律英文，禁止中文注释
- 使用 `PakeError` 抛出带 `{code, hint}` 的可预测错误
- `--json` 模式下 stdout 只输出一个 JSON 结果

### 许可证

GPL-3.0，但打包出来的应用归用户所有（见 LICENSE-EXCEPTION）。如 fork 本项目，请改名并注明来源。

---

<a href="https://github.com/tw93/Pake/graphs/contributors">
  <img src="./CONTRIBUTORS.svg?v=2" alt="Contributors" width="1000" />
</a>
