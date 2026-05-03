import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, Plus, LogOut, ChevronRight, Save } from 'lucide-react';
import Markdown from 'react-markdown';
import TurndownService from 'turndown';

interface Article {
  _id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  category: string;
  createdAt: string;
}

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
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

  const turndownService = new TurndownService();

  const handleHtmlPaste = () => {
    const html = prompt('请粘贴文章HTML内容：');
    if (html) {
      const markdown = turndownService.turndown(html);
      setFormData({ ...formData, content: markdown });
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        setLoading(true);
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64 = (event.target?.result as string).split(',')[1];
            const token = localStorage.getItem('adminAuth');
            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Basic ${token}`
                },
                body: JSON.stringify({
                  image: base64,
                  name: file.name,
                  type: file.type
                })
              });
              const data = await res.json();
              if (data.url) {
                const imgMarkdown = `\n![${file.name}](${data.url})\n`;
                setFormData(prev => ({ ...prev, content: prev.content + imgMarkdown }));
              }
            } catch (error) {
              console.error('Upload failed', error);
            } finally {
              setLoading(false);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      setIsLoggedIn(true);
      fetchArticles(savedAuth);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const authString = btoa(`${username}:${password}`);
    localStorage.setItem('adminAuth', authString);
    setIsLoggedIn(true);
    fetchArticles(authString);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
    setArticles([]);
  };

  const fetchArticles = async (auth?: string) => {
    const token = auth || localStorage.getItem('adminAuth');
    try {
      const res = await fetch('/api/articles', {
        headers: token ? { 'Authorization': `Basic ${token}` } : {}
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminAuth');
    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles';
      const method = editingId ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.status === 401) {
        handleLogout();
        return;
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
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('确定删除吗？')) return;
    const token = localStorage.getItem('adminAuth');
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Basic ${token}` }
      });
      fetchArticles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`);
      const article = await res.json();
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
      setEditingId(id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
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
          <p className="text-gray-500 mb-8">请输入您的凭据以访问后台管理系统</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">账号</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-sm font-bold text-gray-700 mb-2 px-1">密码</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-[#1b887a] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#166d63] transition-all transform active:scale-[0.98] mt-4"
            >
              登录系统
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-32 pb-20 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
             <h1 className="text-4xl font-black text-gray-900 mb-2">后台管理系统</h1>
             <p className="text-gray-500 font-medium">Tripcngo Content Manager</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white text-gray-500 border border-gray-100 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-all"
             >
               <LogOut className="w-5 h-5" /> 退出
             </button>
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
                {showForm ? '取消发布' : <><Plus className="w-5 h-5" /> 发布新文章</>}
              </button>
          </div>
        </div>

        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100"
          >
            <div className="flex gap-4 mb-8 p-1 bg-gray-50 rounded-2xl w-fit">
               <button 
                type="button"
                onClick={() => setActiveTab('zh')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'zh' ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 中文内容
               </button>
               <button 
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'en' ? 'bg-white text-[#1b887a] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 English Content
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
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">分类</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">副标题 (中文简述)</label>
                    <textarea 
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                      value={formData.subtitle}
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    />
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-2 px-1">
                        <div className="flex items-center gap-4">
                          <label className="block text-sm font-bold text-gray-700">正文内容 (中文)</label>
                          <button 
                            type="button"
                            onClick={() => setIsPreview(!isPreview)}
                            className="text-xs bg-gray-100 px-3 py-1 rounded-full font-bold text-gray-500 hover:bg-gray-200"
                          >
                            {isPreview ? '返回编辑' : '实时预览'}
                          </button>
                        </div>
                        <button type="button" onClick={handleHtmlPaste} className="text-xs text-[#1b887a] font-bold hover:underline">从HTML导入</button>
                     </div>
                     {isPreview ? (
                        <div className="min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl p-8 markdown-body bg-white overflow-auto">
                          <Markdown>{formData.content}</Markdown>
                        </div>
                     ) : (
                        <textarea 
                          rows={15}
                          className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all font-mono text-sm"
                          value={formData.content}
                          onPaste={handlePaste}
                          onChange={e => setFormData({...formData, content: e.target.value})}
                        />
                     )}
                  </div>
               </div>

               <div className={`space-y-6 animate-in fade-in duration-300 ${activeTab === 'en' ? 'block' : 'hidden'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title (English)</label>
                      <input 
                        type="text" 
                        required={activeTab === 'en'}
                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                        value={formData.titleEn}
                        onChange={e => setFormData({...formData, titleEn: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <input 
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl text-gray-400"
                        value={formData.category}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subtitle (English Brief)</label>
                    <textarea 
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                      value={formData.subtitleEn}
                      onChange={e => setFormData({...formData, subtitleEn: e.target.value})}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="block text-sm font-bold text-gray-700">Content (English Markdown)</label>
                    </div>
                    <textarea 
                      rows={15}
                      className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all font-mono text-sm"
                      value={formData.contentEn}
                      onChange={e => setFormData({...formData, contentEn: e.target.value})}
                    />
                  </div>
               </div>

               <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">共享封面图 URL</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#1b887a] outline-none transition-all"
                    value={formData.thumbnail}
                    onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                  />
               </div>

               <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-10 py-3 bg-[#1b887a] text-white rounded-xl font-bold shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-5 h-5" /> {loading ? '发布中...' : '提交并发布'}
                  </button>
               </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
             <motion.div 
               key={article._id}
               layout
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all"
             >
                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-400 rounded-full uppercase tracking-widest">{article.category}</span>
                      <span className="text-[10px] text-gray-300 font-medium">{new Date(article.createdAt).toLocaleDateString()}</span>
                   </div>
                   <h3 className="text-lg font-black text-gray-900 mb-6 group-hover:text-[#1b887a] transition-colors line-clamp-2 min-h-[3.5rem]">{article.title}</h3>
                   <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-2xl">
                      <button 
                        onClick={() => deleteArticle(article._id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleEdit(article._id)}
                        className="flex items-center gap-1 text-[#1b887a] font-bold text-sm px-3 py-1 hover:bg-[#1b887a]/10 rounded-lg transition-all"
                      >
                         编辑 <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
