import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const AboutUs = () => {
    const { language, t } = useLanguage();
    return (
        <div className="bg-white">
            <SEO 
                title={language === 'zh' ? '关于我们' : 'About Us'}
                description={language === 'zh' 
                    ? '了解 tripcngo.com 的使命和故事。我们是一个热爱旅行的本土团队，致力于利用智能AI技术帮助全球旅行者探索真实而美好的中国。' 
                    : 'Learn about the mission and story of tripcngo.com. We are a local team of travel enthusiasts dedicated to helping global travelers explore the real and beautiful China using smart AI technology.'}
                keywords={language === 'zh' ? '关于 tripcngo, 中国旅行团队, 旅行AI助手' : 'About tripcngo, China travel team, travel AI assistant'}
            />
            {/* Hero Section */}
            <div 
                className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <h1 className="relative text-white text-5xl font-bold">{t('about.hero.title')}</h1>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-12 mb-16 text-center">
                    <div>
                        <div className="text-5xl mb-4">📍</div>
                        <h3 className="text-xl font-bold mb-4">{t('about.features.team.title')}</h3>
                        <p className="text-gray-600">{t('about.features.team.desc')}</p>
                    </div>
                    <div>
                        <div className="text-5xl mb-4">📅</div>
                        <h3 className="text-xl font-bold mb-4">{t('about.features.focus.title')}</h3>
                        <p className="text-gray-600">{t('about.features.focus.desc')}</p>
                    </div>
                    <div>
                        <div className="text-5xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold mb-4">{t('about.features.ai.title')}</h3>
                        <p className="text-gray-600">{t('about.features.ai.desc')}</p>
                    </div>
                </div>

                {/* Story */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">{t('about.story.title')}</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">{t('about.story.p1')}</p>
                        <p className="text-gray-600 mb-4 leading-relaxed">{t('about.story.p2')}</p>
                        <p className="text-gray-600 mb-4 leading-relaxed">{t('about.story.p3')}</p>
                        <p className="text-gray-600 mt-4 leading-relaxed font-bold">{t('about.story.p4')}</p>
                        <p className="text-gray-600 mt-4 leading-relaxed">{t('about.story.p5')}</p>
                    </div>
                    <img 
                        src="https://static.tripcngo.com/ing/image1bg.jpg" 
                        alt="Our Story" 
                        className="rounded-xl shadow-lg"
                    />
                </div>

                    {/* Team */}
                    <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">{t('about.team.title')}</h2>
                    <p className="text-center text-gray-500 mb-10">{t('about.team.subtitle')}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Miracle Zhou", role: language === 'zh' ? "创始人，户外登山爱好者" : "Founder, Outdoor Enthusiast", img: "https://static.tripcngo.com/ing/Miracle%20Zhou.jpg" },
                            { name: "Wood Mao", role: language === 'zh' ? "旅行推荐官，骑行16000公里环游中国" : "Travel Specialist, Circled China on Bike", img: "https://static.tripcngo.com/ing/Wood%20Mao.jpg" },
                            { name: "Ting Luo", role: language === 'zh' ? "旅行推荐官，小众旅行爱好者" : "Travel Specialist, Hidden Gem Explorer", img: "https://static.tripcngo.com/ing/Ting%20Luo.jpg" },
                            { name: "Aguest Chen", role: language === 'zh' ? "旅行推荐官，英语老师，爱好旅行" : "Travel Specialist, English Teacher", img: "https://static.tripcngo.com/ing/Aguest%20Chen.jpg" }
                        ].map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-full aspect-square rounded-lg mb-4 overflow-hidden">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold">{member.name}</h3>
                                <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
