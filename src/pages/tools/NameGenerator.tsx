/// <reference types="vite/client" />
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChevronDown, ChevronUp, BookOpen, Search, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const faqs = [
  { q: "tools.name.faq1.q", a: "tools.name.faq1.a" },
  { q: "tools.name.faq2.q", a: "tools.name.faq2.a" },
  { q: "tools.name.faq3.q", a: "tools.name.faq3.a" },
  { q: "tools.name.faq4.q", a: "tools.name.faq4.a" },
  { q: "tools.name.faq5.q", a: "tools.name.faq5.a" }
];

// Add manual translations for specific items that might be missing or keyed incorrectly
const getTranslation = (t: (key: string) => string, key: string, language: string) => {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'visa.menu.download': '材料下载'
    },
    en: {
      'visa.menu.download': 'Downloads'
    }
  };
  return translations[language][key] || t(key);
};

export default function NameGenerator() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', sex: '男', dob: '', info: '' });
  const [generatedName, setGeneratedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `You are a professional Chinese name generator. Generate a meaningful Chinese name based on: Name: ${formData.name}, Sex: ${formData.sex}, DOB: ${formData.dob}, Extra Info: ${formData.info}. Return just the Chinese name, nothing else.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      setGeneratedName(response.text?.trim() || '');
    } catch (error) {
      console.error(error);
      alert(language === 'zh' ? '生成失败' : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      
      {/* Hero Section */}
      <div 
        className="relative h-[300px] w-full flex items-center pt-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tools.name.title')}</h1>
          <p className="text-lg text-white/90">{language === 'zh' ? '使用深度推理AI模型，为您生成适合在中国职业发展、旅游和生活的多个名字供您选择。' : 'Use deep inference AI model to generate multiple Chinese names suitable for your career development, travel, and life in China.'}</p>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 mt-10 relative z-20">
        
        {/* Generator Form */}
        <div className="bg-white border rounded-lg p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'zh' ? '您的全名' : 'Your Full Name'}</label>
                    <input type="text" className="w-full border rounded p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder={language === 'zh' ? '例如: John Doe' : 'e.g. John Doe'} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'zh' ? '性别' : 'Gender'}</label>
                    <select className="w-full border rounded p-2" value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})}>
                      <option value="男">{language === 'zh' ? '男' : 'Male'}</option>
                      <option value="女">{language === 'zh' ? '女' : 'Female'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{language === 'zh' ? '出生日期与时间' : 'Date of Birth'}</label>
                    <input type="date" className="w-full border rounded p-2" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} required />
                  </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">{language === 'zh' ? '其他信息 (选填)' : 'Other Info (Optional)'}</label>
                <textarea className="w-full border rounded p-2" rows={4} value={formData.info} onChange={e => setFormData({...formData, info: e.target.value})} placeholder={language === 'zh' ? '以描述您的学历、职业、性格、或者对名字的喜好...' : 'Describe your background, profession, personality, or name preferences...'}></textarea>
              </div>
              <button type="submit" className="w-full bg-[#1b887a] text-white rounded p-3 font-bold" disabled={loading}>
                {loading ? (language === 'zh' ? '正在生成...' : 'Generating...') : (language === 'zh' ? '生成我的中文名' : 'Generate My Chinese Name')}
              </button>
            </form>
            {generatedName && (
                <div className="mt-6 p-4 bg-green-50 rounded text-xl text-[#1b887a] font-bold border border-green-200">
                    <p>{language === 'zh' ? '为您生成的中文名是:' : 'Your generated Chinese name is:'}</p>
                    <p className="text-2xl mt-2">{generatedName}</p>
                </div>
            )}
        </div>
        
        {/* Why */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '为什么您需要一个真正的中文名' : 'Why you need a true Chinese name'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded shadow-sm border">
                <h3 className="font-bold mb-2">{language === 'zh' ? '基本原则' : 'Basic Principles'}</h3>
                <p className="text-gray-600">{language === 'zh' ? '一个好的中文名字，不仅仅只是长得像，还要符合中国人取名字的习惯。中国人给孩子取名字时，往往遵守着几个基本原则：音律和谐，要好听好念，念起来顺口；寓意要好，蕴含美好的愿望和期许；姓和名搭配和谐，避免不雅谐音。' : 'A good Chinese name is not just about looks; it must follow Chinese naming conventions. When Chinese parents name their children, they usually follow basic principles: harmonious sound, meaningful wishes, and avoiding unpleasant homophones.'}</p>
            </div>
             <div className="bg-white p-6 rounded shadow-sm border">
                <h3 className="font-bold mb-2">{language === 'zh' ? '超越翻译' : 'Beyond Translation'}</h3>
                <p className="text-gray-600">{language === 'zh' ? '我们希望给您一个地道的中文名字，而不是千篇一律的音译产物，这个名字要和您产生联系，更要突出您的特点和喜好，不管在商务还是社交场合，都能让您更加自信和专业。' : 'We want to give you an authentic Chinese name, not a generic transliteration. The name should connect with you, highlight your characteristics and preferences, and make you more confident and professional in both business and social settings.'}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded shadow-sm border mt-8">
            <h3 className="font-bold mb-2">{language === 'zh' ? '中文名的构成' : 'Structure of Chinese Names'}</h3>
            <p className="text-gray-600">{language === 'zh' ? '中文名字由姓和名组成，姓氏通常是家族的传承，整个名字长度一般为2-4个字。例如："张三 zhāng sān"，"张"为姓氏，"三"为名字。' : 'Chinese names consist of a surname and a given name. The surname is usually hereditary, and the total name length is generally 2-4 characters. e.g. "Zhang San", "Zhang" is the surname, "San" is the given name.'}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><p className="font-bold">{language === 'zh' ? '姓氏（姓）' : 'Surname'}</p><p className="text-sm text-gray-500">{language === 'zh' ? '放在前面，通常是从传统家族姓氏中选择的一个字符，中国现已收录的姓氏有500+之多。' : 'Placed at the front, usually selected from traditional family surnames, with over 500 recorded in China.'}</p></div>
              <div><p className="font-bold">{language === 'zh' ? '名字（名）' : 'Given Name'}</p><p className="text-sm text-gray-500">{language === 'zh' ? '一个或两个字符，根据其含义、声音和平衡来选择。' : 'One or two characters chosen based on meaning, sound, and balance.'}</p></div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white p-8 rounded shadow-sm border">
            <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '使用方法' : 'How it works'}</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4"><div className="bg-gray-100 p-4 rounded-full inline-block mb-3"><Languages size={24}/></div><p className="font-bold">{language === 'zh' ? '1. 输入您的信息' : '1. Enter Info'}</p></div>
                <div className="p-4"><div className="bg-gray-100 p-4 rounded-full inline-block mb-3"><Search size={24}/></div><p className="font-bold">{language === 'zh' ? '2. 定义您的身份' : '2. Define Identity'}</p></div>
                <div className="p-4"><div className="bg-gray-100 p-4 rounded-full inline-block mb-3"><BookOpen size={24}/></div><p className="font-bold">{language === 'zh' ? '3. 生成中文名片' : '3. Generate Name Card'}</p></div>
            </div>
        </section>

        {/* FAQ */}
        <section>
            <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '常见问题' : 'FAQ'}</h2>
            <div className="bg-white p-6 rounded shadow-sm border space-y-4">
                {expandedFaq === 0 && <p className="text-gray-600 text-sm mb-2">{language === 'zh' ? '不是的，我们的AI模型会根据您的个人信息、职业、性格偏好生成真正适合您的名字。' : 'No, our AI model generates names that truly suit you based on your personal info, profession, personality, and preferences.'}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}>
                    {language === 'zh' ? '这只是一些名字的直接翻译吗？' : 'Is this just a direct translation of my name?'} {expandedFaq === 0 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                
                {expandedFaq === 1 && <p className="text-gray-600 text-sm mb-2">{language === 'zh' ? '可以的，但建议您在正式使用前与您的中国同事或朋友核实一下。' : 'Yes, but we recommend double-checking with Chinese colleagues or friends before official use.'}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}>
                   {language === 'zh' ? '我可以在正式文件上使用这个名字吗？' : 'Can I use this name on official documents?'} {expandedFaq === 1 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>

                {expandedFaq === 2 && <p className="text-gray-600 text-sm mb-2">{language === 'zh' ? '您将获得汉字、昵称、拼音（发音）、每个字符含义的详细解释，以及为什么它适合您。同时还会包含您的生肖、五行、幸运数字等信息，方便您在社交场合使用。' : 'You will receive Chinese characters, pinyin (pronunciation), detailed meaning of each character, and why it suits you. It will also include your Chinese zodiac, five elements, lucky numbers, etc.'}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}>
                   {language === 'zh' ? '姓名卡片里包含什么内容？' : 'What is included in the name card?'} {expandedFaq === 2 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>

                {expandedFaq === 3 && <p className="text-gray-600 text-sm mb-2">{language === 'zh' ? '是的，我们目前免费提供此服务。' : 'Yes, this service is currently free.'}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 3 ? null : 3)}>
                   {language === 'zh' ? '这个工具是免费的吗？' : 'Is this tool free?'} {expandedFaq === 3 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
                
                {expandedFaq === 4 && <p className="text-gray-600 text-sm mb-2">{language === 'zh' ? '这取决于您的姓氏和个人喜好，通常两字名是目前的主流。' : 'It depends on your surname and personal preference; two-character names are mainstream nowadays.'}</p>}
                <button className="w-full text-left flex justify-between items-center border-b pb-2" onClick={() => setExpandedFaq(expandedFaq === 4 ? null : 4)}>
                   {language === 'zh' ? '中文名字，一个字还是两个字好？' : 'Are one or two-character names better?'} {expandedFaq === 4 ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </button>
            </div>
        </section>

        {/* Case Studies */}
        <section>
           <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '优选用户案例' : 'User Case Studies'}</h2>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "진나래", cn: "金芮琳", py: "Jīn Ruì Lín" },
                { name: "Мубарак Диана", cn: "穆迪娅", py: "Mù Dí Yà" },
                { name: "Мейрамбекова Балжан", cn: "梅兰珍", py: "Méi Lán Zhēn" },
                { name: "박시호 siho park", cn: "朴诗涵", py: "Pǔ Shī Hán" },
                { name: "민은율", cn: "闵恩律", py: "Mǐn Ēn Lǜ" },
                { name: "송의담", cn: "宋奕丹", py: "Sòng Yì Dān" },
                { name: "Abdul Kader. BAYNES", cn: "白凯哲", py: "Bái Kǎi Zhé" },
                { name: "Mulberry Rain", cn: "祁雨盈", py: "Qí Yǔ Yíng" },
                { name: "Mulberry Rain", cn: "祁雨琳", py: "Qí Yǔ Lín" },
                { name: "Aurora Klesh E. Barrios", cn: "柏若曦", py: "Bǎi Ruò Xī" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded shadow-sm border text-center">
                    <p className="text-xs text-gray-400 truncate">{item.name}</p>
                    <p className="font-bold text-lg">{item.cn}</p>
                    <p className="text-xs text-gray-500">{item.py}</p>
                </div>
              ))}
           </div>
        </section>

        {/* More Tools */}
        <section>
            <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '更多工具' : 'More Tools'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded shadow-sm border">{language === 'zh' ? '中文转拼音' : 'Pinyin Converter'}</div>
                <div className="bg-white p-6 rounded shadow-sm border">{language === 'zh' ? '中文笔画计算器' : 'Stroke Counter'}</div>
            </div>
        </section>

        {/* Articles */}
        <section>
            <h2 className="text-2xl font-bold mb-6 text-center">{language === 'zh' ? '中文传统文化文章推荐' : 'Recommended Articles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="bg-white rounded shadow-sm border overflow-hidden">
                        <div className="h-40 bg-gray-200"></div>
                        <div className="p-4"><h3 className="font-bold">{language === 'zh' ? '文章标题' : 'Article Title'} {i}</h3><p className="text-sm text-gray-500">{language === 'zh' ? '简要介绍...' : 'Brief intro...'}</p></div>
                    </div>
                ))}
            </div>
        </section>
      </div>

    </div>
  );
}
