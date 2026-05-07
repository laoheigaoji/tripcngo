import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuth = async () => {
      // Set up a listener for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' || session) {
            if (window.opener) {
              window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          }
        }
      );

      // Check current session just in case it's already processed
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (window.opener) {
          window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
          window.close();
        } else {
          window.location.href = '/';
        }
      }

      // Cleanup
      return () => {
        subscription.unsubscribe();
      };
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        <p className="text-gray-600">正在登录，请稍候... Logging in...</p>
      </div>
    </div>
  );
}
