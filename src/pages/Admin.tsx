import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, LogOut, ChevronRight, Save, Image as ImageIcon, Filter, FileText, Languages } from 'lucide-react';
import Markdown from 'react-markdown';
import MDEditor from '@uiw/react-md-editor';
import TurndownService from 'turndown';
import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
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
        const titleRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following Chinese article title to English. Only output the translated text:\n\n${formData.title}`,
        });
        titleEnExp = titleRes.text || '';
      }

      if (formData.subtitle) {
        const subtitleRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following Chinese article subtitle to English. Only output the translated text:\n\n${formData.subtitle}`,
        });
        subtitleEnExp = subtitleRes.text || '';
      }

      if (formData.content) {
        const contentRes = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following Chinese markdown content to English. Preserve all markdown formatting, links, and image syntactic structures exactly as they are. Output only the translated markdown:\n\n${formData.content}`,
        });
        contentEnExp = contentRes.text || '';
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
        if (currentUser.email === 'lianwo88@gmail.com' || currentUser.email === '752675@gmail.com') {
          setUser(currentUser);
          fetchArticles();
        } else {
          // If unauthorized Google account
          signOut(auth);
          setUser(null);
          alert('您的账号没有管理员权限。');
        }
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
    } catch (error) {
      console.error(error);
      alert('保存失败。');
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

  const filteredArticles = filterCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === filterCategory);

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
          <p className="text-gray-500 mb-8 text-sm">请输入账号和密码 (若无账号请在Firebase控制台创建)</p>
          
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
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Tripcngo</h1>
          <span className="text-[10px] font-bold bg-[#1b887a]/10 text-[#1b887a] px-2 py-1 rounded-full">ADMIN</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setShowForm(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${!showForm ? 'bg-[#1b887a] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FileText className="w-5 h-5" /> 内容管理
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
                          <option>National Policy</option>
                          <option>Payment Methods</option>
                          <option>Transportation</option>
                          <option>Practical Tools</option>
                          <option>City Guide</option>
                          <option>Tradition</option>
                          <option>Food Culture</option>
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
                          value={formData.category}
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
              {/* Filter */}
              <div className="mb-6 flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {['All', 'National Policy', 'Payment Methods', 'Transportation', 'Practical Tools', 'City Guide', 'Tradition', 'Food Culture'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterCategory === cat ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'}`}
                    >
                      {cat === 'All' ? '全部' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
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
                            <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full uppercase tracking-widest">{article.category}</span>
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
          )}
        </div>
      </main>
    </div>
  );
}

