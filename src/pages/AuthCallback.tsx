import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      // Supabase processes the hash automatically when the app loads.
      // We just need to give it a moment to sync.
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Auth successful
        if (window.opener) {
          // Send message to parent
          window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
          // Redirect to the desired path in the opener window
          window.opener.location.href = window.location.origin + '/ja/guide';
          window.close();
        } else {
          // If not in a popup, redirect to home
          window.location.href = '/';
        }
      } else {
        // No session yet, wait a bit or handle error
        const timeout = setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = '/';
          }
        }, 2000);
        return () => clearTimeout(timeout);
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        <p className="text-gray-600">正在登录，请稍候...</p>
      </div>
    </div>
  );
}
