![Zairyo Themes Demo](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/hero.gif)

# <div align="center">Zairyo Themes</div>

<div align="center">

[English](README.md) | **Русский** | [Українська](README.uk.md)

<br>

[![Visual Studio Marketplace Version](https://badgen.net/vs-marketplace/v/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Installs](https://badgen.net/vs-marketplace/i/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Rating](https://badgen.net/vs-marketplace/rating/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)

</div>

**Автор:** thejenja  
**Вдохновлено:** Цветовой системой Material You

Zairyo предлагает 36 тем, сгенерированных из одного акцентного цвета. Каждая тема адаптирует систему цветовых токенов Material You в целостную и доступную палитру.

---

## 🎬 Превью тем

| Dark | Light | Dark Contrast | Light Contrast |
|------|-------|--------------|----------------|
| ![Dark](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark.gif) | ![Light](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light.gif) | ![Dark Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark-contrast.gif) | ![Light Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light-contrast.gif) |

---

## 🚀 Установка

1. Откройте **Расширения** (`Ctrl+Shift+X`)
2. Найдите `zairyo-themes`
3. Нажмите **Установить**

```bash
git clone https://github.com/thejenja/zairyo-theme-vscode.git
cd zairyo-theme-vscode
npm install
npm run generate
vsce package
code --install-extension zairyo-color-themes-*.vsix
```

---

## 🎯 Использование

1. Откройте **Палитру команд** (`Ctrl+Shift+P`)
2. Выполните `Preferences: Color Theme`
3. Выберите предпочтительный вариант **Zairyo**

VS Code запомнит последнюю использованную тему для каждого режима (тёмный/светлый).

---

## 🛠 Разработка

Все темы генерируются из цветов-затравок с помощью Google Material Color Utilities.

```bash
npm install
npm run generate   # Перегенерировать все 36 тем
```

---

## 📦 Публикация и VSIX

```bash
npm run generate
vsce package
vsce publish
```

---

## 🌠 Благодарности

Сделано с японской точностью **thejenja**  
Цветовая система Material You от Google  
[Material Color Utilities](https://github.com/material-foundation/material-color-utilities) от Google

_Тёмная и светлая темы адаптируются автоматически к системным настройкам. Контрастные варианты требуют ручного выбора._

---

_Happy coding with Zairyo! ✨_
