import React, { useState, useEffect } from 'react';
import { Plane, Bed, TrainFront, Globe, Youtube, Phone, Music, Shield, Play, PhoneCall } from 'lucide-react';

const MENU_ITEMS = [
  { id: 'apps', name: '旅行必备APP', icon: Plane },
  { id: 'hotels', name: '酒店预定', icon: Bed },
  { id: 'transit', name: '交通出行', icon: TrainFront },
  { id: 'websites', name: '权威网站', icon: Globe },
  { id: 'youtube', name: 'YouTube达人', icon: Youtube },
  { id: 'tiktok', name: 'TikTok达人', icon: Music },
  { id: 'phones', name: '服务热线', icon: PhoneCall },
];

const SECTIONS = [
  {
    id: 'apps',
    title: '旅行必备APP',
    icon: Plane,
    items: [
      {
        name: 'WeChat(微信)',
        desc: '不仅可以聊天，还可以支付、打车，在任何地方都可以使用',
        logo: <img src="https://static.tripcngo.com/ing/weixin.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="WeChat" />,
        url: 'https://weixin.qq.com/'
      },
      {
        name: 'Alipay(支付宝)',
        desc: '几乎可以在所有地方使用，可以用于支付、外卖、打车、买票等',
        logo: <img src="https://static.tripcngo.com/ing/zhifubao.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Alipay" />,
        url: 'https://www.alipay.com/'
      },
      {
        name: 'MeiTuan(美团)',
        desc: '吃住行一条龙，帮助大家吃的更好，生活更好',
        logo: <img src="https://static.tripcngo.com/ing/meituan.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="MeiTuan" />,
        url: 'https://www.meituan.com/'
      },
      {
        name: 'Xiaohongshu(小红书)',
        desc: '分享生活、美食、旅行、购物，分享一切美好的事物',
        logo: <img src="https://static.tripcngo.com/ing/xiaohongshu.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Xiaohongshu" />,
        url: 'https://www.xiaohongshu.com/'
      }
    ]
  },
  {
    id: 'hotels',
    title: '酒店预定',
    icon: Bed,
    items: [
      {
        name: 'Trip(携程)',
        desc: '中国一站式旅行服务平台，提供酒店、机票、火车票预订等服务',
        logo: <img src="https://static.tripcngo.com/ing/xiecheng.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Trip" />,
        url: 'https://www.ctrip.com/'
      },
      {
        name: 'Airbnb(爱彼迎)',
        desc: '全球最大的民宿预订平台，提供短租、长租、公寓等多种住宿选择',
        logo: <img src="https://static.tripcngo.com/ing/Airbnb.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Airbnb" />,
        url: 'https://www.airbnb.com/'
      },
      {
        name: 'Booking(缤客)',
        desc: '全球酒店、民宿、度假村预订，支持灵活取消政策及多语言服务',
        logo: <img src="https://static.tripcngo.com/ing/Booking.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Booking" />,
        url: 'https://www.booking.com/'
      }
    ]
  },
  {
    id: 'transit',
    title: '交通出行',
    icon: TrainFront,
    items: [
      {
        name: 'GaoDe(高德)',
        desc: '中国领先的导航软件，提供实时路况、公交路线、驾车导航等服务',
        logo: <img src="https://static.tripcngo.com/ing/gaode.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="GaoDe" />,
        url: 'https://amap.com/'
      },
      {
        name: 'DiDi(滴滴出行)',
        desc: '中国主流网约车平台，支持英文界面及境外银行卡支付。',
        logo: <img src="https://static.tripcngo.com/ing/didi.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="DiDi" />,
        url: 'https://www.didiglobal.com/'
      },
      {
        name: '12306(中国铁路)',
        desc: '中国铁路客户服务中心，提供火车票预订、退票、改签等服务',
        logo: <img src="https://static.tripcngo.com/ing/12306.webp" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="12306" />,
        url: 'https://www.12306.cn/'
      }
    ]
  },
  {
    id: 'websites',
    title: '权威网站',
    icon: Globe,
    items: [
      {
        name: '中国国家移民管理局(NIA)',
        desc: '提供签证政策、入境免签时长等官方信息。',
        logo: <img src="https://static.tripcngo.com/ing/guohui.png" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="NIA" />,
        url: 'https://www.nia.gov.cn/'
      },
      {
        name: '中国文化和旅游部(MCT)',
        desc: '提供文化和旅游政策、法律法规等官方信息。',
        logo: <img src="https://static.tripcngo.com/ing/guohui.png" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="MCT" />,
        url: 'https://www.mct.gov.cn/'
      },
      {
        name: '中国领事服务网(Consular Services)',
        desc: '提供领事服务、签证政策、入境免签时长等官方信息。',
        logo: <img src="https://static.tripcngo.com/ing/qianzheng.png" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Consular Services" />,
        url: 'http://cs.mfa.gov.cn/'
      },
      {
        name: '中国签证在线填表(COVA)',
        desc: '在线填写申请表',
        logo: <img src="https://static.tripcngo.com/ing/qianzheng.png" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="COVA" />,
        url: 'https://cova.mfa.gov.cn/'
      },
      {
        name: '中国签证服务中心(CVASC)',
        desc: '提供与中国普通签证申请相关的事务性服务的机构',
        logo: <img src="https://static.tripcngo.com/ing/qianzhengfuwu.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="CVASC" />,
        url: 'https://www.visaforchina.org/'
      }
    ]
  },
  {
    id: 'youtube',
    title: 'YouTube达人',
    icon: Youtube,
    items: [
      {
        name: 'Liziqi(李子柒)',
        desc: '知名中国乡村生活博主',
        logo: <img src="https://static.tripcngo.com/ing/liziqi.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Liziqi" />,
        url: 'https://www.youtube.com/@cnliziqi'
      },
      {
        name: 'IShowSpeed(甲亢哥)',
        desc: '2025年3月开启中国行',
        logo: <img src="https://static.tripcngo.com/ing/ishowspeed.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Speed" />,
        url: 'https://www.youtube.com/@IShowSpeed'
      },
      {
        name: 'Dianxi Xiaoge(滇西小哥)',
        desc: '滇西小哥，一个地道的云南妹子',
        logo: <img src="https://static.tripcngo.com/ing/dianxixiaoge.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Dianxi" />,
        url: 'https://www.youtube.com/@dianxixiaoge'
      },
      {
        name: 'The Food Ranger',
        desc: '环游世界，品尝当地美食',
        logo: <img src="https://static.tripcngo.com/ing/thefoodranger.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="Food Ranger" />,
        url: 'https://www.youtube.com/@thefoodranger'
      }
    ]
  },
  {
    id: 'tiktok',
    title: 'TikTok达人',
    icon: Music,
    items: [
      {
        name: 'jieji.in.china',
        desc: '8年前离开英国，开启中国之旅！全球体验旅行与刺激！',
        logo: <img src="https://static.tripcngo.com/ing/jieji.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="jieji" />,
        url: 'https://www.tiktok.com/@jieji.in.china'
      },
      {
        name: 'tc_inchina',
        desc: '约旦皇室前管家，在中国生活10年中国！爱美食！爱中国❤️🔥',
        logo: <img src="https://static.tripcngo.com/ing/tc_inchina.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="tc_inchina" />,
        url: 'https://www.tiktok.com/@tc_inchina'
      },
      {
        name: 'dabai_inchina',
        desc: '大白，在英国主修中文，中国文化真的多姿多彩',
        logo: <img src="https://static.tripcngo.com/ing/dabai_inchina.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="dabai" />,
        url: 'https://www.tiktok.com/@dabai_inchina'
      },
      {
        name: 'blondieinchina',
        desc: '嗨，我是Amy！居住在中国的全职YouTuber。',
        logo: <img src="https://static.tripcngo.com/ing/blondieinchina.jpg" className="w-[52px] h-[52px] rounded-[14px] object-cover shadow-sm bg-gray-100 flex-shrink-0" alt="blondie" />,
        url: 'https://www.tiktok.com/@blondieinchina'
      }
    ]
  },
  {
    id: 'phones',
    title: '服务热线',
    icon: PhoneCall,
    items: [
      {
        name: '12308',
        desc: '外交部全球领事热线',
        logo: <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 border border-gray-100 shadow-sm"><PhoneCall className="w-6 h-6" /></div>,
        url: 'tel:12308'
      },
      {
        name: '12367',
        desc: '国家移民管理局',
        logo: <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 border border-gray-100 shadow-sm"><PhoneCall className="w-6 h-6" /></div>,
        url: 'tel:12367'
      },
      {
        name: '110',
        desc: '报警电话',
        logo: <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100 shadow-sm"><PhoneCall className="w-6 h-6" /></div>,
        url: 'tel:110'
      },
      {
        name: '119',
        desc: '火警电话',
        logo: <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100 shadow-sm"><PhoneCall className="w-6 h-6" /></div>,
        url: 'tel:119'
      },
      {
        name: '120',
        desc: '急救电话',
        logo: <div className="w-[52px] h-[52px] rounded-[14px] bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-400 border border-gray-100 shadow-sm"><PhoneCall className="w-6 h-6" /></div>,
        url: 'tel:120'
      }
    ]
  }
];

