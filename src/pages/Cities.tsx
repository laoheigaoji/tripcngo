import React, { useState } from 'react';
import { Heart, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';

const ALL_CITIES = [
  // Page 1
  { id: 'haikou', name: '海口', pinyin: 'H A I K O U', img: 'https://static.tripcngo.com/ing/haikou.jpg', likes: 55, helpful: 1 },
  { id: 'fuzhou', name: '福州', pinyin: 'F U Z H O U', img: 'https://static.tripcngo.com/ing/fuzhou.jpg', likes: 3, helpful: 61 },
  { id: 'harbin', name: '哈尔滨', pinyin: 'H A E R B I N', img: 'https://static.tripcngo.com/ing/haerbin.jpg', likes: 0, helpful: 0 },
  { id: 'shenyang', name: '沈阳', pinyin: 'S H E N Y A N G', img: 'https://static.tripcngo.com/ing/shenyang.jpg', likes: 1, helpful: 1 },
  { id: 'wuhan', name: '武汉', pinyin: 'W U H A N', img: 'https://static.tripcngo.com/ing/wuhan.jpg', likes: 1, helpful: 1 },
  { id: 'shangrao', name: '上饶', pinyin: 'S H A N G R A O', img: 'https://static.tripcngo.com/ing/shangrao.jpg', likes: 2, helpful: 1 },
  { id: 'ningbo', name: '宁波', pinyin: 'N I N G B O', img: 'https://static.tripcngo.com/ing/ningbo.jpg', likes: 1, helpful: 1 },
  { id: 'zhengzhou', name: '郑州', pinyin: 'Z H E N G Z H O U', img: 'https://static.tripcngo.com/ing/zhengzhou.jpg', likes: 1, helpful: 0 },
  { id: 'guilin', name: '桂林', pinyin: 'G U I L I N', img: 'https://static.tripcngo.com/ing/guilin.jpg', likes: 0, helpful: 0 },
  // Page 2
  { id: 'qingdao', name: '青岛', pinyin: 'Q I N G D A O', img: 'https://static.tripcngo.com/ing/qingdao.jpg', likes: 0, helpful: 0 },
  { id: 'dali', name: '大理', pinyin: 'D A L I', img: 'https://static.tripcngo.com/ing/dali.jpg', likes: 0, helpful: 0 },
  { id: 'sanya', name: '三亚', pinyin: 'S A N Y A', img: 'https://static.tripcngo.com/ing/sanya.jpg', likes: 1, helpful: 0 },
  { id: 'zhangjiajie', name: '张家界', pinyin: 'Z H A N G J I A J I E', img: 'https://static.tripcngo.com/ing/zhangjiajie.jpg', likes: 0, helpful: 0 },
  { id: 'kunming', name: '昆明', pinyin: 'K U N M I N G', img: 'https://static.tripcngo.com/ing/kunming.jpg', likes: 0, helpful: 0 },
  { id: 'nanchang', name: '南昌', pinyin: 'N A N C H A N G', img: 'https://static.tripcngo.com/ing/nanchang.jpg', likes: 0, helpful: 0 },
  { id: 'tianjin', name: '天津', pinyin: 'T I A N J I N', img: 'https://static.tripcngo.com/ing/tianjin.jpg', likes: 0, helpful: 0 },
  { id: 'suzhou', name: '苏州', pinyin: 'S U Z H O U', img: 'https://static.tripcngo.com/ing/suzhou.jpg', likes: 0, helpful: 0 },
  { id: 'nanjing', name: '南京', pinyin: 'N A N J I N G', img: 'https://static.tripcngo.com/ing/nanjing.jpg', likes: 0, helpful: 0 },
  // Page 3
  { id: 'xiamen', name: '厦门', pinyin: 'X I A M E N', img: 'https://static.tripcngo.com/ing/xiamen.jpg', likes: 1, helpful: 0 },
  { id: 'changsha', name: '长沙', pinyin: 'C H A N G S H A', img: 'https://static.tripcngo.com/ing/changsha.jpg', likes: 1, helpful: 64 },
  { id: 'xian', name: '西安', pinyin: 'X I A N', img: 'https://static.tripcngo.com/ing/xian.jpg', likes: 0, helpful: 1 },
  { id: 'chengdu', name: '成都', pinyin: 'C H E N G D U', img: 'https://static.tripcngo.com/ing/chengdu.jpg', likes: 1, helpful: 2 },
  { id: 'chongqing', name: '重庆', pinyin: 'C H O N G Q I N G', img: 'https://static.tripcngo.com/ing/chongqing.jpg', likes: 0, helpful: 1 },
  { id: 'hangzhou', name: '杭州', pinyin: 'H A N G Z H O U', img: 'https://static.tripcngo.com/ing/hangzhou.jpg', likes: 3, helpful: 2 },
  { id: 'shenzhen', name: '深圳', pinyin: 'S H E N Z H E N', img: 'https://static.tripcngo.com/ing/shenzhen.jpg', likes: 0, helpful: 2 },
  { id: 'guangzhou', name: '广州', pinyin: 'G U A N G Z H O U', img: 'https://static.tripcngo.com/ing/guangzhou.jpg', likes: 6, helpful: 5 },
  { id: 'shanghai', name: '上海', pinyin: 'S H A N G H A I', img: 'https://static.tripcngo.com/ing/shanghai.jpg', likes: 2, helpful: 3 },
  // Page 4
  { id: 'beijing', name: '北京', pinyin: 'B E I J I N G', img: 'https://static.tripcngo.com/ing/beijing.jpg', likes: 6, helpful: 9 },
];

const ITEMS_PER_PAGE = 9;

export default function Cities() {
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ALL_CITIES.length / ITEMS_PER_PAGE);
  const currentCities = ALL_CITIES.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
      <SEO 
        title={language === 'zh' ? '热门城市指南' : 'Popular City Guides'}
        description={language === 'zh' 
          ? '探索中国最受欢迎的城市。了解北京、上海、广州等40多个城市的深度旅游攻略、餐饮推荐和实用技巧。' 
          : 'Explore the most popular cities in China. In-depth travel guides, food recommendations, and practical tips for over 40 cities including Beijing, Shanghai, and Guangzhou.'}
        keywords={language === 'zh' ? '中国城市指南, 北京旅游, 上海旅游, 广州旅游, 中国热门目的地' : 'China city guides, Beijing travel, Shanghai travel, Guangzhou travel, popular China destinations'}
      />
      <section className="relative h-[400px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/Fbanner_bg_2.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            {t('cities.hero.title')}
          </h1>
          <p className="text-white/95 text-base max-w-3xl drop-shadow-md">
            {t('cities.hero.desc')}
          </p>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-6 mt-12 bg-[#f5fff9] rounded border border-green-500 border-dashed p-8 mb-12">
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-bold text-green-600 inline-block">{t('cities.intro.title')}</h2>
        </div>
        <div className="space-y-4 text-[15px] text-gray-700 leading-[1.8]">
          <p>{t('cities.intro.p1')}</p>
          <p>{t('cities.intro.p2')}</p>
          <p>{t('cities.intro.p3')}</p>
          <p>{t('cities.intro.p4')}</p>
          <p>{t('cities.intro.p5')}</p>
          <p>{t('cities.intro.p6')}</p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCities.map((city) => (
             <Link to={`/cities/${city.id}`} key={city.id} className="relative group rounded-md overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 block">
                <div className="relative h-[240px] md:h-[260px] overflow-hidden cursor-pointer">
                  {/* Text Overlay for cities that might just use stock images */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 pointer-events-none">
                    <span className="text-white text-5xl md:text-6xl font-[STXingkai,cursive] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 mix-blend-overlay">{language === 'zh' ? city.name : city.id.charAt(0).toUpperCase() + city.id.slice(1)}</span>
                    <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.4em] uppercase drop-shadow-md mt-2 font-mono whitespace-nowrap">{city.pinyin}</span>
                  </div>
                  <img src={city.img} alt={city.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                  <div>
                    <span className="text-[15px] font-bold text-gray-900">{language === 'zh' ? city.name : city.id.charAt(0).toUpperCase() + city.id.slice(1)}</span>
                    <div className="text-[13px] text-gray-400 mt-0.5">{city.id.charAt(0).toUpperCase() + city.id.slice(1)}</div>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {city.likes} {t('city.stats.wantToVisit')}</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"><ThumbsUp className="w-3.5 h-3.5 text-green-500 fill-green-500" /> {city.helpful} {t('city.stats.recommended')}</span>
                  </div>
                </div>
              </Link>
          ))}
        </div>
        
        {/* Pagination mock */}
        <div className="flex justify-center mt-12 gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded text-sm flex items-center justify-center font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[#f5fff9] text-green-500 border border-green-500' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded text-sm flex items-center justify-center bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 font-medium font-serif disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ›
            </button>
        </div>
      </div>
      
      {/* Ad Section Mock */}
      <section className="py-12 mt-12 bg-white flex justify-center px-4 w-full">
        <div className="max-w-[728px] w-full border border-gray-200 shadow-sm bg-white relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-md">
          <div className="absolute top-0 right-0 p-1 flex gap-1 z-10">
            <span className="w-4 h-4 bg-blue-100 flex items-center justify-center text-[10px] text-blue-500 rounded-sm cursor-pointer">i</span>
            <span className="w-4 h-4 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded-sm cursor-pointer">x</span>
          </div>
          <div className="w-full sm:w-[300px] h-[150px] flex-shrink-0 relative overflow-hidden rounded-md">
             <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600" alt="Track" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between flex-1 py-1">
            <h3 className="text-xl sm:text-2xl font-normal text-gray-800 break-words pr-8">Spa 2026 Tickets</h3>
            <div className="flex justify-between items-center w-full mt-auto pt-4 gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-yellow-400 flex items-center justify-center border border-gray-200 overflow-hidden">
                   <div className="w-4 h-4 bg-black rounded-lg"></div>
                </div>
                <span className="text-gray-600 text-sm font-medium truncate">Global-Tickets</span>
              </div>
              <button className="bg-[#1a1a1a] hover:bg-black text-white px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-medium transition-colors text-sm flex-shrink-0">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
