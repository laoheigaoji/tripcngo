import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface VisaLayoutProps {
  children: React.ReactNode;
  breadcrumbTitle: string;
}

const sidebarLinks = [
  { text: '签证类型', path: '/visa/types' },
  { text: '照片要求', path: '/visa/photo' },
  { text: '费用标准', path: '/visa/fees' },
  { text: '填写申请表', path: '/visa/form' },
  { text: '入境卡填写指南', path: '/visa/arrival-card' },
  { text: '材料下载', path: '/visa/downloads' },
];

export default function VisaLayout({ children, breadcrumbTitle }: VisaLayoutProps) {
  const location = useLocation();

  return (
    <div className="w-full flex-grow flex flex-col bg-[#fcfcfc]">
      {/* Hero Section */}
      <div 
        className="relative h-[300px] w-full flex items-center pt-16"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543097692-fa13c6cd8595?q=80&w=2670&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">签证业务</h1>
          <p className="text-lg text-white/90">全面了解中国签证信息，轻松办理签证，开启中国之旅</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col flex-grow">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-[#1b887a] flex items-center">
            <Home className="w-4 h-4 mr-1" />
            首页
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link to="/visa" className="hover:text-[#1b887a]">
            来华免签大全
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900">{breadcrumbTitle}</span>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-8 items-start flex-grow">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-sm shadow-sm p-4">
            <div className="text-center font-bold text-gray-800 py-3 mb-2 border-b border-gray-100">
              — 签证业务 —
            </div>
            <nav className="flex flex-col">
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-3 px-4 text-[14px] transition-colors rounded-sm ${
                      isActive 
                        ? 'bg-[#1b887a] text-white font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#1b887a]'
                    }`}
                  >
                    {link.text}
                  </Link>
                );
              })}
            </nav>
          </div>

          /* Content */
          <div className="flex-1 w-full bg-white border border-gray-100 rounded-sm shadow-sm p-6 lg:p-8 min-h-[500px]">
            {children}
          </div>

        </div>

        {/* Discover more */}
        <div className="mt-12 w-full max-w-3xl border border-gray-100 rounded-lg bg-white overflow-hidden shadow-sm mx-auto mb-10">
           <div className="bg-gray-50 px-6 py-4 font-bold text-gray-800 border-b border-gray-100">
             Discover more
           </div>
           <div>
             <Link to="#" className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>Travel</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to="#" className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 text-gray-600">
               <span>Tourist Destinations</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
             <Link to="#" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 text-gray-600">
               <span>travel</span>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
