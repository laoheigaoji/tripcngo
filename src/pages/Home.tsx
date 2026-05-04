import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, Heart, ThumbsUp, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FAQS = [
  { 
    q: "这240小时是从什么时候开始计算的?", 
    enQ: "When does the 240 hours start counting?",
    a: "240小时从入境当天的次日零时起计算，出境当天的24时止。例如：12月1日入境，则10天免签期限为12月2日0时至12月11日24时，必须在12月11日24时前出境。",
    enA: "The 240 hours are calculated from 00:00 on the day following the day of entry until 24:00 on the day of exit. For example, if entering on December 1st, the 10-day visa-free period is from 00:00 on December 2nd to 24:00 on December 11th."
  },
  { 
    q: "可以跨省旅游吗?", 
    enQ: "Can I travel across provinces?",
    a: "是的，可以在10天内在免签政策覆盖的省份内自由旅行。",
    enA: "Yes, you can travel freely within the provinces covered by the visa-free policy within 10 days."
  },
  { 
    q: "根据官方政策，我可以从香港进入大陆内地吗?", 
    enQ: "Can I enter mainland China from Hong Kong?",
    a: "不可以，根据政策规定，从香港、澳门、台湾地区入境的外国人不适用于240小时过境免签政策，您需要提前申请相应签证。",
    enA: "No, according to official policy, foreigners entering from Hong Kong, Macau, or Taiwan regions are not eligible for the 240-hour transit visa-free policy and must apply for the appropriate visa in advance."
  },
  { 
    q: "可否入境后再购买出境机票？", 
    enQ: "Can I purchase an outbound ticket after entry?",
    a: "不可以，必须提前持有确定日期和座位的联程票。",
    enA: "No, you must hold confirmed connecting tickets with specific dates and seats in advance."
  },
  { 
    q: "从广州入境上海出境是否允许？", 
    enQ: "Is it allowed to enter in Guangzhou and exit from Shanghai?",
    a: "允许，支持不同口岸出入境。",
    enA: "Yes, different ports of entry and exit are supported."
  },
  { 
    q: "如何办理临时入境许可？", 
    enQ: "How to apply for a temporary entry permit?",
    a: "在指定口岸（如北京首都机场T3航站楼）设有专门柜台，需现场填写《临时入境外国人入境卡》，提交护照+联程机票，经边检审核后发放许可。",
    enA: "Special counters are available at designated ports (e.g., Beijing Capital Airport Terminal 3). You need to fill out the Temporary Entry Card for Foreigners on-site, submit your passport and connecting flight ticket, and the permit will be issued after border inspection approval."
  },
  { 
    q: "从香港/澳门转机是否适用？", 
    enQ: "Is transit via Hong Kong/Macau allowed?",
    a: "允许。例如美国→广州→香港西九龙，凭高铁票可申请免签；加拿大→珠海→澳门，凭船票同样适用。",
    enA: "Yes. For example, USA→Guangzhou→Hong Kong West Kowloon with a high-speed rail ticket is eligible; Canada→Zhuhai→Macau with a ferry ticket is also applicable."
  },
  { 
    q: "联程票可否包含陆路交通？", 
    enQ: "Can connecting tickets include land transportation?",
    a: "允许。如持有广州→香港高铁票、珠海→澳门船票等跨境陆海空联运票据均符合要求。",
    enA: "Yes. Cross-border combined transport tickets such as Guangzhou→Hong Kong high-speed rail tickets and Zhuhai→Macau ferry tickets are acceptable."
  },
  { 
    q: "证件丢失怎么办？", 
    enQ: "What if I lose my documents?",
    a: "立即向停留地公安机关报案，凭《护照报失证明》到出入境管理部门申请停留证件，同时联系本国使领馆补办旅行证件。",
    enA: "Report to the local public security bureau immediately. Apply for a stay permit at the exit-entry administration with the Passport Loss Certificate, and contact your country's embassy or consulate to apply for a new travel document."
  },
  { 
    q: "与互免签证如何选择？", 
    enQ: "How to choose between visa-free and transit visa-free?",
    a: "如属新加坡等互免国公民，建议直接使用30天免签（更灵活）；若仅过境则选240小时免签（无需签证费）。",
    enA: "If you are a citizen of visa-free countries like Singapore, it is recommended to use the 30-day visa-free entry (more flexible); if only transiting, choose the 240-hour transit visa-free (no visa fee required)."
  }
];

