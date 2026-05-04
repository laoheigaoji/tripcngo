import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Clock, Navigation, Map, CloudRain, Sun, Cloud, Calendar, Building2, Users, MapPin, Tag, ArrowRight, Star, Plane, TrainFront, BusFront, Car, Bike, Train, Ship } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import WeatherWidget from '../../components/WeatherWidget';

const iconMap: Record<string, React.ElementType> = {
  Plane, TrainFront, BusFront, Car, Bike, Train, Ship
};

export default function CityDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check local storage for previous votes
    if (id) {
      const wantToVisit = localStorage.getItem(`voted_want_${id}`);
      const recommended = localStorage.getItem(`voted_rec_${id}`);
      setVoted({
        wantToVisit: !!wantToVisit,
        recommended: !!recommended
      });
    }
  }, [id]);

  useEffect(() => {
    const fetchCity = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'cities', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCity({ ...docSnap.data(), id: docSnap.id });
        } else {
          console.warn("No such city with id:", id);
        }
      } catch (err) {
        console.error("Error fetching city:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCity();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!city) return <Navigate to="/cities" replace />;

  const getTranslatedValue = (zh: any, en: any) => {
    if (isEn && en) return en;
    return zh;
  };

  const handleStatsUpdate = async (field: 'wantToVisit' | 'recommended') => {
    if (!id || !city) return;
    
    const storageKey = field === 'wantToVisit' ? `voted_want_${id}` : `voted_rec_${id}`;
    if (localStorage.getItem(storageKey)) return;

    try {
      // Optimistic update
      setCity((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          [field]: (prev.stats[field] || 0) + 1
        }
      }));
      setVoted(prev => ({ ...prev, [field]: true }));
      localStorage.setItem(storageKey, 'true');

      const docRef = doc(db, 'cities', id);
      await updateDoc(docRef, {
        [`stats.${field}`]: increment(1)
      });
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      // Revert if failed
      setVoted(prev => ({ ...prev, [field]: false }));
      localStorage.removeItem(storageKey);
      // We'd ideally re-fetch or revert state here
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title={isEn ? city.enName : city.name}
        description={getTranslatedValue(city.paragraphs[0], city.enParagraphs && city.enParagraphs[0])}
        keywords={`${isEn ? city.enName : city.name}, 中国旅游城市, ${isEn ? 'Travel' : '旅游'}`}
        image={city.heroImage}
      />
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={city.heroImage}
            alt={city.enName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="col-span-1 lg:col-span-2 text-white">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  {isEn ? city.enName : city.name} {!isEn && <span className="text-white/60 font-medium text-2xl md:text-3xl ml-2">{city.enName}</span>}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {city.tags.map((tag, idx) => (
                    <span key={idx} className="px-5 py-2 bg-[#e6f4ea] text-[#1b887a] rounded-full text-xs font-black shadow-sm border border-[#1b887a]/10 tracking-widest uppercase">
                      {getTranslatedValue(tag.text, tag.enText)}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6 text-white/90 text-base md:text-lg leading-relaxed max-w-4xl">
                {(isEn && city.enParagraphs ? city.enParagraphs : city.paragraphs).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-10">
                <button 
                  onClick={() => handleStatsUpdate('wantToVisit')}
                  disabled={voted.wantToVisit}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-lg ${
                    voted.wantToVisit 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Star className={`w-4 h-4 ${voted.wantToVisit ? 'fill-current' : ''}`} />
                  <span>{voted.wantToVisit ? (isEn ? 'Added to Wishlist' : '已在想去清单') : t('city.stats.wantToVisit')}</span> 
                  <span className="bg-black/20 px-2 py-0.5 rounded-lg text-xs">{city.stats.wantToVisit}</span>
                </button>
                <button 
                  onClick={() => handleStatsUpdate('recommended')}
                  disabled={voted.recommended}
                  className={`px-6 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-3 shadow-lg ${
                    voted.recommended 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-default' 
                    : 'bg-blue-500 text-white hover:bg-blue-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Tag className={`w-4 h-4 ${voted.recommended ? 'fill-current' : ''}`} />
                  <span>{voted.recommended ? (isEn ? 'Recommended' : '已推荐给他人') : t('city.stats.recommended')}</span> 
                  <span className="bg-black/20 px-2 py-0.5 rounded-lg text-xs">{city.stats.recommended}</span>
                </button>
              </div>
            </div>

            {/* Weather / Info Card */}
            <div className="col-span-1 border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl">
              <WeatherWidget cityName={city.name} enCityName={city.enName} isEn={isEn} />

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div className="text-center">
                  <MapPin className="w-5 h-5 mx-auto text-white/50 mb-2" />
                  <div className="text-xs text-white/50">{t('city.weather.area')}</div>
                  <div className="font-semibold text-lg">{city.info.area}</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 mx-auto text-white/50 mb-2" />
                  <div className="text-xs text-white/50">{t('city.weather.population')}</div>
                  <div className="font-semibold text-lg">{city.info.population}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Travel Time & History Section */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Travel Time */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                {getTranslatedValue(city.name, city.enName)}{t('city.bestTime.title')}
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
                <div className="absolute top-0 left-8 -translate-y-1/2 text-6xl text-gray-100 font-serif leading-none">"</div>
                <p className="text-lg text-gray-700 leading-relaxed font-medium mb-4 relative z-10">
                  {t('city.bestTime.descPrefix')}{getTranslatedValue(city.name, city.enName)}{t('city.bestTime.descSuffix')}
                  <strong className="text-gray-900 font-bold ml-1">
                    {getTranslatedValue(city.bestTravelTime.strongText, city.bestTravelTime.enStrongText)}
                  </strong>.
                </p>
                {(isEn && city.bestTravelTime.enParagraphs ? city.bestTravelTime.enParagraphs : city.bestTravelTime.paragraphs).map((p, idx) => (
                  <p key={idx} className="text-gray-600 leading-relaxed mb-4 relative z-10">
                    {p}
                  </p>
                ))}
                <div className="absolute bottom-0 right-8 translate-y-1/2 text-6xl text-gray-100 font-serif leading-none rotate-180">"</div>
              </div>
            </div>

            {/* History */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight text-center md:text-left">
                {getTranslatedValue(city.name, city.enName)}{t('city.history.title')}
              </h2>
              <div className="relative border-l-2 border-green-100 pl-8 space-y-8 pb-4">
                {city.history.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="text-sm font-semibold text-green-600 mb-1">{getTranslatedValue(item.year, item.enYear)}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{getTranslatedValue(item.title, item.enTitle)}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{getTranslatedValue(item.desc, item.enDesc)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Attractions Section */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getTranslatedValue(city.name, city.enName)}{t('city.attractions.title')}</h2>
            <p className="text-gray-500">{t('city.attractions.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {city.attractions.map((spot, idx) => (
              <div key={idx} className="bg-white border text-left border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#e6f4ea] opacity-30"></div>
                  <img src={spot.imageUrl || `https://images.unsplash.com/photo-1540202403-b712e0e026ee?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={spot.name} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute z-10 font-bold text-gray-300/80 text-xl tracking-wider flex items-center gap-2">
                    <span className="text-green-700/60">tripcngo</span>
                    <span className="text-gray-500/60">.com</span>
                  </div>
                  {spot.rating && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                        {spot.rating}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{isEn ? spot.enName : spot.name}</h3>
                  {!isEn && <div className="text-xs text-gray-400 mb-3 truncate font-medium">{spot.enName}</div>}
                  <p className="text-sm text-green-700 mb-5 line-clamp-2 leading-relaxed flex-grow">{getTranslatedValue(spot.desc, spot.enDesc)}</p>
                  
                  <div className="space-y-2 text-xs text-gray-500 border-t border-gray-100 pt-4 font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-blue-500" />
                      <span>{t('city.attractions.ticket')} {getTranslatedValue(spot.price, spot.enPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span>{t('city.attractions.season')}: {getTranslatedValue(spot.season, spot.enSeason)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>{t('city.attractions.time')}: {getTranslatedValue(spot.time, spot.enTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optional World Heritage Section */}
      {city.worldHeritage && city.worldHeritage.length > 0 && (
        <div className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getTranslatedValue(city.name, city.enName)}{t('city.heritage.world.title')}</h2>
              <p className="text-gray-500">{t('city.heritage.world.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {city.worldHeritage.map((heritage, idx) => (
                <div key={idx} className="relative h-64 rounded-xl overflow-hidden group cursor-pointer text-left">
                  <img src={`https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=600&q=80&auto=format&fit=crop&random=${idx}`} alt={heritage.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {getTranslatedValue(heritage.year, heritage.enYear)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{getTranslatedValue(heritage.name, heritage.enName)}</h3>
                    <p className="text-white/80 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">{getTranslatedValue(heritage.desc, heritage.enDesc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optional Intangible Cultural Heritage */}
      {city.intangibleHeritage && city.intangibleHeritage.length > 0 && (
        <div className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getTranslatedValue(city.name, city.enName)}{t('city.heritage.intangible.title')}</h2>
              <p className="text-gray-500">{t('city.heritage.intangible.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {city.intangibleHeritage.map((item, idx) => (
                <div key={idx} className={`${idx === 2 && city.intangibleHeritage!.length === 3 ? 'md:col-span-2' : ''} bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow`}>
                  <div className={`w-full ${idx === 2 && city.intangibleHeritage!.length === 3 ? 'md:w-1/4' : 'md:w-1/3'} flex-shrink-0 h-40`}>
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{getTranslatedValue(item.name, item.enName)}</h3>
                    <div className="text-xs text-gray-400 mb-3">{getTranslatedValue(item.year, item.enYear)}</div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {getTranslatedValue(item.desc, item.enDesc)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transportation Section */}
      <div className="py-16 bg-white border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getTranslatedValue(city.name, city.enName)}{t('city.transport.title')}</h2>
            <p className="text-gray-500">{t('city.transport.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {city.transportation.map((item, idx) => {
              const Icon = iconMap[item.iconName] || Navigation;
              return (
                <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{getTranslatedValue(item.title, item.enTitle)}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">{getTranslatedValue(item.desc, item.enDesc)}</p>
                  <p className="text-sm text-gray-500 font-medium">{getTranslatedValue(item.price, item.enPrice)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Food Section */}
      <div className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">{getTranslatedValue(city.name, city.enName)}{t('city.food.title')}</h2>
            <p className="text-gray-500">{t('city.food.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {city.food.map((food, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-5 hover:shadow-md transition-shadow">
                <div className="w-32 h-32 flex-shrink-0">
                  <img src={food.imageUrl || `https://images.unsplash.com/photo-1544025162-811c75c82de1?w=400&q=80&auto=format&fit=crop&random=${food.imageIdx}`} alt={food.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 inline-block mr-2">{getTranslatedValue(food.name, food.enName)}</h3>
                      <span className="text-xs text-gray-400 font-serif italic">{food.pinyin}</span>
                    </div>
                    <span className="text-green-600 font-semibold">{food.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{getTranslatedValue(food.desc, food.enDesc)}</p>
                  <div className="text-xs text-gray-500 mt-auto w-full border-t border-gray-50 pt-2">
                    <strong className="text-gray-700">{t('city.food.ingredients')}: </strong>
                    <span className="line-clamp-1">{getTranslatedValue(food.ingredients, food.enIngredients)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explore Deeper */}
      <div className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">{t('city.explore.title')}</h2>
          <div className="space-y-4">
            {[
              { id: 'travel', title: t('city.explore.travel') },
              { id: 'hotels', title: t('city.explore.hotels') },
              { id: 'tools', title: t('city.explore.tools') }
            ].map((item) => (
              <button key={item.id} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 text-left cursor-pointer">
                <span className="text-gray-800 font-medium">{item.title}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
