import React from 'react';
import { Wifi, CreditCard, BookOpen, Compass, Shield, Languages, Type, Calculator } from 'lucide-react';
import { digitalToolbox, vocabulary, conversations, culture } from '../data/guideData';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const characters = [
    { name: '入口', img: 'https://static.tripcngo.com/ing/入口.jpg' },
    { name: '出口', img: 'https://static.tripcngo.com/ing/出口.jpg' },
    { name: '推', img: 'https://static.tripcngo.com/ing/推.jpg' },
    { name: '拉', img: 'https://static.tripcngo.com/ing/拉.jpg' },
    { name: '地铁', img: 'https://static.tripcngo.com/ing/地铁.jpg' },
    { name: '辣', img: 'https://static.tripcngo.com/ing/辣.jpg' },
    { name: '卫生间', img: 'https://static.tripcngo.com/ing/卫生间.jpg' },
];

export default function Guide() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={t('guide.hero.title')}
        description={t('guide.hero.subtitle')}
      />
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <img 
          src="https://static.tripcngo.com/ing/jingnangbg.jpg" 
          alt="China Travel Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('guide.hero.title')}</h1>
          <p className="text-xl mb-4">{t('guide.hero.subtitle')}</p>
          <p className="max-w-2xl mx-auto text-lg text-gray-200">{t('guide.hero.desc')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Digital Toolbox */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">{t('guide.toolbox.title')}</h2>
            <p className="text-center text-gray-500 mb-8">{t('guide.toolbox.desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-700"><Wifi /> {language === 'zh' ? digitalToolbox.vpn.title : 'Internet: VPN'}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-2">{language === 'zh' ? digitalToolbox.vpn.subtitle : 'Essential tool for international web'}</p>
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <div className="font-bold text-yellow-800 mb-1">{t('guide.toolbox.vpn.important')}</div>
                        <div className="text-sm text-yellow-700">{language === 'zh' ? digitalToolbox.vpn.importantNote : 'Must download and install VPN BEFORE entering China!'}</div>
                    </div>
                    <div className="mb-4">
                        <div className="font-bold text-sm mb-1">{t('guide.toolbox.vpn.why')}</div>
                        <p className="text-sm text-gray-700">{language === 'zh' ? digitalToolbox.vpn.whyNeed : 'China has a firewall; many sites like Google, YouTube, and WhatsApp are blocked.'}</p>
                    </div>
                    
                    <div className="font-bold text-sm mb-2">{t('guide.toolbox.net')}</div>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(digitalToolbox.vpn.options).map(([key, opt]) => (
                            <div key={opt.title} className="border p-3 rounded text-xs">
                                <div className={`font-bold ${key === 'recommendation' ? 'text-green-700' : ''}`}>
                                  {language === 'zh' ? opt.title : (key === 'recommendation' ? 'Recommended: eSIM' : 'Local SIM')}
                                </div>
                                <div className="text-gray-600 whitespace-pre-line">
                                  {language === 'zh' ? opt.desc : (key === 'recommendation' ? '• Buy online before trip\n• Direct global access\n• Tip: Trip.com eSIM' : '• Requires Passport reg\n• Good for long stay\n• Carrier: China Unicom')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-1 flex items-center gap-2 text-blue-700"><CreditCard /> {language === 'zh' ? digitalToolbox.payment.title : 'Mastering Mobile Payments'}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-4">{language === 'zh' ? digitalToolbox.payment.subtitle : 'Your key to China'}</p>
                    <div className="bg-green-50 p-3 text-sm text-green-800 mb-4 rounded font-bold">{t('guide.toolbox.payment.status')}</div>
                    <p className="text-sm text-gray-700 mb-4">{language === 'zh' ? digitalToolbox.payment.description : 'China is almost cashless; mobile payment is a must-have skill.'}</p>
                    
                    <div className="font-bold text-sm mb-2">{t('guide.toolbox.payment.alipay')}</div>
                    <div className="font-bold text-xs mb-2 text-gray-600">{t('guide.toolbox.payment.setup')}</div>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-4">
                        {(language === 'zh' ? digitalToolbox.payment.setupSteps : [
                          'Download "Alipay" before travel',
                          'Register with intl phone number',
                          'Link Visa/Mastercard',
                          'Verify identity with passport'
                        ]).map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                    <div className="font-bold text-xs text-gray-600 mb-2">{t('guide.toolbox.payment.manual')}</div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-blue-700 underline">
                        <div>{language === 'zh' ? '外国人在中国如何设置和使用支付宝' : 'How foreigners set up and use Alipay in China'}</div>
                        <div>{language === 'zh' ? '作为在中国的外国人，如何设置和使用微信支付' : 'How to set up and use WeChat Pay as a foreigner'}</div>
                    </div>
                </div>
            </div>
        </section>

        {/* 语言工具箱 */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">{t('guide.toolbox.lang.title')}</h2>
            <p className="text-gray-600 mb-8 text-center">{t('guide.toolbox.lang.desc')}</p>
            
            <h3 className="text-2xl font-semibold mb-6">{t('guide.toolbox.lang.core')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                {vocabulary.map(v => (
                    <div key={v.cn} className="border p-4 rounded-lg flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-2xl font-bold mb-1">{v.cn}</span>
                        <span className="text-sm text-gray-500">{v.pinyin}</span>
                        <span className="text-xs text-gray-400">{v.en}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-2xl font-semibold mb-6">{t('guide.toolbox.lang.phrases')}</h3>
            <div className="grid md:grid-cols-2 gap-8">
                {Object.values(conversations).map((section: any) => (
                    <div key={section.title} className="border p-6 rounded-lg">
                        <h4 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="text-green-600" /> {language === 'zh' ? section.title : (section.title === '用餐与点菜' ? 'Dining & Ordering' : 'Direction & Transit')}</h4>
                        <div className="space-y-4">
                            {section.phrases.map((p: any) => (
                                <div key={p.cn} className="border-b pb-2 text-sm">
                                    <div className="font-medium">{p.cn}</div>
                                    <div className="text-gray-500">{p.en}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 核心汉字快速识别 */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">{t('guide.toolbox.chars.title')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {characters.map(char => (
                    <div key={char.name} className="flex flex-col items-center">
                        <img src={char.img} alt={char.name} className="rounded-lg shadow-sm mb-2" />
                        <span className="font-bold text-gray-700">{language === 'zh' ? char.name : (
                          char.name === '入口' ? 'Entrance' :
                          char.name === '出口' ? 'Exit' :
                          char.name === '推' ? 'Push' :
                          char.name === '拉' ? 'Pull' :
                          char.name === '地铁' ? 'Subway' :
                          char.name === '辣' ? 'Spicy' : 'Toilet'
                        )}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 文化指南针 */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('guide.toolbox.culture.title')}</h2>
          
          <h3 className="text-2xl font-semibold mb-6">{language === 'zh' ? culture.dining.title : 'Dining Etiquette'}</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {culture.dining.rules.map((rule: any) => (
                <div key={rule.title} className={`p-6 rounded-lg ${rule.type === 'negative' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h4 className="font-bold mb-4">{language === 'zh' ? rule.title : (rule.title === '筷子禁忌' ? 'Chopstick Taboos' : 'Toasting Rules')}</h4>
                    <ul className="text-sm space-y-2">
                        {(language === 'zh' ? rule.items : (
                          rule.title === '筷子禁忌' ? [
                            'Do not stick chopsticks vertically in rice (symbolizes death)',
                            'Do not tap your bowl (symbolizes beggars)',
                            'Do not point at people (impolite)'
                          ] : [
                            'Keep your glass lower than elders/superiors when clinking',
                            'Drink up when you hear "Ganbei" (Cheers)',
                            'Drink as you like when you hear "Suiyi"'
                          ]
                        )).map((item: string) => <li key={item} className="flex items-start gap-1"><span>•</span>{item}</li>)}
                    </ul>
                </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">{language === 'zh' ? culture.gifts.title : 'Gift Giving'}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {culture.gifts.sections.map((section: any) => (
                <div key={section.title} className="p-6 rounded-lg bg-gray-50">
                    <h4 className="font-bold mb-4">{language === 'zh' ? section.title : (
                      section.title === '合适的礼物' ? 'Proper Gifts' : 
                      section.title === '禁忌的礼物' ? 'Taboo Gifts' : 'Polite Ceremony'
                    )}</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                        {(language === 'zh' ? section.items : (
                          section.title === '合适的礼物' ? ['Local specialties from your home', 'Tea, wine, fruit, milk', 'Candies/toys for kids'] :
                          section.title === '禁忌的礼物' ? ['Clocks (sounds like "sending off to death")', 'Umbrellas (sounds like "breaking up")', 'Pears (sounds like "separation")', 'Shoes (sounds like "evil")', 'Sharp items', 'Items in 4 (sounds like "death")', 'Green hats', 'Black/white wrapping'] :
                          ['Give and receive with both hands', 'The recipient might polite refuse, be persistent', 'Don\'t open in front of the giver']
                        )).map((item: string) => <li key={item} className="flex items-start gap-1"><span>•</span>{item}</li>)}
                    </ul>
                </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6 mt-12">{language === 'zh' ? culture.social.title : 'Social Awareness'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {culture.social.items.map((item: any) => (
                <div key={item.title} className="p-6 border rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{language === 'zh' ? item.title : (
                      item.title === '敏感话题' ? 'Sensitive Topics' :
                      item.title === '好奇' ? 'Curiosity' :
                      item.title === '面子' ? 'Mianzi (Face)' : 'Greetings'
                    )}</h4>
                    <p className="text-sm text-gray-700">{language === 'zh' ? item.desc : (
                      item.title === '敏感话题' ? 'Avoid politics, religion, sex. Chinese are patriotic; be respectful with sovereignty topics.' :
                      item.title === '好奇' ? 'Chinese are hospitable. Don\'t refuse directly; be polite and say thanks.' :
                      item.title === '面子' ? 'Honor image and reputation. Avoid making people look bad in public.' :
                      'A simple "Ni hao" or handshake works. Avoid excess body contact.'
                    )}</p>
                </div>
            ))}
          </div>
        </section>
        
        {/* Discover more */}
        <section className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">{t('guide.toolbox.discover')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
                <a href="#" className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 block hover:text-green-600 transition-colors">Travel</a>
                <a href="#" className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 block hover:text-green-600 transition-colors">Tourist Destinations</a>
                <a href="#" className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 block hover:text-green-600 transition-colors">travel</a>
            </div>
        </section>
      </div>
    </div>
  );
}