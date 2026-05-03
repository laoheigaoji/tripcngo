import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  schemaData?: object;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image = 'https://tripcngo.com/og-image.jpg', // Replace with real asset URL
  url = 'https://tripcngo.com', 
  type = 'website',
  schemaData
}) => {
  const { language } = useLanguage();
  
  const siteTitle = language === 'zh' ? 'tripcngo.com - 旅行中国出发' : 'tripcngo.com - Travel China, Let’s Go';
  const defaultDescription = language === 'zh' 
    ? '您的中国旅行终极指南。提供最新的免签政策、签证指引、交通攻略和目的地深度报告。' 
    : 'Your ultimate guide to traveling in China. Latest visa-free policies, visa guides, transportation tips, and destination reports.';
  
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={url} />
      
      {/* HTML Lang attribute update */}
      <html lang={language} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="tripcngo" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
