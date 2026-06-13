![Zairyo Themes Demo](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/hero.gif)

# <div align="center">Zairyo Themes</div>

<div align="center">

[English](README.md) | [Русский](README.ru.md) | **Українська**

<br>

[![Visual Studio Marketplace Version](https://badgen.net/vs-marketplace/v/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Installs](https://badgen.net/vs-marketplace/i/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)
[![Visual Studio Marketplace Rating](https://badgen.net/vs-marketplace/rating/thejenja.zairyo-color-themes)](https://marketplace.visualstudio.com/items?itemName=thejenja.zairyo-color-themes)

</div>

**Автор:** thejenja  
**Натхненно:** Колірною системою Material You

Zairyo пропонує 36 тем, згенерованих з одного акцентного кольору. Кожна тема адаптує систему колірних токенів Material You у цілісну та доступну палітру.

---

## 🎬 Прев'ю тем

| Dark | Light | Dark Contrast | Light Contrast |
|------|-------|--------------|----------------|
| ![Dark](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark.gif) | ![Light](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light.gif) | ![Dark Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/dark-contrast.gif) | ![Light Contrast](https://raw.githubusercontent.com/thejenja/zairyo-theme-vscode/main/assets/light-contrast.gif) |

---

## 🚀 Встановлення

1. Відкрийте **Розширення** (`Ctrl+Shift+X`)
2. Знайдіть `zairyo-themes`
3. Натисніть **Встановити**

```bash
git clone https://github.com/thejenja/zairyo-theme-vscode.git
cd zairyo-theme-vscode
npm install
npm run generate
vsce package
code --install-extension zairyo-color-themes-*.vsix
```

---

## 🎯 Використання

1. Відкрийте **Палітру команд** (`Ctrl+Shift+P`)
2. Виконайте `Preferences: Color Theme`
3. Виберіть бажаний варіант **Zairyo**

VS Code запам'ятає останню використану тему для кожного режиму (темний/світлий).

---

## 🛠 Розробка

Всі теми генеруються з кольорів-затравок за допомогою Google Material Color Utilities.

```bash
npm install
npm run generate   # Перегенерувати всі 36 тем
```

---

## 📦 Публікація та VSIX

```bash
npm run generate
vsce package
vsce publish
```

---

## 🌠 Подяки

Зроблено з японською точністю **thejenja**  
Колірна система Material You від Google  
[Material Color Utilities](https://github.com/material-foundation/material-color-utilities) від Google

_Темна та світла теми адаптуються автоматично до системних налаштувань. Контрастні варіанти потребують ручного вибору._

---

_Happy coding with Zairyo! ✨_
