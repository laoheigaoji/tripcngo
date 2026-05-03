import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';
import { 
  ChevronRight, 
  Eye, 
  User, 
  Calendar, 
  FolderIcon,
  ThumbsUp
} from 'lucide-react';
import Markdown from 'react-markdown';

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  content: string;
  contentEn?: string;
  thumbnail: string;
  category: string;
  author: string;
  views: number;
  likes: number;
  createdAt: string;
}

export default function GuideDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const displayTitle = (article && language === 'en' && article.titleEn) ? article.titleEn : (article?.title || '');
  const displaySubtitle = (article && language === 'en' && article.subtitleEn) ? article.subtitleEn : (article?.subtitle || '');
  const displayContent = (article && language === 'en' && article.contentEn) ? article.contentEn : (article?.content || '');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/articles/${id}`);
        const data = await response.json();
        setArticle(data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1b887a]"></div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
       <h1 className="text-2xl font-black text-gray-900 mb-4">{t('guide.articleNotFound')}</h1>
       <Link to="/articles" className="px-6 py-3 bg-[#1b887a] text-white rounded-lg font-bold">{t('guide.backToList')}</Link>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <SEO 
        title={displayTitle}
        description={displaySubtitle}
        keywords={`${article.category}, ${language === 'zh' ? '中国旅行攻略' : 'China travel tips'}`}
        type="article"
        image={article.thumbnail}
      />
      {/* Article Header Section */}
      <section className="bg-[#005043] pt-32 pb-16 text-white">
        <div className="max-w-[1240px] mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-white/60 text-[13px] mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
             <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
               <ChevronRight className="w-4 h-4" /> {t('nav.home')}
             </Link>
             <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
             <Link to="/articles" className="hover:text-white transition-colors">{t('discover.guides')}</Link>
             <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
             <span className="text-white/40 truncate">{displayTitle}</span>
          </nav>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black mb-10 leading-[1.1] tracking-tight max-w-4xl"
          >
            {displayTitle}
          </motion.h1>

          <div className="flex flex-wrap gap-y-4 gap-x-8 items-center text-white/70 text-[13px] font-medium border-t border-white/10 pt-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 opacity-50" />
              <span>{t('guide.author')}: <span className="text-white font-bold">{article.author}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 opacity-50" />
              <span>{t('guide.updated')}: {new Date(article.createdAt).toISOString().split('T')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderIcon className="w-4 h-4 opacity-50" />
              <span>{t('guide.inCategory')} {article.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 opacity-50" />
              <span>{article.views} {t('guide.views')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1240px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
         <div className="flex-1 min-w-0">
            {/* Article Body */}
            <div className="markdown-body prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-black prose-headings:mt-12 prose-headings:mb-6 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-img:rounded-2xl prose-img:shadow-lg">
               <Markdown>{displayContent}</Markdown>
            </div>

            {/* Useful Section */}
            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
               <button 
                  onClick={() => setArticle(prev => prev ? {...prev, likes: prev.likes + 1} : null)}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1b887a] group-hover:bg-[#1b887a]/5 transition-all text-gray-300 group-hover:text-[#1b887a]">
                    <ThumbsUp className={`w-6 h-6 ${article.likes > 0 ? 'fill-[#1b887a] text-[#1b887a]' : ''}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#1b887a] transition-colors">
                    {article.likes} {t('guide.helpful')}
                  </span>
               </button>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-10">
               <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                  <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                     <img src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=200" alt="Prev" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('guide.prevPost')}</span>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#1b887a] line-clamp-2 leading-snug">{language === 'zh' ? '如何选择一个适合自己的中文名字？' : 'How to choose a Chinese name that fits you?'}</h4>
                  </div>
               </div>
               <div className="flex items-center justify-end gap-4 group cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 text-right">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t('guide.nextPost')}</span>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-[#1b887a] line-clamp-2 leading-snug">{language === 'zh' ? '有趣的中国：探秘你离开那见过的各种离奇的事情' : 'Intriguing China: Secret things you\'ve seen since you left'}</h4>
                  </div>
                  <div className="w-24 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                     <img src="https://images.unsplash.com/photo-1549221530-47ea067066bc?auto=format&fit=crop&q=80&w=200" alt="Next" className="w-full h-full object-cover" />
                  </div>
               </div>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="w-full lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-12">
               {/* Recommendations Section */}
               <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                     {t('guide.recommend')}
                  </h3>
                  <div className="space-y-6">
                     {[
                       { title: language === 'zh' ? '中文名字完全指南' : 'The Ultimate Guide to Chinese Names', img: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400' },
                       { title: language === 'zh' ? '中国早餐完全指南' : 'The Ultimate Guide to Chinese Breakfast', img: 'https://images.unsplash.com/photo-1549221530-47ea067066bc?auto=format&fit=crop&q=80&w=400' },
                       { title: language === 'zh' ? '外国人最爱的100个城市' : '100 Cities Foreigners Love Most', img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=400' }
                     ].map((item, i) => (
                       <Link key={i} to="/articles" className="block group">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm border border-gray-100">
                           <img 
                            src={item.img} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                              <h4 className="text-white font-bold text-sm leading-tight text-center w-full">{item.title}</h4>
                           </div>
                          </div>
                       </Link>
                     ))}
                  </div>
               </section>

               {/* City Rankings */}
               <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">
                     {t('guide.recommendCity')}
                   </h3>
                   <div className="space-y-4">
                      {[
                        { name: t('city.changsha'), en: 'Changsha', count: 64, img: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=100' },
                        { name: t('city.fuzhou'), en: 'Fuzhou', count: 61, img: 'https://images.unsplash.com/photo-1549221530-47ea067066bc?auto=format&fit=crop&q=80&w=100' },
                        { name: t('city.beijing'), en: 'Beijing', count: 9, img: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=100' },
                        { name: t('city.guangzhou'), en: 'Guangzhou', count: 5, img: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=100' },
                        { name: t('city.shanghai'), en: 'Shanghai', count: 3, img: 'https://images.unsplash.com/photo-1549221530-47ea067066bc?auto=format&fit=crop&q=80&w=100' }
                      ].map((city, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all border border-gray-100">
                                <img src={city.img} alt={city.name} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-700 leading-none mb-1">{city.name}</h4>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{city.en}</span>
                             </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full">{city.count} {t('city.stats.recommended')}</span>
                        </div>
                      ))}
                   </div>
               </section>
            </div>
         </div>
      </section>
    </div>
  );
}
