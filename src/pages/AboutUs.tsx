import React from 'react';

const AboutUs = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div 
                className="relative h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=1600&q=80&auto=format&fit=crop)' }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <h1 className="relative text-white text-5xl font-bold">为什么选择我们？</h1>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Features */}
                <div className="grid md:grid-cols-3 gap-12 mb-16 text-center">
                    <div>
                        <div className="text-5xl mb-4">📍</div>
                        <h3 className="text-xl font-bold mb-4">本土专业团队</h3>
                        <p className="text-gray-600">我们是一群热爱旅行的本土团队，了解最新政策，掌握小众玩法，能为您提供专业信息和服务</p>
                    </div>
                    <div>
                        <div className="text-5xl mb-4">📅</div>
                        <h3 className="text-xl font-bold mb-4">专注自由行</h3>
                        <p className="text-gray-600">我们只为自由行爱好者服务，提供个性化、定制化的行程方案，让您的旅程更加精彩</p>
                    </div>
                    <div>
                        <div className="text-5xl mb-4">🤖</div>
                        <h3 className="text-xl font-bold mb-4">智能AI助力</h3>
                        <p className="text-gray-600">我们的智能AI助手能够读懂您的需求，快速生成定制行程，专业的指南内容，让规划和旅途都轻松无忧</p>
                    </div>
                </div>

                {/* Story */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">我们的故事</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">tripcngo.com的诞生，源于我们对中国的热爱和对自由行体验的执着。</p>
                        <p className="text-gray-600 mb-4 leading-relaxed">我们坚信旅行是随性且充满惊喜的，而非程式化的拍照打卡，它应该是一种随心而动、随遇而安的体验。</p>
                        <p className="text-gray-600 leading-relaxed">随着中国240小时过境免签政策的推行，越来越多的外国朋友踏上这片古老而神秘的土地，我们真心希望每位旅行者都能享受充满乐趣和惊喜的旅程。然而，现实中存在不少挑战：语言不通、网络不畅、线下支付不便、信息零散以及规划难等，都可能让人望而却步。我们要感受中国的美好，一个全面、实用的指南必不可少。</p>
                        <p className="text-gray-600 mt-4 leading-relaxed font-bold">因此，我们创立了tripcngo.com，我们从介绍中国文化、弥合信息鸿沟入手，结合团队的旅行经验、对中国文化的理解以及对AI技术的执着，共同打造了这个平台。</p>
                        <p className="text-gray-600 mt-4 leading-relaxed">从签证指导到旅行攻略，从文化探索到智能助手，我们希望能帮助每位旅行者轻松规划行程，深入体验，从而发现一个真实而美好的中国。</p>
                    </div>
                    <img 
                        src="https://images.unsplash.com/photo-1545569341-9eb8b30179d6?w=800&q=80&auto=format&fit=crop" 
                        alt="City Skyline" 
                        className="rounded-xl shadow-lg"
                    />
                </div>

                    {/* Team */}
                    <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-10 text-center">我们的团队</h2>
                    <p className="text-center text-gray-500 mb-10">tripcngo.com 是由这些出色的个人创建</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Miracle Zhou", role: "创始人，户外登山爱好者" },
                            { name: "Wood Mao", role: "旅行推荐官，骑行16000公里环游中国" },
                            { name: "Ting Luo", role: "旅行推荐官，小众旅行爱好者" },
                            { name: "Aguest Chen", role: "旅行推荐官，英语老师，爱好旅行" }
                        ].map((member, i) => (
                            <div key={i} className="text-center">
                                <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-4xl">👤</div>
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
