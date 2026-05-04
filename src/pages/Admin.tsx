import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, LogOut, ChevronRight, Save, Image as ImageIcon, Filter, FileText, Languages, Building2 } from 'lucide-react';
import Markdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import TurndownService from 'turndown';
import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { generateCityData, askDeepSeek } from '../lib/deepseek';
import { CityData } from '../types/city';
import { citiesData } from '../data/citiesData';
import CityForm from '../components/CityForm';

const categoryMap: Record<string, string> = {
  'National Policy': '国家政策',
  'Payment Methods': '支付方式',
  'Transportation': '交通出行',
  'Practical Tools': '实用工具',
  'City Guide': '城市指南',
  'Tradition': '民俗传统',
  'Food Culture': '饮食文化'
};

const filterCategoryMap: Record<string, string> = {
  'All': '全部',
  ...categoryMap
};

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  category: string;
  createdAt: string;
  content: string;
  contentEn?: string;
  thumbnail?: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    subtitle: '',
    subtitleEn: '',
    content: '',
    contentEn: '',
    thumbnail: '',
    category: 'National Policy'
  });
  const [showForm, setShowForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [editingCity, setEditingCity] = useState<CityData | null>(null);
  const [activeAdminView, setActiveAdminView] = useState<'articles' | 'cities'>('articles');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [articleSearchTerm, setArticleSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [cityBatchInput, setCityBatchInput] = useState('');
  const [cityBatchStatus, setCityBatchStatus] = useState('');
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const cleanJSON = (text: string) => {
    let jsonString = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const start = jsonString.indexOf('{');
    const end = jsonString.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      jsonString = jsonString.substring(start, end + 1);
    }
    return jsonString;
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

  const handleBatchGenerate = async () => {
    const citiesToGen = cityBatchInput.split('\n').map(c => c.trim()).filter(c => c);
    if(citiesToGen.length === 0) return;

    setIsBatchGenerating(true);
    setCityBatchStatus(`正在启动: 0/${citiesToGen.length}`);

    for (let i = 0; i < citiesToGen.length; i++) {
        const cityName = citiesToGen[i];
        setCityBatchStatus(`AI 正在智能生成深度内容: ${cityName} (${i+1}/${citiesToGen.length})`);
        
        try {
            const prompt = `You are a world-class travel curator. Generates a deep, high-value city guide for '${cityName}' in China.
                Output requirements:
                - Comprehensive introduction (paragraphs & enParagraphs), MUST be exactly 4 distinct paragraphs:
                    1. Geographical location and climate (approx 100 words).
                    2. Historical significance and unique city charm (approx 100 words).
                    3. Cultural atmosphere, food specialties, and local lifestyle (approx 100 words).
                    4. Modern development, international standing, and future vision (approx 100 words).
                - Best Travel Time (bestTravelTime.paragraphs & enParagraphs), MUST be exactly 3 distinct paragraphs:
                    1. Detailed description of the best months and why they are recommended.
                    2. Comprehensive guide for visiting in Spring (specific weather, recommended parks/scenes).
                    3. Comprehensive guide for visiting in Autumn (weather conditions, key activities/festivals).
                - Comprehensiveness Requirements:
                    - Attractions: Provide 10-12 major attractions, covering historical, cultural, and modern sites.
                    - Food: Provide 10-12 local specialties, including main dishes, street foods, and traditional desserts.
                    - Transportation: Provide a highly detailed guide for Plane, Train, and Bus/Local Metro.
                    - History: Provide 5-6 key historical milestones.
                - Every field must have its corresponding 'en' field filled.
                - CRITICAL: Primary fields (without 'en' prefix, e.g., 'paragraphs') MUST contain ONLY Chinese content.
                - 'en' prefixed fields (e.g., 'enParagraphs') MUST contain ONLY English content.
                - DO NOT mix both languages in a single field.
                - DO NOT provide any image URLs. Leave heroImage, listCover, and all imageUrl fields as empty strings.
                - Realistic tourism statistics.

                Format: {
                  name: string,
                  enName: string,
                  paragraphs: string[],
                  enParagraphs: string[],
                  tags: [{text: string, enText: string, color: string}],
                  info: {area: string, population: string},
                  stats: {wantToVisit: number, recommended: number},
                  bestTravelTime: {strongText: string, enStrongText: string, paragraphs: string[], enParagraphs: string[]},
                  history: [{year: string, enYear: string, title: string, enTitle: string, desc: string, enDesc: string}],
                  attractions: [{name: string, enName: string, desc: string, enDesc: string, price: string, enPrice: string, season: string, enSeason: string, time: string, enTime: string}],
                  transportation: [{iconName: "Plane"|"Train"|"Bus", title: string, enTitle: string, desc: string, enDesc: string, price: string, enPrice: string}],
                  food: [{name: string, enName: string, pinyin: string, price: string, desc: string, enDesc: string, ingredients: string, enIngredients: string}]
                }`;
            
            const responseText = await generateCityData(prompt);
            const data = JSON.parse(cleanJSON(responseText || '{}'));

            const newDocRef = doc(collection(db, 'cities'));
            await setDoc(newDocRef, { ...data, id: newDocRef.id, createdAt: serverTimestamp() });
        } catch (err) {
            console.error(`Batch failed for ${cityName}:`, err);
        }
    }
    setCityBatchStatus('批量生成完成！');
    fetchCities();
    
    setCityBatchStatus("全部生成并转存完成！");
    setIsBatchGenerating(false);
    setCityBatchInput('');
    fetchCities();
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const turndownService = new TurndownService();

  const handleHtmlPaste = () => {
    const html = prompt('请粘贴文章HTML内容：');
    if (html) {
      const markdown = turndownService.turndown(html);
      setFormData({ ...formData, content: markdown });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `articles/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      const markdownImage = `\n![图片描述](${url})\n`;
      const targetField = activeTab === 'zh' ? 'content' : 'contentEn';
      setFormData(prev => ({ ...prev, [targetField]: prev[targetField as keyof typeof formData] + markdownImage }));
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("上传图片失败");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setLoading(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>, field: 'content' | 'contentEn') => {
    const items = e.clipboardData?.items;
    const isHtml = e.clipboardData?.types.includes('text/html');
    const html = e.clipboardData?.getData('text/html');
    const plainText = e.clipboardData?.getData('text/plain');

    const imageFiles: File[] = [];
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length === 0 && !isHtml) {
      return; // Fallback to default textarea handling for plain text
    }

    e.preventDefault();

    const target = e.target as HTMLTextAreaElement;
    const startPos = target.selectionStart !== undefined ? target.selectionStart : formData[field].length;
    const endPos = target.selectionEnd !== undefined ? target.selectionEnd : formData[field].length;

    const insertText = (textToInsert: string) => {
      setFormData(prev => {
        const currentText = (prev[field] as string) || '';
        const newText = currentText.substring(0, startPos) + textToInsert + currentText.substring(endPos);
        
        setTimeout(() => {
          target.focus();
          target.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length);
        }, 10);
        
        return { ...prev, [field]: newText };
      });
    };

    if (imageFiles.length > 0) {
      const placeholders = [];
      const tasks = [];
      
      for (const file of imageFiles) {
        const id = `![⏳ 正在上传图片中... (Uploading...)](${Math.random().toString(36).substring(7)})\n`;
        placeholders.push(id);
        tasks.push({ file, id });
      }
      
      insertText(placeholders.join(''));
      
      (async () => {
        setUploadingImages(prev => prev + 1);
        for (const task of tasks) {
          try {
            const storageRef = ref(storage, `articles/${Date.now()}-${task.file.name || 'image.png'}`);
            const snapshot = await uploadBytes(storageRef, task.file);
            const url = await getDownloadURL(snapshot.ref);
            setFormData(prev => ({
               ...prev,
               [field]: ((prev[field] as string) || '').split(task.id).join(`![图片](${url})\n`)
            }));
          } catch (err) {
            console.error("Error uploading image:", err);
            setFormData(prev => ({
               ...prev,
               [field]: ((prev[field] as string) || '').split(task.id).join(`![图片上传失败]()\n`)
            }));
          }
        }
        setUploadingImages(prev => prev - 1);
      })();
      return;
    }

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const images = Array.from(doc.querySelectorAll('img')).filter(img => img.src);
      
      const imageTasks: { uuid: string; src: string; actualSrc: string }[] = [];
      
      images.forEach(img => {
        const src = img.src;
        let actualSrc = src;
        if (src.includes('_next/image?url=')) {
          const urlMatch = src.match(/url=([^&]+)/);
          if (urlMatch && urlMatch[1]) {
            actualSrc = decodeURIComponent(urlMatch[1]);
          }
        }
        
        if (actualSrc.includes('firebasestorage.googleapis.com')) {
           return; // skip already uploaded
        }

        const uuid = `__UPLOADING_${Math.random().toString(36).substring(7)}__`;
        imageTasks.push({ uuid, src, actualSrc });
        // Set placeholder image for the visual before upload completes
        img.src = `https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`;
        img.alt = uuid;
      });

      try {
        const initialMarkdown = turndownService.turndown(doc.body.innerHTML);
        insertText(initialMarkdown);
      } catch (err) {
        console.error("Turndown error", err);
        if (plainText) insertText(plainText);
        return;
      }

      if (imageTasks.length > 0) {
        (async () => {
          setUploadingImages(prev => prev + 1);
          for (const task of imageTasks) {
            try {
              let blob: Blob;
              if (task.actualSrc.startsWith('data:')) {
                const res = await fetch(task.actualSrc);
                blob = await res.blob();
              } else {
                try {
                  const res = await fetch(task.actualSrc);
                  if (!res.ok) throw new Error('Network error');
                  blob = await res.blob();
                } catch (fetchErr) {
                  try {
                    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(task.actualSrc)}`;
                    const proxyRes = await fetch(proxyUrl);
                    if (!proxyRes.ok) throw new Error('Proxy 1 failed');
                    blob = await proxyRes.blob();
                  } catch (proxy1Err) {
                    try {
                      const proxyUrl2 = `https://corsproxy.io/?${encodeURIComponent(task.actualSrc)}`;
                      const proxyRes2 = await fetch(proxyUrl2);
                      if (!proxyRes2.ok) throw new Error('Proxy 2 failed');
                      blob = await proxyRes2.blob();
                    } catch (proxy2Err) {
                      const proxyUrl3 = `https://api.allorigins.win/raw?url=${encodeURIComponent(task.actualSrc)}`;
                      const proxyRes3 = await fetch(proxyUrl3);
                      blob = await proxyRes3.blob();
                    }
                  }
                }
              }

              const fileName = `paste-html-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
              const storageRef = ref(storage, `articles/${fileName}`);
              const snapshot = await uploadBytes(storageRef, blob);
              const url = await getDownloadURL(snapshot.ref);
              
              setFormData(prev => {
                const currentText = prev[field] as string;
                // turndown uses the alt attribute if available, or just the url.
                // We're replacing the placeholder URL with the actual URL.
                return {
                  ...prev,
                  [field]: currentText.replace(`https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`, url).replace(task.uuid, '图片')
                };
              });
            } catch (err) {
              console.warn("无法转存图片", task.src);
              setFormData(prev => {
                const currentText = prev[field] as string;
                return {
                  ...prev,
                  [field]: currentText.replace(`https://placehold.co/600x400/1b887a/FFFFFF?text=Uploading...`, task.actualSrc).replace(task.uuid, '图片')
                };
              });
            }
          }
          setUploadingImages(prev => prev - 1);
        })();
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, thumbnail: url }));
    } catch (err) {
      console.error("Error uploading thumbnail:", err);
      alert("上传封面图失败");
    } finally {
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      setLoading(false);
    }
  };

  const handleThumbnailPaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;

        setLoading(true);
        const storageRef = ref(storage, `thumbnails/${Date.now()}-${file.name || 'image.png'}`);
        
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          setFormData(prev => ({ ...prev, thumbnail: url }));
        } catch (err) {
          console.error("Error uploading pasted image:", err);
          alert("上传粘贴图片失败");
        } finally {
          setLoading(false);
        }
        return;
      }
    }
  };

  const handleAutoTranslate = async () => {
    if (!formData.title && !formData.subtitle && !formData.content) {
      alert('请先填写中文内容');
      return;
    }
    
    setLoading(true);
    try {
      let titleEnExp = '';
      let subtitleEnExp = '';
      let contentEnExp = '';

      if (formData.title) {
        titleEnExp = await askDeepSeek(`Translate the following Chinese article title to English. Only output the translated text:\n\n${formData.title}`);
      }

      if (formData.subtitle) {
        subtitleEnExp = await askDeepSeek(`Translate the following Chinese article subtitle to English. Only output the translated text:\n\n${formData.subtitle}`);
      }

      if (formData.content) {
        contentEnExp = await askDeepSeek(`Translate the following Chinese markdown content to English. Preserve all markdown formatting, links, and image syntactic structures exactly as they are. Output only the translated markdown:\n\n${formData.content}`);
      }

      setFormData(prev => ({
        ...prev,
        titleEn: titleEnExp,
        subtitleEn: subtitleEnExp,
        contentEn: contentEnExp
      }));

    } catch (err) {
      console.error("Translation error", err);
      alert('翻译失败：' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Allow any authenticated user in since there is no public registration
        setUser(currentUser);
        fetchArticles();
        fetchCities();
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error(error);
      alert('账号密码登录失败，请检查账号和密码。');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error(error);
        alert('Google登录失败，请重试。');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setArticles([]);
  };

  const fetchArticles = async () => {
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as Article[];
      setArticles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCities = async () => {
    try {
      const q = query(collection(db, 'cities'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as CityData[];
      setCities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        const articleRef = doc(db, 'articles', editingId);
        await updateDoc(articleRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'articles'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      setFormData({ 
        title: '', 
        titleEn: '', 
        subtitle: '', 
        subtitleEn: '', 
        content: '', 
        contentEn: '', 
        thumbnail: '', 
        category: 'National Policy' 
      });
      setShowForm(false);
      setEditingId(null);
      fetchArticles();
    } catch (error: any) {
      console.error('Firestore Article Error:', error);
      const detailedError = handleFirestoreError(error, editingId ? 'update' : 'create', editingId ? `articles/${editingId}` : 'articles');
      alert('保存失败: ' + detailedError.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!window.confirm('确定删除吗？')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      fetchArticles();
    } catch (error) {
      console.error(error);
      const detailedError = handleFirestoreError(error, 'delete', `articles/${id}`);
      alert('删除失败: ' + detailedError.message);
    }
  };

  const handleFirestoreError = (error: unknown, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
      },
      operationType,
      path
    };
    console.error('Firestore Error Detail:', JSON.stringify(errInfo));
    return new Error(JSON.stringify(errInfo));
  };

  const handleSaveCity = async (cityData: CityData) => {
    setLoading(true);
    const targetId = cityData.id || editingCity?.id;
    const path = targetId ? `cities/${targetId}` : 'cities';
    
    try {
      if (targetId) {
        const cityRef = doc(db, 'cities', targetId);
        await setDoc(cityRef, { ...cityData, id: targetId, updatedAt: serverTimestamp() }, { merge: true });
      } else {
        const newDocRef = doc(collection(db, 'cities'));
        await setDoc(newDocRef, { ...cityData, id: newDocRef.id, createdAt: serverTimestamp() });
      }
      
      setShowCityForm(false);
      setEditingCity(null);
      await fetchCities();
      alert('保存成功');
    } catch (e) {
      console.error("Save city error:", e);
      const detailedError = handleFirestoreError(e, targetId ? 'update' : 'create', path);
      alert('保存失败: ' + detailedError.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCity = async (id: string, name: string) => {
    if (!window.confirm(`确定删除城市 "${name}" 吗？此操作不可撤销。`)) return;
    
    setLoading(true);
    try {
      console.log("Attempting to delete city with id:", id);
      const cityRef = doc(db, 'cities', id);
      await deleteDoc(cityRef);
      console.log("City deleted successfully");
      await fetchCities();
      alert('删除成功');
    } catch (e) {
      console.error("Delete city error:", e);
      let errorMsg = '删除失败';
      if (e instanceof Error) {
        if (e.message.includes('permission-denied')) {
          errorMsg = '权限不足：请确认您已使用管理员账号登录。';
        } else {
          errorMsg += `: ${e.message}`;
        }
      }
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const migrateCities = async () => {
    if (!window.confirm('确定将旧数据导入Firestore？')) return;
    setLoading(true);
    try {
      console.log("Starting migration. Data count:", Object.values(citiesData).length);
      for (const city of Object.values(citiesData)) {
        console.log("Migrating:", city.name, "with ID:", city.id);
        const cityRef = doc(db, 'cities', city.id);
        await setDoc(cityRef, city);
        console.log("Migrated successfully:", city.name);
      }
      alert('迁移完成');
    } catch (e) {
      console.error("Migration error:", e);
      alert('迁移失败: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
      fetchCities();
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title || '',
      titleEn: article.titleEn || '',
      subtitle: article.subtitle || '',
      subtitleEn: article.subtitleEn || '',
      content: article.content || '',
      contentEn: article.contentEn || '',
      thumbnail: article.thumbnail || '',
      category: article.category || 'National Policy'
    });
    setEditingId(article._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = (filterCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === filterCategory)
  ).filter(article => 
    article.title.toLowerCase().includes(articleSearchTerm.toLowerCase()) || 
    (article.subtitle && article.subtitle.toLowerCase().includes(articleSearchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1b887a]/10 text-[#1b887a] rounded-2xl mb-6">
            <LogOut className="w-8 h-8 rotate-180" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">管理员登录</h1>
          <p className="text-gray-500 mb-8 text-sm">请输入账号和密码</p>
          
          <div className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  placeholder="请输入邮箱账号" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all text-left"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input 
                  type="password" 
                  placeholder="请输入密码" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all text-left"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-[#1b887a] text-white rounded-xl font-black text-lg shadow-xl hover:bg-[#166d63] transition-all transform active:scale-[0.98] mt-4"
              >
                账号密码登录
              </button>
            </form>
            
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">或</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-black text-lg shadow-sm hover:bg-gray-50 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              使用 Google 账号登录
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10 hidden md:flex shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Tripcngo</h1>
            <span className="text-[10px] text-gray-400 truncate max-w-[140px]">{user?.email}</span>
          </div>
          <span className="text-[10px] font-bold bg-[#1b887a]/10 text-[#1b887a] px-2 py-1 rounded-full">ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveAdminView('articles'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'articles' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText className="w-5 h-5" /> 内容管理
          </button>
          <button 
            onClick={() => { setActiveAdminView('cities'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeAdminView === 'cities' && !showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Building2 className="w-5 h-5" /> 城市管理
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100 pb-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-5 h-5" /> 退出系统
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
               <h2 className="text-3xl font-black text-gray-900 mb-1">{showForm ? (editingId ? '编辑内容' : '发布新内容') : '内容管理'}</h2>
               <p className="text-gray-500 font-medium">{showForm ? '完善文章信息并发布至前台' : '管理前台展示的文章、指南等内容'}</p>
            </div>
            <div className="flex gap-4">
                <button 
                  onClick={() => {
                    if (showForm) {
                      setEditingId(null);
                      setFormData({ 
                        title: '', 
                        titleEn: '', 
                        subtitle: '', 
                        subtitleEn: '', 
                        content: '', 
                        contentEn: '', 
                        thumbnail: '', 
                        category: 'National Policy' 
                      });
                    }
                    setShowForm(!showForm);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg hover:bg-[#166d63] transition-all"
                >
                  {showForm ? '返回列表' : <><Plus className="w-5 h-5" /> 发布新内容</>}
                </button>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*" 
          />
          <input 
            type="file" 
            ref={thumbnailInputRef} 
            onChange={handleThumbnailUpload} 
            className="hidden" 
            accept="image/*" 
          />

          {showForm ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8"
            >
              <div className="flex gap-4 mb-8 p-1 bg-gray-50 rounded-xl w-fit items-center">
                 <button 
                  type="button"
                  onClick={() => setActiveTab('zh')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'zh' ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   中文内容
                 </button>
                 <button 
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-6 py-2 rounded-lg font-bold transition-all text-sm ${activeTab === 'en' ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   English Content
                 </button>
                 <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-2 transition-colors ml-2"
                 >
                   <Languages className="w-4 h-4" />自动翻译
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className={`space-y-6 animate-in fade-in duration-300 ${activeTab === 'zh' ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">文章标题 (中文)</label>
                        <input 
                          type="text" 
                          required={activeTab === 'zh'}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">分类</label>
                        <select 
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                          {Object.entries(categoryMap).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">副标题 (简述)</label>
                      <textarea 
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                        value={formData.subtitle}
                        onChange={e => setFormData({...formData, subtitle: e.target.value})}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2 px-1">
                        <label className="block text-sm font-bold text-gray-700">正文内容 (Markdown 支持粘贴图片)</label>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()} 
                            className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> 插入图片
                          </button>
                          <button 
                            type="button" 
                            onClick={handleHtmlPaste} 
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 transition-colors"
                          >
                            从 HTML 导入
                          </button>
                        </div>
                      </div>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.content}
                          onChange={(val) => setFormData({...formData, content: val || ''})}
                          height={500}
                          style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 'none' }}
                          textareaProps={{
                            placeholder: '请在此输入正文内容...',
                            onPaste: (e) => handlePaste(e, 'content')
                          }}
                        />
                      </div>
                    </div>
                 </div>

                 <div className={`space-y-6 animate-in fade-in duration-300 ${activeTab === 'en' ? 'block' : 'hidden'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Title (English)</label>
                        <input 
                          type="text" 
                          required={activeTab === 'en'}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                          value={formData.titleEn}
                          onChange={e => setFormData({...formData, titleEn: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <input 
                          disabled
                          className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-gray-400 cursor-not-allowed"
                          value={categoryMap[formData.category] || formData.category}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle (Brief)</label>
                      <textarea 
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                        value={formData.subtitleEn}
                        onChange={e => setFormData({...formData, subtitleEn: e.target.value})}
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2 px-1">
                        <label className="block text-sm font-bold text-gray-700">Content (Markdown)</label>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => { setActiveTab('en'); fileInputRef.current?.click(); }} 
                            className="text-xs flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold text-gray-600 transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> 插入图片
                          </button>
                        </div>
                      </div>
                      <div data-color-mode="light">
                        <MDEditor
                          value={formData.contentEn}
                          onChange={(val) => setFormData({...formData, contentEn: val || ''})}
                          height={500}
                          style={{ borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: 'none' }}
                          textareaProps={{
                            placeholder: 'Type content here...',
                            onPaste: (e) => handlePaste(e, 'contentEn')
                          }}
                        />
                      </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">共享封面图 URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1b887a] focus:ring-4 focus:ring-[#1b887a]/10 outline-none transition-all"
                        value={formData.thumbnail}
                        onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                        onPaste={handleThumbnailPaste}
                        placeholder="https://example.com/image.jpg (支持粘贴图片自动上传)"
                      />
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all flex justify-center items-center gap-2 whitespace-nowrap"
                      >
                        <ImageIcon className="w-5 h-5" /> 上传封面
                      </button>
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-6">
                    <button 
                      type="submit" 
                      disabled={loading || uploadingImages > 0}
                      className="flex items-center justify-center gap-2 w-full md:w-auto px-12 py-4 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg hover:bg-[#166d63] disabled:opacity-50 transition-all text-lg"
                    >
                      <Save className="w-5 h-5" /> {loading ? '处理中...' : (uploadingImages > 0 ? `正在转存图片...` : '保存发布')}
                    </button>
                 </div>
              </form>
            </motion.div>
          ) : (
            <>
              {activeAdminView === 'articles' ? (
                <>
                   {/* Filter for articles and search */}
                  <div className="mb-6 flex items-center gap-3">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-wrap gap-2 flex-1">
                      {Object.entries(filterCategoryMap).map(([catId, label]) => (
                        <button
                          key={catId}
                          onClick={() => setFilterCategory(catId)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterCategory === catId ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      placeholder="搜索文章..." 
                      className="px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#1b887a]"
                      value={articleSearchTerm}
                      onChange={e => setArticleSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Grid of articles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                       <motion.div 
                         key={article._id}
                         layout
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full"
                       >
                          <div className="p-6 flex-1 flex flex-col">
                             <div className="flex justify-between items-start mb-4">
                                <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full uppercase tracking-widest">{categoryMap[article.category] || article.category}</span>
                                <span className="text-[11px] text-gray-400 font-medium">{new Date(article.createdAt).toLocaleDateString()}</span>
                             </div>
                             <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#1b887a] transition-colors">{article.title}</h3>
                             <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{article.subtitle}</p>
                             <div className="flex justify-between items-center bg-gray-50 p-2 rounded-2xl">
                                <button 
                                  onClick={() => deleteArticle(article._id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                                <button 
                                  onClick={() => handleEdit(article)}
                                  className="flex items-center gap-1 text-[#1b887a] font-bold text-sm px-4 py-2 hover:bg-[#1b887a]/10 rounded-xl transition-all"
                                >
                                   编辑 <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                             </div>
                          </div>
                       </motion.div>
                    ))}
                    
                    {filteredArticles.length === 0 && (
                      <div className="col-span-full py-20 text-center text-gray-400 font-medium bg-white rounded-3xl border border-gray-100 border-dashed">
                        当前分类下暂无文章...
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="col-span-full space-y-4 mb-6">
                    <div className="p-4 bg-white rounded-xl border border-gray-200">
                      <h3 className="font-bold mb-2">批量城市生成控制台</h3>
                      <textarea 
                        className="w-full p-2 border rounded" 
                        rows={3} 
                        placeholder="请输入城市名称，每行一个"
                        value={cityBatchInput}
                        onChange={e => setCityBatchInput(e.target.value)}
                      />
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={handleBatchGenerate} 
                          disabled={isBatchGenerating}
                          className="px-4 py-2 bg-[#1b887a] text-white rounded-lg font-bold"
                        >
                          {isBatchGenerating ? '生成中...' : '开始批量生成'}
                        </button>
                        <span className="text-sm text-gray-500 self-center">{cityBatchStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full p-4 bg-white rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                     <div className="flex items-center gap-4 w-full">
                        <input 
                           type="text" 
                           placeholder="搜索城市..." 
                           className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#1b887a]"
                           value={citySearchTerm}
                           onChange={e => setCitySearchTerm(e.target.value)}
                        />
                     </div>
                     <button onClick={migrateCities} className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm whitespace-nowrap">迁移旧数据</button>
                  </div>
                  {cities.filter(c => c.name.includes(citySearchTerm) || (c.enName && c.enName.toLowerCase().includes(citySearchTerm.toLowerCase()))).map((city) => (
                     <div key={city.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div>
                          <h3 className="font-bold text-lg">{city.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{city.enName}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                           <button onClick={() => { setEditingCity(city); setShowCityForm(true); }} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors">编辑</button>
                           <button onClick={() => deleteCity(city.id, city.name)} disabled={loading} className="flex-x-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-xl font-bold text-sm transition-colors">删除</button>
                        </div>
                     </div>
                  ))}
                  <button 
                    onClick={() => { setEditingCity(null); setShowCityForm(true); }}
                    className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-3xl border border-gray-200 border-dashed text-gray-400 hover:text-[#1b887a] hover:border-[#1b887a] transition-all"
                  >
                     <Plus className="w-8 h-8 mb-2" /> 新增城市
                  </button>
                  {showCityForm && (
                     <CityForm 
                       city={editingCity} 
                       onClose={() => { setShowCityForm(false); setEditingCity(null); }}
                       onSave={handleSaveCity}
                     />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

