import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, Heart, ThumbsUp, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CITIES = [
  { id: 'haikou', name: '海口', enName: 'Haikou', pinyin: 'H A I K O U', img: 'https://static.tripcngo.com/ing/haikou.jpg', likes: 55, helpful: 1 },
  { id: 'fuzhou', name: '福州', enName: 'Fuzhou', pinyin: 'F U Z H O U', img: 'https://static.tripcngo.com/ing/fuzhou.jpg', likes: 3, helpful: 61 },
  { id: 'harbin', name: '哈尔滨', enName: 'Harbin', pinyin: 'H A E R B I N', img: 'https://static.tripcngo.com/ing/haerbin.jpg', likes: 0, helpful: 0 },
  { id: 'shenyang', name: '沈阳', enName: 'Shenyang', pinyin: 'S H E N Y A N G', img: 'https://static.tripcngo.com/ing/shengyang.jpg', likes: 1, helpful: 1 },
  { id: 'wuhan', name: '武汉', enName: 'Wuhan', pinyin: 'W U H A N', img: 'https://static.tripcngo.com/ing/wuhan.jpg', likes: 1, helpful: 1 },
  { id: 'shangrao', name: '上饶', enName: 'Shangrao', pinyin: 'S H A N G R A O', img: 'https://static.tripcngo.com/ing/shangrao.jpg', likes: 2, helpful: 1 },
];

