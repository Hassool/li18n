"use client";
import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { isBrowser, safeLocalStorage } from "../core/ssrSafe.js";

const TranslationContext = createContext();

export const TranslationProvider = ({ config, modules = [], sort = false, children }) => {
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [language, setLanguage] = useState(() => {
    const saved = safeLocalStorage.get("app_language");
    return saved || config.defaultLanguage || "en";
  });

  const [cache, setCache] = useState({});
  const isInitialMount = useRef(true);

  const apiEndpoint = useMemo(() => config.API_ENDPOINT, [config.API_ENDPOINT]);
  const localModules = useMemo(() => config.localModules, [config.localModules]);

  const rtlLanguages = ["ar", "he", "fa", "ur"];

  // Apply HTML language and direction
  useEffect(() => {
    if (!isBrowser) return;
    const isRTL = rtlLanguages.includes(language);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [language]);

  // Persist language selection
  useEffect(() => {
    safeLocalStorage.set("app_language", language);
  }, [language]);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      setError(null);

      const cacheKey = sort ? `${language}_sorted` : language;
      if (cache[cacheKey]) {
        setTranslations(cache[cacheKey]);
        setLoading(false);
        return;
      }

      try {
        if (sort) {
          const fetchPromises = modules.map(async (module) => {
            const endpoint = `${apiEndpoint}/${module}?lang=${language}`;
            try {
              const response = await fetch(endpoint);
              if (!response.ok) throw new Error(`Failed to fetch ${module}`);
              const data = await response.json();
              return { module, data };
            } catch (err) {
              console.warn(`Failed to fetch ${module}, using local fallback`);
              const fallback = localModules?.[module]?.[language];
              return { module, data: fallback || {} };
            }
          });

          const results = await Promise.all(fetchPromises);
          const combined = results.reduce((acc, { module, data }) => {
            acc[module] = data;
            return acc;
          }, {});
          setTranslations(combined);
          setCache((prev) => ({ ...prev, [cacheKey]: combined }));
        } else {
          const endpoint = `${apiEndpoint}?lang=${language}`;
          try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error("Failed to fetch translations");
            const data = await response.json();
            setTranslations(data);
            setCache((prev) => ({ ...prev, [cacheKey]: data }));
          } catch (err) {
            console.warn("Failed to fetch translations, using local fallback");
            const fallback = {};
            modules.forEach((module) => {
              const data = localModules?.[module]?.[language];
              if (data) fallback[module] = data;
            });
            setTranslations(fallback);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error("Translation fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
    isInitialMount.current = false;
  }, [language, apiEndpoint, modules, sort, localModules]);

  // Deep key access
  const t = (key, moduleName = null) => {
    const keys = key.split(".");
    let value = sort && moduleName ? translations[moduleName] : translations;
    for (const k of keys) {
      if (value && typeof value === "object") value = value[k];
      else return key;
    }
    return value || key;
  };

  const value = {
    translations,
    language,
    setLanguage,
    loading,
    error,
    t,
    isRTL: rtlLanguages.includes(language),
  };

  return (
    <TranslationContext.Provider value={value}>
      {loading ? (
        <div className="translation-loader">
          <div className="spinner" />
          <p>Loading translations...</p>
        </div>
      ) : (
        children
      )}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context)
    throw new Error("useTranslation must be used within TranslationProvider");
  return context;
};
