import React from 'react';
import { Twitter, Mail, Youtube, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-[#0e7552] text-[#e5f5ef] text-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 md:gap-x-10 gap-y-12">
          {/* Brand & Social - Always top or left */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="text-white text-[15px] md:text-[18px] font-bold mb-4">{t('footer.brand.title')}</h4>
            <p className="mb-6 leading-relaxed text-[#e5f5ef] text-[13px] md:text-[14px] md:pr-10">
              {t('footer.brand.desc')}
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex gap-5">
                <a href="https://x.com/1546912750" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Follow us on X">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.048H5.039z"></path></svg>
                </a>
                <a href="mailto:contact@tripcngo.com" className="hover:text-white transition-colors" title="Email us">
                  <Mail className="w-6 h-6" />
                </a>
                <a href="https://www.youtube.com/@%E5%8D%A1%E8%A7%86%E7%BD%91%E7%BB%9C" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/profile.php?id=100004264274335" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
              <div className="flex items-center gap-2 text-[#e5f5ef]/70">
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@tripcngo.com" className="hover:text-white transition-colors font-medium">contact@tripcngo.com</a>
              </div>
            </div>
          </div>
          
          {/* Link Sections - Grid on mobile */}
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.visa')}</h4>
            <ul className="space-y-4">
              <li><Link to="/visa" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.all')}</Link></li>
              <li><Link to="/cities" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.dest')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef]">{t('footer.links.visa.nav')}</a></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px] md:text-[16px]">{t('footer.links.company')}</h4>
            <ul className="space-y-4">
                <li><Link to="/about" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.about')}</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.terms')}</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.privacy')}</Link></li>
                <li><Link to="/feedback" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{t('footer.links.feedback')}</Link></li>
            </ul>
          </div>
 
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.lang')}</h4>
            <ul className="space-y-4">
              {['English', '简体中文', '繁体中文'].map(link => (
                <li key={link}>
                  <button className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{link}</button>
                </li>
              ))}
            </ul>
          </div>
 
          <div className="col-span-1">
            <h4 className="text-white font-bold mb-6 text-[15px]">{t('footer.links.partners')}</h4>
            <ul className="space-y-4">
              {['ReadMenuAI', 'ScriptMind'].map(link => (
                <li key={link}>
                  <a href="#" className="hover:text-white transition-colors text-[13px] text-[#e5f5ef] font-medium">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="py-8 text-center text-[#e5f5ef]/80 text-[13px] border-t border-white/10 mx-6">
        <p>Copyright © {new Date().getFullYear()} tripcngo.com All Rights Reserved.</p>
      </div>
    </footer>
  );
}