const GUIDES = [
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-1.webp', 
    title: '中国早餐完全指南：独一无二的早餐文化', 
    enTitle: 'Ultimate China Breakfast Guide: A Unique Culture',
    desc: '在中国，早餐不只是一餐饭，它是一种生活的哲学。清晨的热干面、滚烫的豆浆、蒸腾的小笼包——这些热气腾腾的食物里，藏着敬时间、爱生活的态度。广州人慢悠悠叹茶，武汉人急匆匆过早，北方吃面，南方喝粥。这篇...', 
    enDesc: 'Breakfast in China is more than a meal; it is a philosophy. From hot noodles to steaming buns, explore the diverse culture of Chinese breakfast...',
    views: 2 
  },
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-2.webp', 
    title: '中国Top 10街头美食：尝遍地道小吃，舌尖上的中国', 
    enTitle: 'China Top 10 Street Food: Taste Authentic Snacks',
    desc: '深度解析煎饼果子、肉夹馍、臭豆腐等十大国民小吃。涵盖南北地域特色、价格参考及卫生挑选技巧，让你大胆尝试，不用担心踩雷。', 
    enDesc: 'In-depth analysis of high-profile snacks like Jianbing and Roujiamo. Covering regional specialties, pricing, and tips for safe street food...',
    views: undefined 
  },
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-3.webp', 
    title: '中国火锅完全指南：千年美食文化的沸腾之旅', 
    enTitle: 'Complete Chinese Hotpot Guide: A Boiling Journey',
    desc: '在中国怎么吃火锅？本文为您详解川渝麻辣、老北京铜锅、潮汕牛肉等六大流派对比。包含健康下锅顺序、海底捞/巴奴等品牌及生熟分开等安全提醒，带您找回最正宗的中国味。', 
    enDesc: 'How to eat hotpot in China? Detailed comparison of major styles and safety tips to find the most authentic taste...',
    views: undefined 
  },
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-4.webp', 
    title: '中国上饶深度游攻略：从望仙谷到三清山，探索江西隐藏的仙境', 
    enTitle: 'Shangrao Deep Travel Guide: Exploring Jiangxi\'s Hidden Fairyland',
    desc: '上饶，这座江西的隐秘仙境，拥有令人心驰神往的自然美景和深厚的文化底蕴。本文将带您深入探索望仙谷和三清山的绝美风光，感受江西隐藏的仙境之旅。', 
    enDesc: 'Explore the stunning landscapes of Wangxiangu and Mount Sanqing in Shangrao, Jiangxi...',
    views: undefined 
  },
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-5.webp', 
    title: '中国复姓大盘点：探探秘十大顶级复姓的起源和故事', 
    enTitle: 'Chinese Compound Surnames: Origin & Stories of Top 10 Surnames',
    desc: '中国不仅有百家姓，更有底蕴深厚的复姓文化。本文深度解读欧阳、诸葛、上官、司马等十大顶级复姓的起源故事、历史名人及文化内涵。', 
    enDesc: 'Unlock the historical stories and cultural significance behind famous compound surnames like Ouyang and Zhuge...',
    views: 2 
  },
  { 
    img: 'https://static.tripcngo.com/ing/Fcover-6.jpg', 
    title: '中国孩子取名趋势大盘点', 
    enTitle: 'Chinese Baby Naming Trends: Modern vs Traditional',
    desc: '揭秘中国名字的时代变迁。了解中国父母的命名趋势，如何从古籍中为孩子取一个好中文名字。', 
    enDesc: 'Discover how modern Chinese parents choose names and the trends shifting from simple to more classical influences...',
    views: 77 
  },
];

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
  },
  { 
    q: "超期停留会怎样？", 
    enQ: "What happens if I overstay?",
    a: "每日处罚款500元，最高可处10日拘留并限期离境，且5年内不得申请过境免签。",
    enA: "A fine of 500 RMB per day, up to 10 days detention and deportation, and ineligibility for transit visa-free for 5 years."
  },
  { 
    q: "如何查询实时政策？", 
    enQ: "How to check real-time policies?",
    a: "微信搜索\"国家移民管理局\"小程序，或拨打12367热线（支持英/日/韩等8语种服务）。",
    enA: "Search for \"National Immigration Administration\" mini-program on WeChat, or call the 12367 hotline (supports 8 languages including English, Japanese, Korean)."
  },
  { 
    q: "哪些行为会被视为非法就业？", 
    enQ: "What activities are considered illegal employment?",
    a: "包括商业拍摄、网络直播获利、临时授课等，即使未签订劳动合同也可能被认定违法。",
    enA: "Includes commercial filming, live streaming for profit, temporary teaching, etc. Even without a labor contract, these activities may be considered illegal."
  },
  { 
    q: "北京首都机场办理流程有何特殊安排？", 
    enQ: "What special arrangements exist at Beijing Capital Airport?",
    a: "T3航站楼设立\"过境免签快速通道\"，配备英/日/韩三语服务专员，办理时间缩短至15分钟内。需注意每日22:00-6:00时段需前往24小时应急窗口办理。",
    enA: "Terminal 3 has a 'Transit Visa-Free Express Lane' with English/Japanese/Korean speaking staff, reducing processing time to under 15 minutes. Note: between 22:00-06:00 daily, you must go to the 24-hour emergency window."
  },
  { 
    q: "上海浦东机场转机如何衔接？", 
    enQ: "How to connect at Shanghai Pudong Airport?",
    a: "提供\"空铁联运\"服务，持高铁票可在卫星厅直接办理过境手续。例如：巴黎→上海→杭州东站的高铁联程票，可在隔离区内完成所有手续。",
    enA: "Air-rail intermodal service is available. You can complete transit procedures directly at the satellite hall with a high-speed rail ticket. For example: Paris→Shanghai→Hangzhou East Station can be processed entirely within the transit area."
  },
  { 
    q: "摄影爱好者有哪些限制？", 
    enQ: "What restrictions apply to photography enthusiasts?",
    a: "商业拍摄需申请工作签证，但个人旅游拍摄允许。禁飞区（如军事设施周边500米）严禁无人机航拍，违者最高罚款2万元。",
    enA: "Commercial filming requires a work visa, but personal travel photography is permitted. Drone flights are strictly prohibited in no-fly zones (e.g., within 500 meters of military facilities), with a maximum fine of 20,000 RMB for violations."
  },
  { 
    q: "联程票改签如何处理？", 
    enQ: "How to handle ticket changes?",
    a: "允许免费改签1次，需在停留期第7天前完成。例如原定D10香港航班改签至D11，需在D7前持新机票到入境口岸边检站备案。",
    enA: "One free change is allowed, which must be completed before day 7 of your stay. For example, if changing a D10 Hong Kong flight to D11, you must register the new ticket at the entry port's border inspection station before D7."
  },
  { 
    q: "跨境高铁票是否认可？", 
    enQ: "Are cross-border high-speed rail tickets accepted?",
    a: "中老铁路（昆明→万象）、中越铁路（南宁→河内）等国际班次车票均被认可，需提供纸质票与电子客票号双验证。",
    enA: "International train tickets such as China-Laos Railway (Kunming→Vientiane) and China-Vietnam Railway (Nanning→Hanoi) are accepted. Both paper tickets and electronic ticket numbers are required for verification."
  },
  { 
    q: "如何通过微信办理预审？", 
    enQ: "How to apply for pre-approval via WeChat?",
    a: "在\"移民局\"小程序提交护照首页+电子机票，AI系统10分钟生成《过境预审码》，可减少口岸办理时间50%。",
    enA: "Submit your passport photo page + electronic ticket through the 'Immigration Bureau' mini-program. The AI system generates a Transit Pre-approval Code within 10 minutes, reducing port processing time by 50%."
  },
  { 
    q: "哪些行为可能引发误会？", 
    enQ: "What behaviors may cause misunderstandings?",
    a: "避免在政府机关门前比\"V\"手势拍照、未经许可拍摄少数民族服饰者。宗教场所需注意着装要求（如寺庙不穿短裤入内）。",
    enA: "Avoid making 'V' gestures for photos in front of government buildings and photographing people in ethnic minority costumes without permission. Dress appropriately at religious sites (e.g., no shorts in temples)."
  },
  { 
    q: "突发疾病如何就医？", 
    enQ: "What to do in case of a medical emergency?",
    a: "持护照可在二级以上医院挂急诊，推荐北京协和/上海瑞金等53家涉外医院。保留医疗票据可申请停留延期。",
    enA: "You can seek emergency treatment at hospitals above Level 2 with your passport. 53 foreign-related hospitals like Peking Union Medical College Hospital and Shanghai Ruijin Hospital are recommended. Keep medical receipts for possible stay extension applications."
  },
  { 
    q: "突发疾病如何延期？", 
    enQ: "How to apply for an extension due to medical emergency?",
    a: "需提供医院诊断证明，在停留期满前3个工作日向所在地市级公安局出入境管理处申请，最长可延期30天。",
    enA: "Provide a hospital diagnosis certificate and apply to the municipal exit-entry administration 3 working days before your stay expires. The maximum extension is 30 days."
  },
];

