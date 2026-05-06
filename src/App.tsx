import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation, useParams } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Visa from './pages/Visa';
import Cities from './pages/Cities';
import Apps from './pages/Apps';
import CityDetail from './pages/city/CityDetail';
import VisaTypes from './pages/visa/VisaTypes';
import VisaPhoto from './pages/visa/VisaPhoto';
import VisaFees from './pages/visa/VisaFees';
import VisaArrivalCard from './pages/visa/VisaArrivalCard';
import VisaDownloads from './pages/visa/VisaDownloads';
import VisaForm from './pages/visa/VisaForm';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Guide from './pages/Guide';
import Feedback from './pages/Feedback';
import GuideList from './pages/guide/GuideList';
import GuideDetail from './pages/guide/GuideDetail';
import Admin from './pages/Admin';
import Migration from './pages/Migration';
import ZodiacCalculator from './pages/tools/ZodiacCalculator';
import CharacterCounter from './pages/tools/CharacterCounter';
import PinyinSegmentation from './pages/tools/PinyinSegmentation';
import NameGenerator from './pages/tools/NameGenerator';
import MenuTranslator from './pages/tools/MenuTranslator';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f7f7f7] text-gray-800">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootRedirect() {
  const { language } = useLanguage();
  const location = useLocation();
  const langPrefixMap: Record<string, string> = {
    zh: 'cn',
    tw: 'tw',
    en: 'en',
    ja: 'ja',
    ko: 'ko',
    ru: 'ru',
    fr: 'fr',
    es: 'es',
    de: 'de',
    it: 'it'
  };
  const langPrefix = langPrefixMap[language] || 'en';
  
  // Prevent redirect loop if mounted on root
  const targetPath = location.pathname === '/' ? `/${langPrefix}` : `/${langPrefix}${location.pathname}`;
  return <Navigate to={targetPath + location.search} replace />;
}

function LangRoute() {
  const { langParam } = useParams();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    const langMap: Record<string, string> = {
      cn: 'zh',
      tw: 'tw',
      en: 'en',
      ja: 'ja',
      ko: 'ko',
      ru: 'ru',
      fr: 'fr',
      es: 'es',
      de: 'de',
      it: 'it'
    };
    const targetLang = langMap[langParam || ''] || 'en';
    // 只从 URL 同步到 Context，不依赖 Context 状态以避免竞态
    setLanguage(targetLang as any);
  }, [langParam, setLanguage]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="visa" element={<Visa />} />
        <Route path="visa/types" element={<VisaTypes />} />
        <Route path="visa/photo" element={<VisaPhoto />} />
        <Route path="visa/fees" element={<VisaFees />} />
        <Route path="visa/arrival-card" element={<VisaArrivalCard />} />
        <Route path="visa/downloads" element={<VisaDownloads />} />
        <Route path="visa/form" element={<VisaForm />} />
        <Route path="guide" element={<Guide />} />
        <Route path="articles" element={<GuideList />} />
        <Route path="articles/:id" element={<GuideDetail />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="tools/zodiac" element={<ZodiacCalculator />} />
        <Route path="tools/counter" element={<CharacterCounter />} />
        <Route path="tools/pinyin" element={<PinyinSegmentation />} />
        <Route path="tools/name" element={<NameGenerator />} />
        <Route path="tools/menu" element={<MenuTranslator />} />
        <Route path="cities" element={<Cities />} />
        <Route path="cities/:id" element={<CityDetail />} />
        <Route path="apps" element={<Apps />} />
      </Route>
    </Routes>
  );
}

function LangRouteWrapper() {
  const { langParam } = useParams();
  const validPrefixes = ['cn', 'tw', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'it'];
  if (!langParam || !validPrefixes.includes(langParam)) {
      return <RootRedirect />;
  }
  return <LangRoute />;
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/migration" element={<Migration />} />
          <Route path="/:langParam/*" element={<LangRouteWrapper />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}


