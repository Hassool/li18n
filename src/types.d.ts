import React from 'react';

export interface TranslationConfig {
  AVAILABLE_LANGUAGES: string[];
  DEFAULT_LANGUAGE: string;
  RTL_LANGUAGES: string[];
  ENABLE_CACHING: boolean;
  API_ENDPOINT?: string;
  LANGUAGE_NAMES?: Record<string, string>;
  localModules?: Record<string, Record<string, any>>;
}

export interface TranslationContextValue {
  translations: Record<string, any>;
  lang: string;
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
  setLanguage: (lang: string) => Promise<void>; // deprecated but kept for compatibility
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  t: (key: string, params?: Record<string, any> | string, moduleName?: string | null) => string;
  isRTL: boolean;
  availableLanguages: string[];
  languageNames: Record<string, string>;
}

export function useTranslation(): TranslationContextValue;

export interface TranslationProviderProps {
  children: React.ReactNode;
  config: TranslationConfig;
  modules?: string[] | Record<string, any>;
  sort?: boolean;
}

export function TranslationProvider(props: TranslationProviderProps): JSX.Element;

export function buildModuleConfig(translations: Record<string, Record<string, object>>): Record<string, Record<string, any>>;

export function deepMerge(base: any, override: any): any;
export function deepEqual(a: any, b: any): boolean;
export function isObject(v: any): boolean;
