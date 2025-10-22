import { deepEqual, deepMerge } from "./utils.js";

/**
 * Builds the translation modules object
 * @param {Record<string, Record<string, object>>} translations
 */
export function buildModuleConfig(translations) {
  const modules = {};

  for (const [moduleName, langs] of Object.entries(translations)) {
    const config = { default: langs.en || {} };

    for (const [lang, data] of Object.entries(langs)) {
      if (lang === "en") continue;

      // Smart fallback merge: fill missing keys from English
      const merged = deepMerge(langs.en || {}, data);
      if (!deepEqual(langs.en, merged)) {
        config[lang] = merged;
      }
    }

    modules[moduleName] = config;
  }

  return modules;
}
