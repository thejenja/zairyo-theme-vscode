![Zairyo Themes Demo](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/hero.gif)

# <div align="center">Zairyo Themes</div>

<div align="center">

**English** | [Русский](README.ru.md) | [Українська](README.uk.md)

<br>

[![Visual Studio Marketplace Version](https://badgen.net/vs-marketplace/v/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Installs](https://badgen.net/vs-marketplace/i/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Rating](https://badgen.net/vs-marketplace/rating/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)

</div>

**Author:** thejenja  
**Inspired by:** Material You color system

Transform your coding environment with Zairyo, a collection of 36 carefully crafted VS Code themes generated from a single accent color. Each theme adapts the Material You color token system into a cohesive, accessible palette.

---

## 🎬 Theme Previews

| Dark | Light | Dark Contrast | Light Contrast |
|------|-------|--------------|----------------|
| ![Dark](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark.gif) | ![Light](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light.gif) | ![Dark Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark-contrast.gif) | ![Light Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light-contrast.gif) |

---

## 🚀 Installation

### From VSCode

1. Open **Extensions** (`Ctrl+Shift+X`)
2. Search for `zairyo-themes`
3. Click **Install**

### Manual

```bash
git clone https://github.com/thejenja/zairyo-theme-vscode.git
cd zairyo-theme-vscode
npm install
npm run generate
vsce package
code --install-extension zairyo-color-themes-*.vsix
```

---

## 🎯 Usage

1. Open **Command Palette** (`Ctrl+Shift+P`)
2. Run `Preferences: Color Theme`
3. Select your preferred **Zairyo** variant

VS Code will remember your last used theme per color mode (dark/light).

---

## 🛠 Development

All themes are generated from seed colors using Google's Material Color Utilities.

```bash
# Install dependencies
npm install

# Regenerate all 36 themes from seed colors
npm run generate
```

---

## 📦 Publishing & VSIX

```bash
npm run generate
vsce package
vsce publish
```

---

## 🌠 Credits

Made with Japanese precision by **thejenja**  
Material You color system by Google  
[Material Color Utilities](https://github.com/material-foundation/material-color-utilities) by Google

_Light & dark variants adapt automatically to system preference. Contrast variants require manual selection._

---

_Happy coding with Zairyo! ✨_
