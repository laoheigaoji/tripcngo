import React, { useState, useRef } from 'react';
import { CityData } from '../types/city';
import { X, Loader2, Sparkles, Save, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

const geminiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiKey || "" });

interface CityFormProps {
  city?: CityData | null;
  onClose: () => void;
  onSave: (city: CityData) => void;
}

export default function CityForm({ city, onClose, onSave }: CityFormProps) {
  const [formData, setFormData] = useState<CityData>(city || {
    id: '',
    name: '',
    enName: '',
    heroImage: '',
    tags: [],
    paragraphs: [],
    enParagraphs: [],
    stats: { wantToVisit: 0, recommended: 0 },
    info: { area: '', population: '' },
    bestTravelTime: { strongText: '', enStrongText: '', paragraphs: [], enParagraphs: [] },
    history: [],
    attractions: [],
    transportation: [],
    food: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File, folder: string) => {
    setUploading(true);
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (err) {
      console.error(err);
      alert('上传失败');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleFileUpload(file, 'city_covers');
    if (url) updateFormData('heroImage', url);
  };

  const proxyImageToStorage = async (url: string, path: string) => {
    if (!url || !url.startsWith('http')) return url;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, blob);
      return await getDownloadURL(snapshot.ref);
    } catch (e) {
      console.warn("Failed to proxy image via direct fetch:", url, e);
      try {
        const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        const blob = await res.blob();
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, blob);
        return await getDownloadURL(snapshot.ref);
      } catch (e2) {
        return url; 
      }
    }
  };

  const handleGenerate = async () => {
    if (!formData.name) {
      alert('请输入城市名称');
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `Generate detailed, comprehensive city information for the city: '${formData.name}'. 
      IMPORTANT: The intro 'paragraphs' and 'bestTravelTime.paragraphs' should be VERY detailed, aiming for around 550 characters/words per section to provide a rich guide.
      Return a JSON object that matches the following TypeScript structure exactly. 
      Ensure ALL text fields (descriptions, titles, paragraphs, etc.) are provided in BOTH Chinese and English.
      IMPORTANT: For 'heroImage', 'attractions.imageUrl', and 'food.imageUrl', provide high-quality Unsplash image URLs (e.g. https://images.unsplash.com/photo-...).

      Structure: {
        name: string,
        enName: string,
        heroImage: string,
        tags: [{text: string, enText: string, color: string}],
        paragraphs: string[],
        enParagraphs: string[],
        stats: {wantToVisit: number, recommended: number},
        info: {area: string, population: string},
        bestTravelTime: {strongText: string, enStrongText: string, paragraphs: string[], enParagraphs: string[]},
        history: [{year: string, enYear: string, title: string, enTitle: string, desc: string, enDesc: string}],
        attractions: [{name: string, enName: string, desc: string, enDesc: string, price: string, enPrice: string, season: string, enSeason: string, time: string, enTime: string, imageUrl: string}],
        transportation: [{iconName: "Plane", title: string, enTitle: string, desc: string, enDesc: string, price: string, enPrice: string}],
        food: [{name: string, enName: string, pinyin: string, price: string, desc: string, enDesc: string, ingredients: string, enIngredients: string, imageIdx: number, imageUrl: string}]
      }
      Respond ONLY with the raw JSON object.`;
      
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      const responseText = res.text || '{}';
      
      // Clean up response: remove markdown formatting and try to extract JSON object
      const cleanJSON = (text: string) => {
        let jsonString = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        const start = jsonString.indexOf('{');
        const end = jsonString.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          jsonString = jsonString.substring(start, end + 1);
        }
        return jsonString;
      };

      const data = JSON.parse(cleanJSON(responseText));
      
      // Proxy images to storage
      if (data.heroImage) {
        data.heroImage = await proxyImageToStorage(data.heroImage, `city_covers/${Date.now()}-${formData.name}-hero.jpg`);
      }
      if (data.attractions) {
        for (const attr of data.attractions) {
          if (attr.imageUrl) {
            attr.imageUrl = await proxyImageToStorage(attr.imageUrl, `attractions/${Date.now()}-${formData.name}-${attr.name}.jpg`);
          }
        }
      }
      if (data.food) {
        for (const f of data.food) {
          if (f.imageUrl) {
            f.imageUrl = await proxyImageToStorage(f.imageUrl, `food/${Date.now()}-${formData.name}-${f.name}.jpg`);
          }
        }
      }

      setFormData(prev => ({ ...prev, ...data, id: prev.id }));
    } catch (err) {
      console.error(err);
      alert('生成失败: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFormData = (key: keyof CityData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-4">
            <input value={formData.name} onChange={e => updateFormData('name', e.target.value)} placeholder="中文名称" className="w-full p-2 border rounded" />
            <input value={formData.enName} onChange={e => updateFormData('enName', e.target.value)} placeholder="英文名称" className="w-full p-2 border rounded" />
            <div className="flex gap-2">
               <input value={formData.heroImage} onChange={e => updateFormData('heroImage', e.target.value)} placeholder="主图链接" className="w-full p-2 border rounded" />
               <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 border rounded bg-gray-100">
                 {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
               </button>
               <input type="file" ref={fileInputRef} onChange={handleHeroImageUpload} className="hidden" accept="image/*" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-4">
             <textarea value={formData.paragraphs.join('\n')} onChange={e => updateFormData('paragraphs', e.target.value.split('\n'))} placeholder="简介 (每行一个段落)" className="w-full p-2 border rounded h-32" />
             <textarea value={formData.enParagraphs?.join('\n')} onChange={e => updateFormData('enParagraphs', e.target.value.split('\n'))} placeholder="EN Intro (one paragraph per line)" className="w-full p-2 border rounded h-32" />
          </div>
        );
      case 'bestTime':
        return (
          <div className="space-y-4">
             <input value={formData.bestTravelTime.strongText} onChange={e => setFormData({...formData, bestTravelTime: {...formData.bestTravelTime, strongText: e.target.value}})} placeholder="最佳旅行时间重点" className="w-full p-2 border rounded" />
            <textarea value={formData.bestTravelTime.paragraphs.join('\n')} onChange={e => setFormData({...formData, bestTravelTime: {...formData.bestTravelTime, paragraphs: e.target.value.split('\n')}})} placeholder="最佳时间说明 (每行段落)" className="w-full p-2 border rounded h-24" />
          </div>
        );
      case 'attractions':
        return (
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold">景点 ({formData.attractions.length})</h3>
               <button 
                 type="button"
                 onClick={() => {
                   const newAttr = { name: '', enName: '', desc: '', enDesc: '', price: '免费', enPrice: 'Free', season: '全年', enSeason: 'All Year', time: '1-2小时', enTime: '1-2 Hours', imageUrl: '' };
                   updateFormData('attractions', [...formData.attractions, newAttr]);
                 }}
                 className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 + 添加景点
               </button>
             </div>
             {formData.attractions.map((attr, idx) => (
                <div key={idx} className="p-4 border rounded space-y-2 relative group-item">
                   <button 
                     type="button"
                     onClick={() => updateFormData('attractions', formData.attractions.filter((_, i) => i !== idx))}
                     className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                   >
                     <X className="w-4 h-4" />
                   </button>
                   <div className="grid grid-cols-2 gap-2">
                     <input value={attr.name} onChange={e => {
                       const newAttractions = [...formData.attractions];
                       newAttractions[idx].name = e.target.value;
                       updateFormData('attractions', newAttractions);
                     }} placeholder="景点名称 (CN)" className="w-full p-2 border rounded" />
                     <input value={attr.enName} onChange={e => {
                       const newAttractions = [...formData.attractions];
                       newAttractions[idx].enName = e.target.value;
                       updateFormData('attractions', newAttractions);
                     }} placeholder="景点名称 (EN)" className="w-full p-2 border rounded" />
                   </div>
                   <textarea value={attr.desc} onChange={e => {
                     const newAttractions = [...formData.attractions];
                     newAttractions[idx].desc = e.target.value;
                     updateFormData('attractions', newAttractions);
                   }} placeholder="景点描述 (CN)" className="w-full p-2 border rounded h-20" />
                   <textarea value={attr.enDesc} onChange={e => {
                     const newAttractions = [...formData.attractions];
                     newAttractions[idx].enDesc = e.target.value;
                     updateFormData('attractions', newAttractions);
                   }} placeholder="景点描述 (EN)" className="w-full p-2 border rounded h-20" />
                   <div className="flex gap-2">
                       <input value={attr.imageUrl || ''} onChange={e => {
                         const newAttractions = [...formData.attractions];
                         newAttractions[idx].imageUrl = e.target.value;
                         updateFormData('attractions', newAttractions);
                       }} placeholder="景点图片链接" className="w-full p-2 border rounded" />
                       <input type="file" onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if(file) {
                             const url = await handleFileUpload(file, 'attractions');
                             if(url) {
                               const newAttractions = [...formData.attractions];
                               newAttractions[idx].imageUrl = url;
                               updateFormData('attractions', newAttractions);
                             }
                           }
                       }} className="hidden" id={`attr-img-${idx}`} accept="image/*" />
                       <label htmlFor={`attr-img-${idx}`} className="p-2 border rounded bg-gray-100 cursor-pointer">
                         {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                       </label>
                   </div>
                </div>
             ))}
           </div>
        );
      case 'history':
         return (
           <div className="space-y-4">
             <div className="flex justify-between items-center">
               <h3 className="font-bold">历史 ({formData.history.length})</h3>
               <button 
                 type="button"
                 onClick={() => {
                   const newHistory = { year: '', enYear: '', title: '', enTitle: '', desc: '', enDesc: '' };
                   updateFormData('history', [...formData.history, newHistory]);
                 }}
                 className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
               >
                 + 添加历史节点
               </button>
             </div>
             {formData.history.map((h, idx) => (
                <div key={idx} className="p-4 border rounded space-y-2 relative">
                   <button 
                     type="button"
                     onClick={() => updateFormData('history', formData.history.filter((_, i) => i !== idx))}
                     className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                   >
                     <X className="w-4 h-4" />
                   </button>
                   <div className="grid grid-cols-2 gap-2">
                     <input value={h.year} onChange={e => {
                       const newHistory = [...formData.history];
                       newHistory[idx].year = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder="年份 (如 1949)" className="w-full p-2 border rounded" />
                     <input value={h.enYear} onChange={e => {
                       const newHistory = [...formData.history];
                       newHistory[idx].enYear = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder="Year (e.g. 1949)" className="w-full p-2 border rounded" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     <input value={h.title} onChange={e => {
                       const newHistory = [...formData.history];
                       newHistory[idx].title = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder="标题 (CN)" className="w-full p-2 border rounded" />
                     <input value={h.enTitle} onChange={e => {
                       const newHistory = [...formData.history];
                       newHistory[idx].enTitle = e.target.value;
                       updateFormData('history', newHistory);
                     }} placeholder="Title (EN)" className="w-full p-2 border rounded" />
                   </div>
                   <textarea value={h.desc} onChange={e => {
                     const newHistory = [...formData.history];
                     newHistory[idx].desc = e.target.value;
                     updateFormData('history', newHistory);
                   }} placeholder="历史描述 (CN)" className="w-full p-2 border rounded h-20" />
                   <textarea value={h.enDesc} onChange={e => {
                     const newHistory = [...formData.history];
                     newHistory[idx].enDesc = e.target.value;
                     updateFormData('history', newHistory);
                   }} placeholder="History Description (EN)" className="w-full p-2 border rounded h-20" />
                </div>
             ))}
           </div>
        );
      case 'food':
         return (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">美食 ({formData.food.length})</h3>
                <button 
                  type="button"
                  onClick={() => {
                    const newFood = { name: '', enName: '', pinyin: '', price: '', desc: '', enDesc: '', ingredients: '', enIngredients: '', imageIdx: 0, imageUrl: '' };
                    updateFormData('food', [...formData.food, newFood]);
                  }}
                  className="text-sm bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  + 添加美食
                </button>
              </div>
              {formData.food.map((f, idx) => (
                 <div key={idx} className="p-4 border rounded space-y-2 relative">
                    <button 
                      type="button"
                      onClick={() => updateFormData('food', formData.food.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                      <input value={f.name} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].name = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="美食名称" className="w-full p-2 border rounded" />
                      <input value={f.enName} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].enName = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="English Name" className="w-full p-2 border rounded" />
                      <input value={f.pinyin} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].pinyin = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="Pinyin" className="w-full p-2 border rounded" />
                    </div>
                    <textarea value={f.desc} onChange={e => {
                      const newFood = [...formData.food];
                      newFood[idx].desc = e.target.value;
                      updateFormData('food', newFood);
                    }} placeholder="美食介绍 (CN)" className="w-full p-2 border rounded h-20" />
                    <textarea value={f.enDesc} onChange={e => {
                      const newFood = [...formData.food];
                      newFood[idx].enDesc = e.target.value;
                      updateFormData('food', newFood);
                    }} placeholder="Description (EN)" className="w-full p-2 border rounded h-20" />
                    <div className="flex gap-2">
                      <input value={f.imageUrl || ''} onChange={e => {
                        const newFood = [...formData.food];
                        newFood[idx].imageUrl = e.target.value;
                        updateFormData('food', newFood);
                      }} placeholder="美食图片链接" className="w-full p-2 border rounded" />
                      <input type="file" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if(file) {
                            const url = await handleFileUpload(file, 'food');
                            if(url) {
                              const newFood = [...formData.food];
                              newFood[idx].imageUrl = url;
                              updateFormData('food', newFood);
                            }
                          }
                      }} className="hidden" id={`food-img-${idx}`} accept="image/*" />
                      <label htmlFor={`food-img-${idx}`} className="p-2 border rounded bg-gray-100 cursor-pointer">
                        {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon />}
                      </label>
                    </div>
                 </div>
              ))}
            </div>
         );
      default:
        return <div className="p-4 text-gray-500">内容待填充...</div>;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{city ? '编辑城市' : '新增城市'}</h2>
          <button onClick={onClose}><X /></button>
        </div>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
           {[
             { id: 'basic', label: '基础信息' },
             { id: 'text', label: '简介' },
             { id: 'bestTime', label: '最佳旅游时间' },
             { id: 'attractions', label: '景点' },
             { id: 'history', label: '历史' },
             { id: 'food', label: '美食' }
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap ${activeTab === tab.id ? 'bg-[#1b887a] text-white' : 'bg-gray-100'}`}>{tab.label}</button>
           ))}
        </div>

        {renderSection()}
        
        <div className="flex gap-4 mt-8">
            <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold"
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} 
                AI智能生成
            </button>
            <button 
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-black"
            >
            <Save className="inline mr-2" /> 保存城市
            </button>
        </div>
      </div>
    </div>
  );
}