export default function Apps() {
  const [activeSection, setActiveSection] = useState('apps');

  useEffect(() => {
    // Basic Intersection Observer for active section highlighting
    const observer = new IntersectionObserver((entries) => {
      // Find the deeply intersecting entry
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) {
        setActiveSection(visible.target.id);
      }
    }, { rootMargin: '-20% 0px -60% 0px' });

    SECTIONS.forEach(s => {
      const el = document.getElementById(`section-${s.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(`section-${id}`);
    if (el) {
      // Offset for sticky header if exists + padding
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#f9f9f9] pb-20">
      {/* Header Banner */}
      <section className="relative h-[480px] flex items-center pt-16 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.tripcngo.com/ing/mulubg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        <div className="max-w-[1240px] w-full mx-auto px-6 relative z-10 text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-md tracking-tight">
            中国之旅必备应用 2026<span className="text-white/90 font-normal">（最新版）</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow-sm font-medium">
            Google、Uber 在中国无法使用？无需担心。本指南为您收录 2026 年最受当地人喜爱的必备 App，涵盖移动支付、交通、社交、外卖，让您像本地人一样轻松畅游中国。
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1280px] mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
        
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-[240px] flex-shrink-0 sticky top-24 z-20">
           <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
             <nav className="space-y-1">
               {MENU_ITEMS.map((item) => {
                 const isActive = activeSection === item.id;
                 return (
                   <a 
                     key={item.id}
                     href={`#section-${item.id}`} 
                     onClick={(e) => scrollToSection(e, item.id)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                       isActive 
                         ? 'bg-green-50 text-green-600 font-bold' 
                         : 'text-gray-600 hover:bg-gray-50 font-medium'
                     }`}
                   >
                     <item.icon className="w-[18px] h-[18px]" /> {item.name}
                   </a>
                 );
               })}
             </nav>
           </div>
        </div>

        {/* Dynamic Content Sections */}
        <div className="flex-1 space-y-12">
           {SECTIONS.map((section) => (
             <section key={section.id} id={`section-${section.id}`} className="scroll-mt-24">
               <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                 <section.icon className="w-6 h-6" />
                 {section.title}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {section.items.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      {item.logo}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-green-600 transition-colors">{item.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{item.desc}</p>
                      </div>
                    </a>
                 ))}
               </div>
             </section>
           ))}

           {/* Ad Banner Mock */}
           <div className="mt-16 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-between">
              <span className="absolute top-2 right-2 text-[10px] text-blue-400 bg-blue-50 px-1 py-[2px] rounded flex items-center border border-blue-100">
                广告<svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </span>
              <div className="w-full md:w-[300px] h-[200px] md:h-[180px] bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                 <img src="https://images.unsplash.com/photo-1541348263662-e06836264be4?auto=format&fit=crop&q=80&w=800" alt="F1 Race" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-left flex flex-col justify-center items-center md:items-start py-4">
                 <h3 className="text-3xl font-bold mb-4 whitespace-nowrap">Spa 2026 Tickets</h3>
                 <div className="flex items-center justify-between w-full mt-auto">
                    <div className="flex items-center gap-2 bg-yellow-400 font-bold px-2 py-1 rounded w-max text-sm">
                      <div className="w-6 h-6 bg-black rounded-lg text-yellow-400 flex items-center justify-center text-xs relative">
                         G<div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                      Global-Tickets
                    </div>
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-md">
                      Book Now
                    </button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
