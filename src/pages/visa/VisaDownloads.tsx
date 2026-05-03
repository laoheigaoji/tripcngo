import React from 'react';
import VisaLayout from '../../components/visa/VisaLayout';
import { Download, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function VisaDownloads() {
  const { language, t } = useLanguage();

  const downloads = [
    { name: language === 'zh' ? '出入境证件相片照相指引' : 'Entry/Exit Document Photo Guidelines', url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c896346/content.html' },
    { name: language === 'zh' ? '外国人签证、居留许可申请表' : 'Foreigner Visa/Residence Permit Application Form', url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c1748608/content.html' },
    { name: language === 'zh' ? '台湾居民来大陆定居申请表' : 'Application Form for Taiwan Residents Settling in Mainland', url: 'https://www.nia.gov.cn/n741445/n741619/n894511/c1748522/content.html' },
  ];

  return (
    <VisaLayout breadcrumbTitle={t('visa.menu.download')}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-[#1b887a] text-white">
            <tr>
              <th className="px-6 py-4 font-semibold">{language === 'zh' ? '文件名' : 'File Name'}</th>
              <th className="px-6 py-4 font-semibold w-32">{language === 'zh' ? '操作' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((file, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{file.name}</span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => window.open(file.url, '_blank')}
                    className="flex items-center gap-2 text-[#1b887a] hover:text-[#166d63] font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {language === 'zh' ? '查看' : 'View'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VisaLayout>
  );
}
