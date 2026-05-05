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
import { supabase } from '../../lib/supabase';
import { fallbackArticles } from '../../data/fallbackData';

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  content: string;
  contentEn?: string;
  thumbnail?: string;
  category: string;
  author?: string;
  views?: number;
  likes?: number;
  createdAt: string;
}

export default function GuideDetail() {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const getTranslatedValue = (zh: any, en: any) => {
    if (isEn && en) return en;
    return zh;
  };
  const [article, setArticle] = useState<Article | null>(null);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [recommendedCities, setRecommendedCities] = useState<any[]>([]);
  const [prevArticle, setPrevArticle] = useState<Article | null>(null);
  const [nextArticle, setNextArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const langPrefix = language === 'zh' ? 'cn' : 'en';

  const displayTitle = (article && language === 'en' && article.titleEn) ? article.titleEn : (article?.title || '');
  const displaySubtitle = (article && language === 'en' && article.subtitleEn) ? article.subtitleEn : (article?.subtitle || '');
  const displayContent = (article && language === 'en' && article.contentEn) ? article.contentEn : (article?.content || '');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) return;
        const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
        
        if (!error && data) {
          const loadedArticle = {
            _id: data.id,
            ...data,
            views: (data.views || 0) + 1,
            likes: data.likes || 0,
            createdAt: data.createdAt || new Date().toISOString()
          } as Article;

          setArticle(loadedArticle);
          window.scrollTo(0, 0);

          try {
            const { data: citiesData, error: citiesError } = await supabase.from('cities').select('id, name, enName, listCover, heroImage, stats').limit(5);
            if (!citiesError && citiesData) {
              setRecommendedCities(citiesData);
            }
          } catch (e) {
            console.error('Failed to fetch cities for recommendation', e);
          }

          try {
            const { data: allDocs, error: allDocsError } = await supabase.from('articles').select('*').order('createdAt', { ascending: false });
            if (!allDocsError && allDocs) {
              const allArticles = allDocs.map(dData => ({
                _id: dData.id,
                ...dData,
                createdAt: dData.createdAt || new Date().toISOString()
              })) as Article[];
              
              const currentIndex = allArticles.findIndex(a => a._id === id);
              if (currentIndex !== -1) {
                setPrevArticle(currentIndex > 0 ? allArticles[currentIndex - 1] : null);
                setNextArticle(currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null);
              }
              
              const others = allArticles.filter(a => a._id !== id);
              setRecommendedArticles(others.sort(() => 0.5 - Math.random()).slice(0, 3));
            }
          } catch (e) {
            console.error('Failed to fetch other articles', e);
          }

          try {
            await supabase.from('articles').update({
              views: (data.views || 0) + 1
            }).eq('id', id);
          } catch (e) {
            console.error('Failed to increment views', e);
          }
        } else {
          setError(error?.message || "Article Not Found");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Database connection error");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (!article || !id) return;
    
    // Optimistic UI update
    setArticle(prev => prev ? {...prev, likes: (prev.likes || 0) + 1} : null);
    
    try {
      const { data, error } = await supabase.from('articles').select('likes').eq('id', id).single();
      if (!error && data) {
        await supabase.from('articles').update({
          likes: (data.likes || 0) + 1
        }).eq('id', id);
      }
    } catch (e) {
      console.error('Failed to update likes', e);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1b887a]"></div>
    </div>
  );

  if (error && !article) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
       <h1 className="text-2xl font-black text-gray-900 mb-4">{t('guide.articleNotFound')}</h1>
       <Link to={`/${langPrefix}/articles`} className="px-6 py-3 bg-[#1b887a] text-white rounded-lg font-bold">{t('guide.backToList')}</Link>
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
             <Link to={`/${langPrefix}`} className="hover:text-white transition-colors flex items-center gap-1">
               <ChevronRight className="w-4 h-4" /> {t('nav.home')}
             </Link>
             <ChevronRight className="w-3 h-3 opacity-40 shrink-0" />
             <Link to={`/${langPrefix}/articles`} className="hover:text-white transition-colors">{t('discover.guides')}</Link>
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
              <span>{t('guide.author')}: <span className="text-white font-bold">{article.author || 'TripCNGO'}</span></span>
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
              <span>{article.views || 0} {t('guide.views')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1240px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16">
         <div className="flex-1 min-w-0">
            {/* Article Body */}
            <div className="markdown-body">
               <Markdown>{displayContent}</Markdown>
            </div>

            {/* Useful Section */}
            <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
               <button 
                  onClick={handleLike}
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#1b887a] group-hover:bg-[#1b887a]/5 transition-all text-gray-300 group-hover:text-[#1b887a]">
                    <ThumbsUp className={`w-6 h-6 ${article.likes && article.likes > 0 ? 'fill-[#1b887a] text-[#1b887a]' : ''}`} />
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-[#1b887a] transition-colors">
                    {article.likes || 0} {t('guide.helpful')}
                  </span>
               </button>
            </div>

            {/* Prev/Next Section */}
            {(prevArticle || nextArticle) && (
              <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                {prevArticle ? (
                  <Link to={`/${langPrefix}/articles/${prevArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-left">
                    {prevArticle.thumbnail && <img src={prevArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{language === 'zh' ? '上一篇' : 'Previous'}</span>
                      <h4 className="font-bold text-gray-900 line-clamp-2">
                        {(language === 'en' && prevArticle.titleEn) ? prevArticle.titleEn : prevArticle.title}
                      </h4>
                    </div>
                  </Link>
                ) : <div />}
                {nextArticle ? (
                  <Link to={`/${langPrefix}/articles/${nextArticle._id}`} className="p-4 rounded-xl border border-gray-100 hover:border-[#1b887a] hover:bg-gray-50 transition-all flex items-center gap-4 text-right justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{language === 'zh' ? '下一篇' : 'Next'}</span>
                      <h4 className="font-bold text-gray-900 line-clamp-2">
                        {(language === 'en' && nextArticle.titleEn) ? nextArticle.titleEn : nextArticle.title}
                      </h4>
                    </div>
                    {nextArticle.thumbnail && <img src={nextArticle.thumbnail} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  </Link>
                ) : <div />}
              </div>
            )}

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
                     {recommendedArticles.map((item, i) => (
                       <Link key={item._id} to={`/${langPrefix}/articles/${item._id}`} className="block group">
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-gray-100 shadow-sm border border-gray-100">
                           <img 
                            src={item.thumbnail || 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400'} 
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                              <h4 className="text-white font-bold text-sm leading-tight text-center w-full">
                                 {(language === 'en' && item.titleEn) ? item.titleEn : item.title}
                              </h4>
                           </div>
                          </div>
                       </Link>
                     ))}
                     {recommendedArticles.length === 0 && (
                       <p className="text-sm text-gray-400">{t('guide.noArticles')}</p>
                     )}
                  </div>
               </section>

               {/* City Rankings */}
               <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">
                     {t('guide.recommendCity')}
                   </h3>
                   <div className="space-y-4">
                      {recommendedCities.map((city, i) => (
                        <Link key={city.id} to={`/${langPrefix}/cities/${city.id}`} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-all">
                          <div className="flex items-center gap-3">
                             <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 grayscale-[0.5] group-hover:grayscale-0 transition-all border border-gray-100">
                                <img src={city.listCover || city.heroImage} alt={getTranslatedValue(city.name, city.enName)} className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-gray-700 leading-none mb-1">{getTranslatedValue(city.name, city.enName)}</h4>
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">{getTranslatedValue(city.enName, city.name)}</span>
                             </div>
                          </div>
                          <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-1 rounded-full">{city.stats?.recommended || 0} {t('city.stats.recommended')}</span>
                        </Link>
                      ))}
                   </div>
               </section>
            </div>
         </div>
      </section>
    </div>
  );
}
