import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Visa from './pages/Visa';
import Cities from './pages/Cities';
import Apps from './pages/Apps';
import CityDetail from './pages/city/CityDetail';
import VisaTypes from './pages/visa/VisaTypes';
import VisaPhoto from './pages/visa/VisaPhoto';
import VisaArrivalCard from './pages/visa/VisaArrivalCard';
import VisaDownloads from './pages/visa/VisaDownloads';
import VisaForm from './pages/visa/VisaForm';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Guide from './pages/Guide';
import ZodiacCalculator from './pages/tools/ZodiacCalculator';
import CharacterCounter from './pages/tools/CharacterCounter';
import PinyinSegmentation from './pages/tools/PinyinSegmentation';
import NameGenerator from './pages/tools/NameGenerator';

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

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="visa" element={<Visa />} />
            <Route path="visa/types" element={<VisaTypes />} />
            <Route path="visa/photo" element={<VisaPhoto />} />
            <Route path="visa/arrival-card" element={<VisaArrivalCard />} />
            <Route path="visa/downloads" element={<VisaDownloads />} />
            <Route path="visa/form" element={<VisaForm />} />
            <Route path="guide" element={<Guide />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="tools/zodiac" element={<ZodiacCalculator />} />
            <Route path="tools/counter" element={<CharacterCounter />} />
            <Route path="tools/pinyin" element={<PinyinSegmentation />} />
            <Route path="tools/name" element={<NameGenerator />} />
            <Route path="cities" element={<Cities />} />
            <Route path="cities/:id" element={<CityDetail />} />
            <Route path="apps" element={<Apps />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}