export default function Home() {
  const { t, language } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [guides, setGuides] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
           id: doc.id,
           img: doc.data().thumbnail || '',
           title: doc.data().title || '',
           enTitle: doc.data().titleEn || '',
           desc: doc.data().subtitle || '',
           enDesc: doc.data().subtitleEn || '',
           views: doc.data().views || undefined
        }));
        setGuides(data);
      } catch (err) {
        console.error("Error fetching latest guides", err);
      }
    };
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cities'));
        const data = snapshot.docs.map(doc => ({
           ...(doc.data() as any),
           id: doc.id
        }));
        setCities(data);
      } catch (err) {
        console.error("Error fetching cities", err);
      }
    };
    fetchGuides();
    fetchCities();
  }, []);

  const handleSearch = () => {
    const city = cities.find(c => 
      c.name.includes(searchTerm.trim()) || 
      (c.enName && c.enName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    );
    if (city) {
      navigate(`/cities/${city.id}`);
    }
  };

  const filteredCities = searchTerm.trim() 
    ? cities.filter(c => 
        c.name.includes(searchTerm.trim()) || 
        (c.enName && c.enName.toLowerCase().includes(searchTerm.trim().toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="w-full bg-[#f7f7f7]">
      <SEO 
        isHome={true}
        description={language === 'zh' 
          ? 'tripcngo.com 是您的中国旅行终极指南。探索最新的144小时过境免签政策、寻找热门城市攻略及实用的中国旅行工具。' 
          : 'tripcngo.com is your ultimate guide to traveling in China. Explore the latest 144-hour transit visa-free policies, top city guides, and practical travel tools.'}
        keywords={language === 'zh' ? '中国旅游, 免签中国, 144小时过境免签, 中国旅行攻略, 中国城市指南' : 'China travel, visa free China, 144h transit visa free, China travel guide, Chinese cities'}
      />
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex px-6 pb-20 pt-32">
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            src="https://static.tripcngo.com/video/12121.mp4"
            poster="https://static.tripcngo.com/ing/image1.webp"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col justify-end items-center">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg"
            >
              {t('hero.ultimate')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md"
            >
              {t('hero.desc')}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-[800px] backdrop-blur-xl bg-white/20 p-2 rounded-[2rem] shadow-2xl border border-white/30 relative"
          >
            <div className="flex gap-2 p-1 mb-1">
              <button className="px-6 py-2.5 rounded-full text-[15px] font-bold bg-white text-[#1b887a] shadow-sm">
                {t('hero.dest')}
              </button>
              <button 
                onClick={() => navigate('/tools/name')}
                className="px-6 py-2.5 rounded-full text-[15px] font-bold text-white hover:bg-white/10 transition-colors"
              >
                {t('hero.aiName')}
              </button>
            </div>
            
            <div className="bg-white rounded-[1.5rem] p-1.5 flex items-center relative group">
              <div className="flex-1 flex items-center px-4">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder={t('hero.searchPlaceholder')} 
                  className="w-full py-3.5 outline-none text-gray-800 text-[16px]"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#1b887a] hover:bg-[#008055] text-white px-8 py-3.5 rounded-[1.2rem] font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md flex-shrink-0"
              >
                {t('hero.start')}
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Search Suggestions Dropdown */}
            {isSearchFocused && searchTerm.trim() && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute left-0 right-0 bottom-[calc(100%+12px)] bg-white rounded-2xl shadow-2xl overflow-hidden z-[50] border border-gray-100"
              >
                {filteredCities.length > 0 ? (
                  <div className="p-2">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => navigate(`/cities/${city.id}`)}
                        className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img 
                            src={city.heroImage || 'https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=100&q=80&auto=format&fit=crop'} 
                            alt={city.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-base">{city.name}</div>
                          <div className="text-sm text-gray-500">{city.enName} {city.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 font-medium">
                    {language === 'zh' ? '未找到相关城市' : 'No matching cities found'}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 240 hours Visa Free Section */}
      <section className="py-24 max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <img src="https://static.tripcngo.com/ing/image.png" alt="Visa Free Policy" className="w-full h-auto object-contain" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{t('visa.section.title')}</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {t('visa.section.desc')}
            </p>
            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
               <div>
                  <div className="font-black text-4xl text-[#1b887a] mb-2">{t('visa.stat.countries')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.countries.desc')}<ChevronRight className="w-4 h-4 text-[#1b887a]"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-[#1b887a] mb-2">{t('visa.stat.stay')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.stay.desc')}<ChevronRight className="w-4 h-4 text-[#1b887a]"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-gray-900 mb-2">{t('visa.stat.provinces')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.provinces.desc')}<ChevronRight className="w-4 h-4 text-gray-900"/></div>
               </div>
               <div>
                  <div className="font-black text-4xl text-gray-900 mb-2">{t('visa.stat.ports')}</div>
                  <div className="text-gray-500 font-medium flex items-center gap-2">{t('visa.stat.ports.desc')}<ChevronRight className="w-4 h-4 text-gray-900"/></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center justify-center mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('home.cities.title')}</h2>
            <button className="text-[#1b887a] text-sm font-medium hover:underline" onClick={() => navigate('/cities')}>
               {t('home.cities.more')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.slice(0, 6).map((city) => (
              <div 
                key={city.id} 
                className="relative group rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/cities/${city.id}`)}
              >
                <div className="relative h-[240px] md:h-[260px]">
                  <img src={city.heroImage || city.img} alt={language === 'zh' ? city.name : city.enName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                  <div>
                    <span className="text-[15px] font-bold text-gray-900">{language === 'zh' ? city.name : city.enName}</span>
                    <span className="ml-2 text-xs text-gray-500 font-medium uppercase tracking-wider">{city.enName}</span>
                  </div>
                  <div className="flex gap-3 text-gray-500">
                    <span className="flex items-center gap-1 text-xs font-medium"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {city.likes || 0}</span>
                    <span className="flex items-center gap-1 text-xs font-medium"><ThumbsUp className="w-3.5 h-3.5 text-[#1b887a] fill-[#1b887a]" /> {city.helpful || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wandering Guides */}
      <section className="py-20 max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{t('home.guides.title')}</h2>
          <button className="text-[#1b887a] text-sm font-medium hover:underline" onClick={() => navigate('/guide')}>
             {t('home.guides.more')}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
          {guides.map((guide, i) => (
             <div key={i} className="flex flex-col sm:flex-row gap-5 bg-transparent cursor-pointer group" onClick={() => navigate(`/articles/${guide.id}`)}>
               <div className="w-full sm:w-[200px] h-[140px] overflow-hidden rounded-md flex-shrink-0 shadow-sm border border-gray-200">
                  <img src={guide.img} alt={language === 'zh' ? guide.title : guide.enTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="flex flex-col py-1">
                 <h3 className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[#1b887a] transition-colors mb-2 line-clamp-2">
                    {language === 'zh' ? guide.title : guide.enTitle}
                 </h3>
                 <p className="text-gray-500 text-[13px] line-clamp-3 mb-3 leading-relaxed">
                   {language === 'zh' ? guide.desc : guide.enDesc}
                 </p>
                 {guide.views !== undefined && (
                   <div className="mt-auto text-xs flex items-center gap-1">
                     <ThumbsUp className="w-3.5 h-3.5 text-red-500 shrink-0" />
                     <span className="text-red-500 font-medium">{guide.views}</span>
                     <span className="text-gray-500">{t('home.guides.helpful')}</span>
                   </div>
                 )}
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#f7f7f7]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('home.faq.title')}</h2>
          <p className="text-gray-500 text-center mb-10">{t('home.faq.subtitle')}</p>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-md overflow-hidden shadow-sm border border-gray-100 cursor-pointer" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                <div className="px-6 py-5 flex justify-between items-center text-gray-900 font-bold hover:bg-gray-50 transition-colors border-b border-gray-100/50">
                  <div className="flex gap-4">
                    <span className="text-[#1b887a]">{i + 1}.</span>
                    <span>{language === 'zh' ? faq.q : faq.enQ}</span>
                  </div>
                  {openFAQ === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                {openFAQ === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="px-12 py-5 bg-white text-gray-600 leading-relaxed border-t border-gray-50">
                      {language === 'zh' ? faq.a : faq.enA}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
