import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const TermsOfService = () => {
    const { language, t } = useLanguage();
    return (
        <div className="bg-white">
            <SEO 
                title={t('terms.hero.title')}
                description={t('terms.hero.subtitle')}
                keywords={language === 'zh' ? '服务条款, tripcngo条款' : 'Terms of Service, tripcngo terms'}
            />
            {/* Hero Section */}
            <div 
                className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{t('terms.hero.title')}</h1>
                    <p className="text-white/80 text-xl font-medium">{t('terms.hero.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-green max-w-none text-gray-800">
                <p className="text-sm text-gray-500 mb-8">{t('privacy.lastUpdated')}</p>
                
                {language === 'zh' ? (
                    <>
                        <h3 className="text-xl font-bold mt-8 mb-4">1. 服务内容</h3>
                        <p>本网站旨在为计划前往中国旅行的外国游客提供全面和便捷的服务。目前，本网站主要提供以下服务：</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>首页：</strong> 展示中国热门旅游目的地、城市榜单、免签政策搜索、旅游资讯等。</li>
                            <li><strong>签证政策：</strong> 提供各类中国签证的详细介绍、分国别指南、申请流程、常见问题解答、最新政策及入境须知、口岸信息等。</li>
                            <li><strong>中国文化：</strong> 分类介绍中国传统文化、地域文化特色、文学特色等。</li>
                            <li><strong>漫游攻略：</strong> 提供基于AI技术的个性化旅行计划生成，用户游记分享平台、中国日历旅行推荐等。</li>
                            <li><strong>旅行导航：</strong> 推荐入境中国旅行必备APP或者网站等。</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">2. 用户行为规范</h3>
                        <p>在使用本网站时，您同意不从事任何非法活动，不侵犯第三方权益，不传播不良信息。我们保留对违反规定者终止服务的权利。</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">3. 知识产权</h3>
                        <p>平台上的所有内容其知识产权归本网站所有。未经书面许可，您不得以任何方式复制、修改或传播。对于用户分享的内容，用户授予本网站在全球范围内的使用许可。</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">4. 免责声明</h3>
                        <p>本网站尽力提供准确信息，但不对信息的完整性、及准确性做出保证。签证及入境指南仅供参考，请以官方发布为准。AI生成的计划仅供内部参考。</p>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-bold mt-8 mb-4">1. Service Content</h3>
                        <p>This website aims to provide comprehensive services for foreign tourists planning to travel to China, including:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Homepage:</strong> Showcasing destinations, rankings, visa-free search, and travel news.</li>
                            <li><strong>Visa Policy:</strong> Detailed visa info, application guides, FAQ, and latest entry news.</li>
                            <li><strong>Chinese Culture:</strong> Traditional and regional cultural features.</li>
                            <li><strong>Travel Guides:</strong> AI-powered personalized itinerary generation and stories.</li>
                            <li><strong>Navigation:</strong> Recommended travel apps and websites.</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">2. User Conduct</h3>
                        <p>By using this site, you agree not to engage in illegal activities, infringe on rights, or spread harmful content. We reserve the right to terminate service for violations.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">3. Intellectual Property</h3>
                        <p>All content belongs to this website unless stated otherwise. Unauthorized copying or modification is prohibited. Users grant us a global license for shared stories.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">4. Disclaimer</h3>
                        <p>We strive for accuracy but do not guarantee completeness. Visa and entry guides are for reference only—please refer to official sources. AI itineraries are reference suggestions.</p>
                    </>
                )}
                
                <h3 className="text-xl font-bold mt-8 mb-4">{language === 'zh' ? '5. 联系我们' : '5. Contact Us'}</h3>
                <p>{language === 'zh' ? '如果您对本服务条款有任何疑问或意见，请通过以下方式与我们联系：' : 'If you have any questions or feedback regarding these terms, please contact us:'}</p>
                <p className="mt-2">{language === 'zh' ? '邮箱' : 'Email'}: contact@tripcngo.com</p>
            </div>
            </div>
        </div>
    );
};

export default TermsOfService;