export default function Home() {
  const { language, t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const city = CITIES.find(c => c.name.includes(searchTerm) || c.enName.toLowerCase().includes(searchTerm.toLowerCase()));
    if (city) {
      navigate(`/cities/${city.id}`);
    } else {
      alert(language === 'zh' ? '未找到该城市' : 'City not found');
    }
  };

  return (
    <div className="w-full bg-[#f7f7f7]">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20">
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
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white tracking-widest mb-6"
          >
            {t('hero.ultimate')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 mb-12 font-medium"
          >
            {t('hero.desc')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full max-w-[640px] mx-auto bg-white rounded-lg overflow-hidden shadow-2xl"
          >
            <div className="flex border-b border-gray-100 bg-gray-50">
              <button className="flex-1 py-3 text-sm font-medium bg-white text-gray-900 border-none outline-none">{t('hero.dest')}</button>
              <button 
                onClick={() => navigate('/tools/name')}
                className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 border-none outline-none transition-colors">{t('hero.aiName')}</button>
            </div>
            <div className="px-2 py-2.5 flex items-center justify-between">
              <div className="flex-1 flex items-center pl-4 pr-2">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')} 
                  className="flex-1 px-3 py-2 outline-none text-gray-800 bg-transparent text-sm w-full"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#1b887a] hover:bg-[#008055] text-white px-5 py-2 rounded-md font-medium transition-colors flex items-center gap-2 text-sm flex-shrink-0">
                {t('hero.start')}
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
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
            {CITIES.map((city) => (
              <div 
                key={city.id} 
                className="relative group rounded-xl overflow-hidden cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
                onClick={() => navigate(`/cities/${city.id}`)}
              >
                <div className="relative h-[240px] md:h-[260px]">
                  <img src={city.img} alt={language === 'zh' ? city.name : city.enName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="p-4 flex items-center justify-between bg-white border-t border-gray-100">
                  <div>
                    <span className="text-[15px] font-bold text-gray-900">{language === 'zh' ? city.name : city.enName}</span>
                    <span className="ml-2 text-xs text-gray-500">{city.id.charAt(0).toUpperCase() + city.id.slice(1)}</span>
                  </div>
                  <div className="flex gap-3 text-gray-500">
                    <span className="flex items-center gap-1 text-xs font-medium"><Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> {city.likes}</span>
                    <span className="flex items-center gap-1 text-xs font-medium"><ThumbsUp className="w-3.5 h-3.5 text-green-500 fill-green-500" /> {city.helpful}</span>
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
          {GUIDES.map((guide, i) => (
             <div key={i} className="flex flex-col sm:flex-row gap-5 bg-transparent cursor-pointer group">
               <img src={guide.img} alt={language === 'zh' ? guide.title : guide.enTitle} className="w-full sm:w-[200px] h-[140px] object-cover rounded-md flex-shrink-0 shadow-sm border border-gray-200 group-hover:opacity-90 transition-opacity" />
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
              <div key={i} className="bg-white rounded-md overflow-hidden cursor-pointer" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                <div className="px-6 py-5 flex justify-between items-center text-gray-900 font-bold hover:bg-gray-50 transition-colors border-b border-gray-100/50">
                  <div className="flex gap-4">
                    <span>{i + 1}.</span>
                    <span>{language === 'zh' ? faq.q : faq.enQ}</span>
                  </div>
                  {openFAQ === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                {openFAQ === i && <div className="px-12 py-5 bg-white text-gray-600 leading-relaxed">{language === 'zh' ? faq.a : faq.enA}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
