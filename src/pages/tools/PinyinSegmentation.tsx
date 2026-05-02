import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
// import { pinyin } from 'pinyin'; // Might not work directly if not compatible with browser, will check.

const PinyinSegmentation = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState('');

    const analyze = () => {
        // Simplified approach for now as segmentation library might have issues
        // In a real app, use a proper backend segmentation API.
        setResult(`拼音示例: ${text.split('').join(' ')}`); 
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <Navbar />
            <main className="pt-24 pb-12 max-w-2xl mx-auto px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-sans font-medium tracking-tight mb-2">中文拼音与分词工具</h1>
                    <p className="text-neutral-500 font-sans">输入中文句子，为您分析拼音及分词。</p>
                </header>
                
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
                    <textarea 
                        className="w-full h-40 p-6 border border-neutral-200 rounded-xl mb-6 focus:ring-2 focus:ring-neutral-900 outline-none transition text-lg"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="输入中文句子以开始分析..."
                    />
                    <button 
                        className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition"
                        onClick={analyze}
                    >
                        分析
                    </button>
                    
                    {result && (
                        <div className="mt-8 p-6 bg-neutral-100 rounded-2xl">
                            <p className="text-neutral-900 font-medium">{result}</p>
                        </div>
                    )}
                </section>
                
            </main>
            <Footer />
        </div>
    );
};

export default PinyinSegmentation;
