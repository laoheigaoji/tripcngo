import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

// 完整的语言映射
const languageMap: Record<string, { hreflang: string; label: string; path: string }> = {
  zh: { hreflang: 'zh-CN', label: '简体中文', path: '/cn' },
  tw: { hreflang: 'zh-TW', label: '繁體中文', path: '/tw' },
  en: { hreflang: 'en', label: 'English', path: '/en' },
  ja: { hreflang: 'ja', label: '日本語', path: '/ja' },
  ko: { hreflang: 'ko', label: '한국어', path: '/ko' },
  ru: { hreflang: 'ru', label: 'Русский', path: '/ru' },
  fr: { hreflang: 'fr', label: 'Français', path: '/fr' },
  es: { hreflang: 'es', label: 'Español', path: '/es' },
  de: { hreflang: 'de', label: 'Deutsch', path: '/de' },
  it: { hreflang: 'it', label: 'Italiano', path: '/it' },
};

const BASE_URL = 'https://tripcngo.com';

interface SEOProps {
  title?: string;
  titleZh?: string;
  description?: string;
  descriptionZh?: string;
  keywords?: string;
  keywordsZh?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schemaData?: object;
  isHome?: boolean;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  titleZh,
  description, 
  descriptionZh,
  keywords, 
  keywordsZh,
  image = 'https://tripcngo.com/og-image.jpg',
  url = 'https://tripcngo.com', 
  type = 'website',
  schemaData,
  isHome = false
}) => {
  const { language } = useLanguage();
  
  const currentTitle = language === 'zh' ? titleZh : title;
  const siteTitleZh = '中国旅行指南 | tripcngo.com';
  const siteTitleEn = 'China Travel Guide | tripcngo.com';
  const siteTitle = language === 'zh' ? siteTitleZh : siteTitleEn;
  const suffixZh = '中国旅行指南';
  const suffixEn = 'China Travel Guide';
  const suffix = language === 'zh' ? suffixZh : suffixEn;
  
  const currentDescription = language === 'zh' ? descriptionZh : description;
  const defaultDescriptionZh = '您的中国旅行终极指南。提供最新的免签政策、签证指引、交通攻略和目的地深度报告。';
  const defaultDescriptionEn = 'Your ultimate guide to traveling in China. Latest visa-free policies, visa guides, transportation tips, and destination reports.';
  const metaDescription = currentDescription || (language === 'zh' ? defaultDescriptionZh : defaultDescriptionEn);
  
  const currentKeywords = language === 'zh' ? keywordsZh : keywords;
  const defaultKeywordsZh = '中国旅游, 免签中国, 144小时过境免签, 240小时过境免签, 中国签证, 中国城市, 中国旅行攻略, 中国入境指南';
  const defaultKeywordsEn = 'China travel, visa free China, 144h transit visa free, 240h transit visa, China visa, China cities, China travel guide, China entry guide';
  const metaKeywords = currentKeywords || (language === 'zh' ? defaultKeywordsZh : defaultKeywordsEn);
  
  const fullTitle = currentTitle ? `${currentTitle} | tripcngo.com | ${suffix}` : (isHome ? siteTitle : siteTitle);
  
  const hreflangTags = Object.entries(languageMap).map(([lang, config]) => ({
    lang: config.hreflang,
    href: `${BASE_URL}${config.path}${url.replace(BASE_URL, '')}`
  }));
  
  const ogLocale = languageMap[language]?.hreflang || 'zh-CN';
  const ogLocales = hreflangTags.map(t => t.lang).filter(l => l !== ogLocale);
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={url} />
      <html lang={language} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="tripcngo" />
      <meta property="og:locale" content={ogLocale} />
      {ogLocales.map(loc => (
        <meta key={loc} property="og:locale:alternate" content={loc} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      {hreflangTags.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en`} />
      {!schemaData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "tripcngo",
            "url": "https://tripcngo.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://tripcngo.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
