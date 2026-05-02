import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CharacterCounter = () => {
    const [text, setText] = useState('');
    
    const countStats = (str: string) => {
        const char = str.length;
        const chinese = (str.match(/[\u4e00-\u9fa5]/g) || []).length;
        const english = (str.match(/[a-zA-Z]/g) || []).length;
        const digits = (str.match(/[0-9]/g) || []).length;
        const punctuations = (str.match(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g) || []).length;
        
        return { char, chinese, english, digits, punctuations };
    };

    const stats = countStats(text);

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <Navbar />
            <main className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-sans font-medium tracking-tight mb-2">中文字符计数器</h1>
                    <p className="text-neutral-500 font-sans">粘贴文本，为您快速统计字符组成。</p>
                </header>

                <section className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[
                            { label: '总字符', val: stats.char },
                            { label: '中文', val: stats.chinese },
                            { label: '英文', val: stats.english },
                            { label: '数字', val: stats.digits },
                            { label: '标点', val: stats.punctuations }
                        ].map(({ label, val }) => (
                            <div key={label} className="bg-neutral-50 p-6 rounded-2xl text-center border border-neutral-100">
                                <div className="text-neutral-500 text-sm font-semibold uppercase tracking-wider mb-2">{label}</div>
                                <div className="text-3xl font-bold tracking-tight">{val}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <textarea 
                    className="w-full h-80 p-8 border border-neutral-200 rounded-3xl focus:ring-2 focus:ring-neutral-900 outline-none transition text-lg"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="粘贴或输入文本以开始统计..."
                />
            </main>
            <Footer />
        </div>
    );
};

export default CharacterCounter;
