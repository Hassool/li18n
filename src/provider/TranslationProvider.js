"use client";

import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { isBrowser, safeLocalStorage } from "../core/ssrSafe.js";

export const TranslationContext = createContext();

export function TranslationProvider({ children, config, modules }) {
  const [lang, setLang] = useState(config.DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cache, setCache] = useState({});

  const loadTranslations = useCallback(
    async (language, initial = false) => {
      if (initial) setIsInitialLoad(true);

      if (config.ENABLE_CACHING && cache[language]) {
        setTranslations(cache[language]);
        if (initial) setIsInitialLoad(false);
        return;
      }

      try {
        const res = await fetch(`${config.API_ENDPOINT}?lang=${language}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (config.ENABLE_CACHING)
          setCache((prev) => ({ ...prev, [language]: data }));
        setTranslations(data);
      } catch (err) {
        console.warn("Falling back to local modules:", err);
        const fallback = Object.keys(modules).reduce((acc, key) => {
          acc[key] = modules[key].default;
          return acc;
        }, {});
        setTranslations(fallback);
      } finally {
        if (initial) setIsInitialLoad(false);
      }
    },
    [cache]
  );

  const changeLanguage = useCallback(
    async (newLang) => {
      if (!config.AVAILABLE_LANGUAGES.includes(newLang))
        newLang = config.DEFAULT_LANGUAGE;
      if (newLang === lang) return;

      await loadTranslations(newLang);
      setLang(newLang);
      safeLocalStorage.set("lang", newLang);

      if (isBrowser) {
        document.documentElement.lang = newLang;
        const isRTL = config.RTL_LANGUAGES.includes(newLang);
        document.documentElement.dir = isRTL ? "rtl" : "ltr";
        document.documentElement.classList.toggle("rtl", isRTL);
      }
    },
    [lang, loadTranslations]
  );

  useEffect(() => {
    const storedLang =
      safeLocalStorage.get("lang") || config.DEFAULT_LANGUAGE;
    setLang(storedLang);

    if (isBrowser) {
      document.documentElement.lang = storedLang;
      const isRTL = config.RTL_LANGUAGES.includes(storedLang);
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
      document.documentElement.classList.toggle("rtl", isRTL);
    }

    loadTranslations(storedLang, true);
  }, [loadTranslations]);

  const t = useCallback(
    (key, def = key) => {
      const path = key.split(".");
      const getValue = (obj) =>
        path.reduce((acc, k) => (acc ? acc[k] : undefined), obj);
      return getValue(translations) ?? def;
    },
    [translations]
  );

  return (
    <TranslationContext.Provider
      value={{
        lang,
        t,
        changeLanguage,
        isRTL: config.RTL_LANGUAGES.includes(lang),
        availableLanguages: config.AVAILABLE_LANGUAGES,
        languageNames: config.LANGUAGE_NAMES,
        isLoading: isInitialLoad,
      }}
    >
      {isInitialLoad ? (
        <div className="translation-loader">
          <div className="spinner"></div>
          <p>Loading translations...</p>
        </div>
      ) : (
        children
      )}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx)
    throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}