import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, Menu, X, CheckSquare, Compass, PlayCircle, BookOpen, Shield, ScanLine, Type, Calculator, Languages, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import Apps from '../pages/Apps';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.visa'), path: '/visa', hasDropdown: true },
    { name: t('nav.discover'), path: '/cities', hasDropdown: true },
    { name: t('nav.tools'), path: 'apps', hasDropdown: true },
    { name: t('nav.catalog'), path: '/apps' }
  ];

  const languages = [
    { code: 'zh', name: '简体中文', flag: 'CN' },
    { code: 'en', name: 'English', flag: 'EN' }
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#1a1a1a] shadow-md py-4 text-white' 
          : 'bg-transparent py-5 text-white'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="https://api.iconify.design/game-icons:mountains.svg?color=white" alt="Logo" className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-tight">tripcngo.com</span>
            <span className="text-[11px] text-gray-300 tracking-[0.1em] font-medium">{t('nav.slogan')}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium relative">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const isDiscover = item.name === t('nav.discover');
            const isVisa = item.name === t('nav.visa');
            const isTools = item.name === t('nav.tools');

            return (
              <div key={item.name} className="relative group/nav">
                {isTools ? (
                  <button 
                    className={`flex items-center gap-1 text-[15px] transition-colors hover:text-gray-300 py-2 cursor-pointer ${isActive ? 'text-green-400' : 'text-white'}`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                ) : (
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-1 text-[15px] transition-colors hover:text-gray-300 py-2 ${isActive ? 'text-green-400' : 'text-white'}`}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </Link>
                )}

                {/* Visa Mega Menu */}
                {isVisa && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[650px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                    opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                  `}>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                    
                    <div className="flex p-5 h-[320px]">
                      {/* Left Column: Teal Card */}
                      <div className="w-[300px] bg-[#1b887a] rounded-lg p-6 text-white flex flex-col justify-between flex-shrink-0">
                        <div>
                          <h3 className="text-lg font-medium mb-3">{t('visa.mega.title')}</h3>
                          <p className="text-[13px] leading-relaxed text-teal-50/90">
                            {t('visa.mega.desc')}
                          </p>
                        </div>
                        <div className="text-right mt-4">
                          <Link to="/visa" className="text-[13px] hover:text-white/80 transition-colors inline-flex items-center">
                            {t('visa.mega.view')} <span className="ml-1">→</span>
                          </Link>
                        </div>
                      </div>
                      
                      {/* Right Column: Links */}
                      <div className="flex-1 pl-10 py-2 flex flex-col justify-between">
                        <Link to="/visa/types" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.types')}</Link>
                        <Link to="/visa/photo" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.photo')}</Link>
                        <Link to="/visa/fees" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.fee')}</Link>
                        <Link to="/visa/form" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.form')}</Link>
                        <Link to="/visa/arrival-card" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.card')}</Link>
                        <Link to="/visa/downloads" className="text-[14px] font-medium text-gray-800 hover:text-[#1b887a] block">{t('visa.menu.download')}</Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Discover Mega Menu */}
                {isDiscover && (
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                    opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                  `}>
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                    
                    <div className="flex p-6">
                      {/* Left Column: Cities */}
                      <div className="w-1/2 pr-6 border-r border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-green-600 font-bold text-[15px]">{t('discover.hotCities')}</h3>
                          <Link to="/cities" className="text-green-600 text-[13px] hover:underline">{t('discover.moreCities')} &gt;&gt;</Link>
                        </div>
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[13px]">
                          <Link to="/cities/beijing" className="hover:text-green-600 truncate">{t('city.beijing')}(Beijing)</Link>
                          <Link to="/cities/shanghai" className="hover:text-green-600 truncate">{t('city.shanghai')}(Shanghai)</Link>
                          <Link to="/cities/guangzhou" className="hover:text-green-600 truncate">{t('city.guangzhou')}(Guangzhou)</Link>
                          <Link to="/cities/shenzhen" className="hover:text-green-600 truncate">{t('city.shenzhen')}(Shenzhen)</Link>
                          <Link to="/cities/hangzhou" className="hover:text-green-600 truncate">{t('city.hangzhou')}(Hangzhou)</Link>
                          <Link to="/cities/chongqing" className="hover:text-green-600 truncate">{t('city.chongqing')}(Chongqing)</Link>
                          <Link to="/cities/chengdu" className="hover:text-green-600 truncate">{t('city.chengdu')}(Chengdu)</Link>
                          <Link to="/cities/xian" className="hover:text-green-600 truncate">{t('city.xian')}(Xi'an)</Link>
                          <Link to="/cities/changsha" className="hover:text-green-600 truncate">{t('city.changsha')}(Changsha)</Link>
                          <Link to="/cities/xiamen" className="hover:text-green-600 truncate">{t('city.xiamen')}(Xiamen)</Link>
                        </div>
                      </div>
                      
                      {/* Right Column: Guides */}
                      <div className="w-1/2 pl-6 space-y-6">
                        <Link to="/articles" className="flex items-start gap-3 group">
                          <BookOpen className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{t('discover.guides')}</div>
                            <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{t('discover.guides.desc')}</div>
                          </div>
                        </Link>
                        <Link to="/guide" className="flex items-start gap-3 group">
                          <Compass className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{t('discover.pocket')}</div>
                            <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{t('discover.pocket.desc')}</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Tools Mega Menu */}
                {isTools && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[600px] bg-white rounded-lg shadow-xl border border-gray-100 text-gray-800 transition-all duration-200 transform origin-top z-50
                      opacity-0 invisible -translate-y-2 group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:translate-y-0
                    `}>
                        {/* Arrow pointing up */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-100 transform rotate-45 z-[-1]" />
                        
                        <div className="grid grid-cols-2 gap-6 p-6">
                            {[
                                { icon: ScanLine, title: t('tools.menu'), desc: t('tools.menu.desc'), path: '#' },
                                { icon: Shield, title: t('tools.name'), desc: t('tools.name.desc'), path: '/tools/name' },
                                { icon: Languages, title: t('tools.pinyin'), desc: t('tools.pinyin.desc'), path: '/tools/pinyin' },
                                { icon: Type, title: t('tools.counter'), desc: t('tools.counter.desc'), path: '/tools/counter' },
                                { icon: Calculator, title: t('tools.zodiac'), desc: t('tools.zodiac.desc'), path: '/tools/zodiac' }
                            ].map((tool, idx) => (
                                <Link key={idx} to={tool.path} className="flex gap-3 group" onClick={() => {}}>
                                    <tool.icon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-bold text-[14px] text-gray-900 group-hover:text-green-600 transition-colors">{tool.title}</div>
                                        <div className="text-[12px] text-gray-500 mt-1 leading-relaxed">{tool.desc}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Tools and Lang */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <div className="relative group/lang">
            <button 
              className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/20"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              <Globe className="w-4 h-4" />
              <span>{t('nav.lang.code')} {t('nav.lang')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 text-gray-800 transition-all duration-200 transform origin-top-right z-50
              ${isLangDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
            `}>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                  onClick={() => {
                    setLanguage(lang.code as 'zh' | 'en');
                    setIsLangDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-green-600" />}
                </button>
              ))}
            </div>

            {/* Click outside to close */}
            {isLangDropdownOpen && (
              <div 
                className="fixed inset-0 z-[-1]" 
                onClick={() => setIsLangDropdownOpen(false)}
              />
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <button 
            className="p-2 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mr-1"
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            title={language === 'zh' ? 'Switch to English' : '切换为中文'}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            className="p-2 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 z-50" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-[#1a1a1a] z-50 p-6 flex flex-col text-white h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">tripcngo.com</span>
                <span className="text-[10px] text-gray-400 tracking-wider -mt-1">{t('nav.slogan')}</span>
              </div>
              <button 
                className="p-2 hover:bg-white/10 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path}
                  className="text-2xl font-medium hover:text-green-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pt-8 flex items-center justify-between">
              <div className="flex gap-4">
                {languages.map((lang) => (
                   <button 
                    key={lang.code}
                    className={`px-4 py-2 rounded-full border flex items-center gap-2 ${language === lang.code ? 'bg-green-600 border-green-600' : 'bg-transparent border-white/20'}`}
                    onClick={() => {
                      setLanguage(lang.code as 'zh' | 'en');
                      setIsMobileMenuOpen(false);
                    }}
                   >
                     <Globe className="w-4 h-4" />
                     <span>{lang.name}</span>
                   </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

