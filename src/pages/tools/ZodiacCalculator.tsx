import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ZodiacCalculator = () => {
    const [year, setYear] = useState<string>('2026');
    const [month, setMonth] = useState<string>('2');
    const [day, setDay] = useState<string>('17');
    const [result, setResult] = useState<string | null>(null);

    const calculateZodiac = () => {
        const y = parseInt(year);
        // Simplified mapping for demonstration
        const zodiacs = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
        const index = (y - 4) % 12;
        setResult(zodiacs[index < 0 ? index + 12 : index]);
    };

    return (
        <div className="bg-neutral-50 text-neutral-900 w-full">
            <main className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <span>📅</span>
                        <span>查阅您的生肖</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">中国生肖计算器</h1>
                    <p className="text-neutral-600 text-lg">根据生日查询你的中国生肖，了解生肖文化，并查看本命年时间与旅行灵感。</p>
                </header>

                {/* Calculator Widget */}
                <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100 max-w-4xl mx-auto mb-16">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">出生年份</label>
                            <select value={year} onChange={e => setYear(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(126)].map((_, i) => <option key={i} value={1900 + i}>{1900 + i}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">出生月份</label>
                            <select value={month} onChange={e => setMonth(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}月</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">出生日期</label>
                            <select value={day} onChange={e => setDay(e.target.value)} className="appearance-none border border-neutral-200 p-4 rounded-xl w-full bg-white pr-10">
                                {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}日</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <button onClick={calculateZodiac} className="w-full mt-8 bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
                        <span>✨</span> 查询我的生肖
                    </button>
                    {result && (
                        <div className="mt-8 text-center bg-green-50 p-6 rounded-2xl border border-green-200">
                            <h3 className="text-2xl font-bold text-green-900">查询结果：{year}年出生，您的生肖是：{result}</h3>
                        </div>
                    )}
                </section>

                <div className="space-y-12">
                   <div className="bg-white p-8 rounded-3xl border border-neutral-100">
                        <h2 className="text-2xl font-bold mb-6">生肖年从什么时候开始变化？</h2>
                        <p className="text-neutral-600 leading-relaxed">2026年中国生肖中的马，但生肖并不是从1月1日开始。2026年春节开始于2026年2月17日。马通常与活力、自由、行动力与自信联系在一起。</p>
                   </div>
                   
                   <div className="bg-white p-8 rounded-3xl border border-neutral-100">
                        <h2 className="text-2xl font-bold mb-6">十二生肖详解</h2>
                        <p className="text-neutral-600 leading-relaxed">中国文化中共有十二种生肖，它们分别是：鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。</p>
                   </div>
                </div>
            </main>
        </div>
    );
};

export default ZodiacCalculator;
