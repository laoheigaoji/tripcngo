import React from 'react';
import { Share2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareButtonProps {
  title: string;
  url: string;
  text?: string;
}

export default function ShareButton({ title, url, text }: ShareButtonProps) {
  const { t } = useLanguage();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: url || window.location.href,
          text
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(url || window.location.href);
        alert(text || 'Link copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-all border border-white/20"
    >
      <Share2 className="w-4 h-4" />
      {t('share.button') || 'Share'}
    </button>
  );
}
