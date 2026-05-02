import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const NameGenerator = () => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('male');
    const [generatedName, setGeneratedName] = useState('');
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Generate a nice Chinese name for someone named ${name} who is ${gender}. Provide the name and its meaning.`,
            });
            setGeneratedName(response.text || '');
        } catch (e) {
            console.error(e);
            setGeneratedName('生成失败，请重试');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900">
            <Navbar />
            <main className="pt-24 pb-12 max-w-2xl mx-auto px-6">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-sans font-medium tracking-tight mb-2">AI中文起名大师</h1>
                    <p className="text-neutral-500 font-sans">让AI为您量身定制一个既有寓意又独特的中文名。</p>
                </header>
                
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-2">英文名或含义</label>
                            <input 
                                className="w-full border border-neutral-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition" 
                                placeholder="例如: Jonathan, 或 '希望勇敢'" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-neutral-600 uppercase tracking-wider mb-2">性别</label>
                            <select 
                                className="w-full border border-neutral-200 p-4 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="male">男</option>
                                <option value="female">女</option>
                            </select>
                        </div>
                        <button 
                            className="bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-50"
                            onClick={generate}
                            disabled={loading || !name}
                        >
                            {loading ? '正在生成...' : '生成中文名'}
                        </button>
                    </div>
                    
                    {generatedName && (
                        <div className="mt-8 p-6 bg-purple-50 rounded-2xl border border-purple-100">
                            <p className="text-purple-900 font-medium whitespace-pre-line">{generatedName}</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default NameGenerator;
