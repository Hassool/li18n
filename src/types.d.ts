export interface TranslationConfig {
  AVAILABLE_LANGUAGES: string[];
  DEFAULT_LANGUAGE: string;
  RTL_LANGUAGES: string[];
  ENABLE_CACHING: boolean;
  API_ENDPOINT?: string;
  LANGUAGE_NAMES?: Record<string, string>;
}

export function useTranslation(): {
  lang: string;
  t: (key: string, def?: string) => string;
  changeLanguage: (lang: string) => Promise<void>;
  isRTL: boolean;
  isLoading: boolean;
  availableLanguages: string[];
  languageNames: Record<string, string>;
};

export function TranslationProvider(props: {
  children: React.ReactNode;
  config: TranslationConfig;
  modules: Record<string, Record<string, any>>;
}): JSX.Element;
