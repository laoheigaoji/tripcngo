import React from 'react';
import { Wifi, CreditCard, BookOpen, Compass, Shield, Languages, Type, Calculator } from 'lucide-react';
import { digitalToolbox, vocabulary, conversations, culture } from '../data/guideData';

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center">
        <img 
          src="https://static.tripcngo.com/ing/jingnangbg.jpg" 
          alt="China Travel Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">中国旅行指南</h1>
          <p className="text-xl mb-4">5分钟掌握入华锦囊，第一次去中国必看</p>
          <p className="max-w-2xl mx-auto text-lg text-gray-200">本专题专为第一次去中国的外国朋友打造，旨在解决您在华期间最紧迫、最常见的“痛点”，让您能够快速了解中国，并开启一段愉快的中国之旅。</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Digital Toolbox */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">数字生存工具包</h2>
            <p className="text-center text-gray-500 mb-8">网络连接与移动支付的必备指南</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-700"><Wifi /> {digitalToolbox.vpn.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-2">{digitalToolbox.vpn.subtitle}</p>
                    <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <div className="font-bold text-yellow-800 mb-1">重要提醒</div>
                        <div className="text-sm text-yellow-700">{digitalToolbox.vpn.importantNote}</div>
                    </div>
                    <div className="mb-4">
                        <div className="font-bold text-sm mb-1">为什么需要VPN？</div>
                        <p className="text-sm text-gray-700">{digitalToolbox.vpn.whyNeed}</p>
                    </div>
                    
                    <div className="font-bold text-sm mb-2">手机网络选择</div>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(digitalToolbox.vpn.options).map(([key, opt]) => (
                            <div key={opt.title} className="border p-3 rounded text-xs">
                                <div className={`font-bold ${key === 'recommendation' ? 'text-green-700' : ''}`}>{opt.title}</div>
                                <div className="text-gray-600 whitespace-pre-line">{opt.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="border p-6 rounded-lg">
                    <h3 className="font-bold text-xl mb-1 flex items-center gap-2 text-blue-700"><CreditCard /> {digitalToolbox.payment.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-4">{digitalToolbox.payment.subtitle}</p>
                    <div className="bg-green-50 p-3 text-sm text-green-800 mb-4 rounded font-bold">中国已进入准无现金社会</div>
                    <p className="text-sm text-gray-700 mb-4">{digitalToolbox.payment.description}</p>
                    
                    <div className="font-bold text-sm mb-2">首选：支付宝 (Alipay)</div>
                    <div className="font-bold text-xs mb-2 text-gray-600">设置步骤</div>
                    <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 mb-4">
                        {digitalToolbox.payment.setupSteps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                    <div className="font-bold text-xs text-gray-600 mb-2">支付操作手册</div>
                    <div className="grid grid-cols-1 gap-2 text-xs text-blue-700 underline">
                        <div>外国人在中国如何设置和使用支付宝</div>
                        <div>作为在中国的外国人，如何设置和使用微信支付</div>
                    </div>
                </div>
            </div>
        </section>

        {/* 语言工具箱 */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
            <h2 className="text-3xl font-bold mb-4 text-center">语言工具箱</h2>
            <p className="text-gray-600 mb-8 text-center">高频词汇常用对话，轻松应对日常沟通</p>
            
            <h3 className="text-2xl font-semibold mb-6">高频核心词汇</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                {vocabulary.map(v => (
                    <div key={v.cn} className="border p-4 rounded-lg flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-2xl font-bold mb-1">{v.cn}</span>
                        <span className="text-sm text-gray-500">{v.pinyin}</span>
                        <span className="text-xs text-gray-400">{v.en}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-2xl font-semibold mb-6">情景对话手册</h3>
            <div className="grid md:grid-cols-2 gap-8">
                {Object.values(conversations).map(section => (
                    <div key={section.title} className="border p-6 rounded-lg">
                        <h4 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="text-green-600" /> {section.title}</h4>
                        <div className="space-y-4">
                            {section.phrases.map(p => (
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
            <h2 className="text-3xl font-bold mb-8 text-center">核心汉字快速识别</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {characters.map(char => (
                    <div key={char.name} className="flex flex-col items-center">
                        <img src={char.img} alt={char.name} className="rounded-lg shadow-sm mb-2" />
                        <span className="font-bold text-gray-700">{char.name}</span>
                    </div>
                ))}
            </div>
        </section>

        {/* 文化指南针 */}
        <section className="bg-white p-8 rounded-xl shadow-sm mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">文化指南针</h2>
          
          <h3 className="text-2xl font-semibold mb-6">{culture.dining.title}</h3>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {culture.dining.rules.map(rule => (
                <div key={rule.title} className={`p-6 rounded-lg ${rule.type === 'negative' ? 'bg-red-50' : 'bg-green-50'}`}>
                    <h4 className="font-bold mb-4">{rule.title}</h4>
                    <ul className="text-sm space-y-2">
                        {rule.items.map(item => <li key={item} className="flex items-start gap-1"><span>•</span>{item}</li>)}
                    </ul>
                </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6">{culture.gifts.title}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {culture.gifts.sections.map(section => (
                <div key={section.title} className="p-6 rounded-lg bg-gray-50">
                    <h4 className="font-bold mb-4">{section.title}</h4>
                    <ul className="text-sm space-y-2 text-gray-600">
                        {section.items.map(item => <li key={item} className="flex items-start gap-1"><span>•</span>{item}</li>)}
                    </ul>
                </div>
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-6 mt-12">{culture.social.title}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {culture.social.items.map(item => (
                <div key={item.title} className="p-6 border rounded-lg">
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
            ))}
          </div>
        </section>
        
        {/* Discover more */}
        <section className="mb-12">
            <h3 className="text-xl font-bold mb-6 text-gray-900 border-b pb-2">Discover more</h3>
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
