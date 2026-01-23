# 🌍 React Lite Translation Engine

A lightweight, dependency-free translation system for React and Next.js — with built-in RTL support, in-memory caching, and instant language switching.

Designed for developers who value simplicity, speed, and clean code.

## ✨ Features

- 🪶 **Zero Dependencies** — pure React implementation
- ⚡ **Instant Switching** — in-memory caching for blazing-fast translation changes
- 🌐 **RTL Support** — automatic right-to-left handling for Arabic, Hebrew, and more
- 🎯 **Type Safe** — optional TypeScript definitions included
- 📦 **Tiny Bundle** — ~5KB minified footprint
- 🔧 **Central Config** — single file to control everything
- 🎨 **Modular Structure** — organize translations by feature
- 🧩 **Next.js & SSR Ready** — works in any rendering environment

## 📦 Installation

```bash
npm install react-lite-translation
# or
yarn add react-lite-translation
```

## 🚀 Quick Start

### 1. Create a Configuration File

```javascript
// lt.config.js
export const TRANSLATION_CONFIG = {
  AVAILABLE_LANGUAGES: ['en', 'ar', 'fr', 'es'],
  DEFAULT_LANGUAGE: 'en',
  RTL_LANGUAGES: ['ar', 'he', 'fa', 'ur'],
  ENABLE_CACHING: true,
  API_ENDPOINT: '/api/translations',
  LANGUAGE_NAMES: {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    es: 'Español'
  }
};
```

### 2. Build Translation Modules

```javascript
// src/translations/home.js
export const HOME_EN = {
  title: "Welcome {name}!",
  subtitle: "A minimal and powerful translation engine."
};

export const HOME_AR = {
  title: "أهلاً بك يا {name}!",
  subtitle: "محرك ترجمة بسيط وقوي."
};
```

Register your modules:

```javascript
// src/translations/index.js
import { buildModuleConfig } from "react-lite-translate";
import { HOME_EN, HOME_AR } from "./home";

export const modules = buildModuleConfig({
  home: { en: HOME_EN, ar: HOME_AR }
});
```

### 3. Wrap Your Application

```javascript
// main.jsx or _app.js
import { TranslationProvider } from "react-lite-translate";
import { TRANSLATION_CONFIG } from "./lt.config.js";
import { modules } from "./src/translations";

<TranslationProvider config={TRANSLATION_CONFIG} localModules={modules}>
  <App />
</TranslationProvider>;
```

### 4. Use It in Components

```javascript
import { useTranslation } from "react-lite-translate";

function Home() {
  const { t, changeLanguage, lang } = useTranslation();

  return (
    <div>
      {/* Interpolation Support */}
      <h1>{t("home.title", { name: "Yacine" })}</h1>
      <p>{t("home.subtitle")}</p>

      <button onClick={() => changeLanguage(lang === "en" ? "ar" : "en")}>
        Switch Language
      </button>
    </div>
  );
}
```

## 🧠 API Reference

### TranslationProvider

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| config | object | The translation configuration (lt.config.js) |
| localModules | object | Local translation modules (replaces `modules` prop for clearer intent) |
| sort | boolean | Whether to fetch modules individually (default: false) |

### useTranslation()

**Returns:**

| Key | Type | Description |
|-----|------|-------------|
| t(key, params?, module?) | function | Get a translation value with optional interpolation |
| lang | string | Current language code |
| language | string | Alias for `lang` |
| changeLanguage(lang) | function | Change active language |
| isRTL | boolean | Whether the current language is RTL |
| isLoading | boolean | Whether translations are loading |
| error | string \| null | Current error state |
| availableLanguages | string[] | List of supported languages |
| languageNames | object | Map of language names |

## 🌐 RTL Support

RTL languages are detected based on `config.RTL_LANGUAGES` (defaults to `['ar', 'he', 'fa', 'ur']`).

The system updates the `<html>` tag with:
- `dir="rtl"`
- `lang="current-lang"`

## 🧩 Advanced Usage

### Dynamic Variables (Interpolation)

```javascript
// Translation: "Hello {name}, you have {count} messages."
t("messages.count", { name: "Alice", count: 5 }); 
// → "Hello Alice, you have 5 messages."
```

### Nested Keys

```javascript
t("user.profile.title"); // "User Profile"
```

### Fallback Values

```javascript
t("missing.key", "Default Text"); // → "Default Text"
```

## 🧱 Project Structure Example

```
src/
├── lt.config.js
├── translations/
│   ├── index.js
│   └── home.js
└── App.jsx
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| Initial Load | < 1ms (cached) |
| Language Switch | < 10ms |
| Bundle Size | ~5KB (minified) |
| Dependencies | 0 |

## 🧑‍💻 Why Lite Translation?

While developing **Benzene 1.0** — a student learning platform — existing i18n libraries felt too heavy and verbose for small, modular apps.

React Lite Translation Engine was built to solve that problem: simple, declarative, and fast enough for modern SPAs and Next.js sites alike.

## 🤝 Contributing

Pull requests are welcome!

Please open an issue before submitting large changes or feature requests.

## 📄 License

MIT © [Your Name]

Built with ❤️ for the React community.
