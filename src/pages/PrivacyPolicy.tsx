import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    const { language, t } = useLanguage();
    return (
        <div className="bg-white">
            <SEO 
                title={t('privacy.hero.title')}
                description={t('privacy.hero.subtitle')}
                keywords={language === 'zh' ? '隐私政策, tripcngo隐私' : 'Privacy Policy, tripcngo privacy'}
            />
            {/* Hero Section */}
            <div 
                className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://static.tripcngo.com/ing/banner_bg_1.jpg)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">{t('privacy.hero.title')}</h1>
                    <p className="text-white/80 text-xl font-medium">{t('privacy.hero.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="prose prose-green max-w-none text-gray-800">
                <p className="text-sm text-gray-500 mb-8">{t('privacy.lastUpdated')}</p>
                
                {language === 'zh' ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4">隐私政策</h2>
                        <p>生效日期：2025年5月17日</p>
                        <p>欢迎您使用我们的网站（以下简称“本网站”）。本隐私政策旨在告知您我们如何收集、使用、存储和保护您的个人信息。通过访问和使用本网站，您同意本隐私政策的条款。</p>
                        
                        <h3 className="text-xl font-bold mt-8 mb-4">1. 我们收集的信息</h3>
                        <p>在您使用本网站的过程中，我们可能会收集以下类型的信息：</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>您主动提供的信息：</strong> 当您使用搜索功能、提交反馈建议或与我们联系时，您可能会主动提供您的姓名、邮箱地址、国家等信息。</li>
                            <li><strong>自动收集的信息：</strong> 当您访问本网站时，我们可能会自动收集您的IP地址、浏览器类型、操作系统、访问时间、访问页面等信息。这些信息用于分析网站使用情况，优化用户体验。</li>
                            <li><strong>Cookie及类似技术：</strong> 我们可能会使用Cookie和类似技术来收集和存储于您使用本网站的信息。Cookie是存储在您设备上的小型文本文件，可以帮助我们识别您的身份、记住您的偏好设置。您可以根据自己的意愿管理或禁用Cookie，但这可能会影响您对本网站部分功能的使用。</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">2. 我们如何使用您的信息</h3>
                        <p>我们收集和使用您的信息主要用于以下目的：</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>提供和维护本网站的各项功能和服务。</li>
                            <li>回复您的咨询、反馈和建议。</li>
                            <li>分析网站使用情况，优化网站内容和用户体验。</li>
                            <li>改进我们的服务，开发新的功能。</li>
                            <li>进行数据统计和分析，以更更好地了解用户需求。</li>
                            <li>在必要时向您发送与本网站相关的通知和更新。</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">3. 我们如何保护您的信息</h3>
                        <p>我们采取合理的安全措施来保护您的信息，包括加密技术传输和存储、限制访问权限、定期安全审查等。尽管如此，互联网并非绝对安全，我们将尽力而为。</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">4. 我们如何共享您的信息</h3>
                        <p>我们不会将您的个人信息出售给第三方。仅在提供必要服务、遵守法律法规或获得您的明确同意时，由于合法目的我们才可能共享您的信息。</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">5. 您的权利</h3>
                        <p>您可以访问、更正或请求删除您的个人信息。如有需要，请通过提供的联系方式与我们沟通。</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                        <p>Effective Date: May 17, 2025</p>
                        <p>Welcome to our website. This Privacy Policy informs you about how we collect, use, store, and protect your personal information. By using this website, you agree to this policy.</p>
                        
                        <h3 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h3>
                        <p>During your use of our website, we may collect the following types of information:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Information You Provide:</strong> When you use search features, submit feedback, or contact us, you may provide your name, email, country, etc.</li>
                            <li><strong>Automatically Collected Information:</strong> We may collect your IP address, browser type, operating system, access time, and pages visited to optimize user experience.</li>
                            <li><strong>Cookies and Similar Technologies:</strong> We use cookies to help identify you and remember your preferences. You can disable cookies in your browser, but it may affect some features.</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h3>
                        <p>We use your information for the following purposes:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>To provide and maintain the website features and services.</li>
                            <li>To respond to your inquiries, feedback, and suggestions.</li>
                            <li>To analyze website usage and optimize content.</li>
                            <li>To improve our services and develop new features.</li>
                            <li>For data statistics and analysis.</li>
                            <li>To send relevant notifications and updates when necessary.</li>
                        </ul>

                        <h3 className="text-xl font-bold mt-8 mb-4">3. How We Protect Your Information</h3>
                        <p>We take reasonable security measures to protect your information, including encrypted transmission and storage, restricted access, and periodic security reviews. However, no internet transmission is 100% secure.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">4. Sharing Your Information</h3>
                        <p>We do not sell your personal information to third parties. We only share it to provide necessary services, comply with laws, or with your explicit consent.</p>

                        <h3 className="text-xl font-bold mt-8 mb-4">5. Your Rights</h3>
                        <p>You may access, correct, or request the deletion of your personal information. Please contact us via the details provided if needed.</p>
                    </>
                )}
                
                {/* Generic contact info at the bottom */}
                <h3 className="text-xl font-bold mt-8 mb-4">{language === 'zh' ? '6. 联系我们' : '6. Contact Us'}</h3>
                <p>{language === 'zh' ? '如果您对本隐私政策有任何疑问、意见或疑虑，请通过以下方式与我们联系：' : 'If you have any questions or concerns about this policy, please contact us:'}</p>
                <p className="mt-2">{language === 'zh' ? '邮箱' : 'Email'}: contact@tripcngo.com</p>
            </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
