import { useLanguage } from '../context/LanguageContext';
import zhTranslations from '../locales/zh.json';
import enTranslations from '../locales/en.json';
import jaTranslations from '../locales/ja.json';
import koTranslations from '../locales/ko.json';
import ruTranslations from '../locales/ru.json';
import frTranslations from '../locales/fr.json';
import esTranslations from '../locales/es.json';
import deTranslations from '../locales/de.json';
import twTranslations from '../locales/tw.json';
import itTranslations from '../locales/it.json';

type TranslationKey = string;

const translations: Record<string, Record<TranslationKey, string>> = {
  zh: zhTranslations as any,
  en: enTranslations as any,
  ja: jaTranslations as any,
  ko: koTranslations as any,
  ru: ruTranslations as any,
  fr: frTranslations as any,
  es: esTranslations as any,
  de: deTranslations as any,
  tw: twTranslations as any,
  it: itTranslations as any,
};

// Supported languages in the app
const supportedLanguages = ['zh', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];

export function useVisaTranslation() {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    // Use the current language if supported, otherwise default to Chinese
    const lang = supportedLanguages.includes(language) ? language : 'zh';
    return translations[lang]?.[key as TranslationKey] || translations['zh']?.[key as TranslationKey] || key;
  };

  return { language, t };
}
