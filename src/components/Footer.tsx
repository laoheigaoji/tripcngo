import React from 'react';
import { Twitter, Mail, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-[#0e7552] text-[#e5f5ef] text-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white text-[15px] font-bold mb-4">{t('footer.brand.title')}</h4>
            <p className="mb-6 leading-relaxed text-[#e5f5ef] text-[13px] pr-8">
              {t('footer.brand.desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.048H5.039z"></path></svg></a>
              <a href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors">
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512"><path d="M448 209.9a210.1 210.1 0 0 1 -122.8 -39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.visa')}</h4>
            <ul className="space-y-4">
              <li><Link to="/visa" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.all')}</Link></li>
              <li><Link to="/cities" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.dest')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.nav')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.company')}</h4>
            <ul className="space-y-4">
                <li><Link to="/about" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.about')}</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.terms')}</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.privacy')}</Link></li>
                <li><a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.feedback')}</a></li>
            </ul>
          </div>
 
          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.lang')}</h4>
            <ul className="space-y-4">
              {['English', '简体中文'].map(link => (
                <li key={link}>
                  <button className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{link}</button>
                </li>
              ))}
            </ul>
          </div>
 
          <div>
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.partners')}</h4>
            <ul className="space-y-4">
              {['ReadMenuAI', 'ScriptMind'].map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-[#e5f5ef] text-[13px]">
        <p>Copyright © {new Date().getFullYear()} tripcngo.com All Rights Reserved.</p>
      </div>
    </footer>
  );
}
