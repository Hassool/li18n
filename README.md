# 🌍 React Lite Translation Engine

A lightweight, dependency-free translation system for React and Next.js — with built-in RTL support, in-memory caching, and instant language switching.

> **v2.0 Update**: Now with improved TypeScript support, smarter interpolation, and enhanced module loading.

Designed for developers who value simplicity, speed, and clean code.

## ✨ Features

- 🪶 **Zero Dependencies** — Pure React implementation
- ⚡ **Instant Switching** — In-memory caching for blazing-fast translation changes
- 🌐 **RTL Support** — Automatic right-to-left handling (Arabic, Hebrew, Persian, etc.)
- 🎯 **Type Safe** — Full TypeScript definitions included
- 📦 **Tiny Bundle** — ~5KB minified
- 🔧 **Central Config** — Single configuration source
- 🎨 **Modular Structure** — Split translations by feature (e.g., `home`, `auth`, `dashboard`)
- 🧩 **Next.js & SSR Ready** — Works seamlessly with App Router and Pages Router

## 📦 Installation

```bash
npm install react-lite-translation
# or
yarn add react-lite-translation
```

## 🚀 Quick Start

### 1. Configuration (lt.config.js)

Create a configuration file to define your languages and settings.

```javascript
// lt.config.js
export const TRANSLATION_CONFIG = {
  AVAILABLE_LANGUAGES: ['en', 'ar', 'fr', 'es'],
  DEFAULT_LANGUAGE: 'en',
  RTL_LANGUAGES: ['ar', 'he', 'fa', 'ur'], // Auto-switches dir="rtl"
  ENABLE_CACHING: true,
  API_ENDPOINT: '/api/translations', // Optional: for fetching remote translations
  
  // Optional: User-friendly names
  LANGUAGE_NAMES: {
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    es: 'Español'
  }
};
```

### 2. Define Translations

You can organize translations into modules.

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

Register them in a central logical mapping:

```javascript
// src/translations/index.js
import { buildModuleConfig } from "react-lite-translation";
import { HOME_EN, HOME_AR } from "./home";

// Provides a structured way to access local translations
export const modules = {
  home: { 
    en: HOME_EN, 
    ar: HOME_AR 
  }
};
```

### 3. Wrap Your App

Wrap your root application with the `TranslationProvider`.

```javascript
// app/layout.jsx (Next.js) or src/App.jsx (React)
"use client";

import { TranslationProvider } from "react-lite-translation";
import { TRANSLATION_CONFIG } from "./lt.config";
import { modules } from "./src/translations";

export default function RootLayout({ children }) {
  return (
    <TranslationProvider 
      config={TRANSLATION_CONFIG} 
      localModules={modules} // Pass your local default translations
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </TranslationProvider>
  );
}
```

### 4. Use in Components

Use the `useTranslation` hook to access translations and control language settings.

```javascript
import { useTranslation } from "react-lite-translation";

function Hero() {
  const { t, changeLanguage, lang, isRTL } = useTranslation();

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Basic Usage with Interpolation */}
      <h1>{t("home.title", { name: "Yacine" })}</h1>
      
      {/* Simple Key */}
      <p>{t("home.subtitle")}</p>

      {/* Language Switcher */}
      <button onClick={() => changeLanguage(lang === "en" ? "ar" : "en")}>
        Switch to {lang === "en" ? "Arabic" : "English"}
      </button>
    </div>
  );
}
```

## 🧠 API Reference

### `useTranslation()` Hook

Returns the `TranslationContextValue` object:

| Property | Type | Description |
|----------|------|-------------|
| `t` | `(key, params?, module?) => string` | The main translation function. |
| `lang` | `string` | Current active language code (e.g., 'en'). |
| `changeLanguage` | `(lang: string) => Promise<void>` | Function to switch the active language. Updates everything instantly. |
| `isRTL` | `boolean` | `true` if the current language is in `config.RTL_LANGUAGES`. |
| `loading` | `boolean` | `true` while translations are being fetched or switched. |
| `availableLanguages` | `string[]` | List of codes from your config. |
| `languageNames` | `Record<string, string>` | Map of code to display name. |

### The `t` Function

The `t` function is very flexible:

**Signature:**
```typescript
t(key: string, params?: object | string, moduleName?: string | null): string
```

**Examples:**

1.  **Standard Key:**
    ```javascript
    t("common.welcome") // -> "Welcome"
    ```

2.  **Interpolation:**
    ```javascript
    // key: "Hello {name}"
    t("common.hello", { name: "Alice" }) // -> "Hello Alice"
    ```

3.  **Fallback Text:**
    If the second argument is a string, it is used as a fallback if the key isn't found.
    ```javascript
    t("missing.key", "Default Text") // -> "Default Text"
    ```

4.  **Target Specific Module:**
    If you are using sorted fetching (advanced), you can specify the module.
    ```javascript
    t("title", null, "home") // Looks for "title" inside the "home" module
    ```

## 🌐 Automatic RTL Support

When you switch to an RTL language (configured in `lt.config.js`), the library automatically:

1.  Updates `document.documentElement.dir` to `"rtl"`.
2.  Updates `document.documentElement.lang` to the new language code.

This makes integrating with CSS frameworks like Tailwind (using `rtl:` modifiers) or standard CSS almost effortless.

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Initial Load** | < 1ms (when cached) |
| **Language Switch** | < 10ms (instant DOM update) |
| **Bundle Size** | ~5KB (minified) |

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

## 📄 License

MIT © Hassool

Built with ❤️ for the React community.
