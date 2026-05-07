import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  hasPurchased: boolean;
  signInWithGoogle: () => Promise<void>;
  simulatePurchase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // 检查购买记录
          const { data: purchase } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('item_id', 'all_access')
            .single();
          
          setHasPurchased(!!purchase);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setHasPurchased(false);
      } else {
        // 检查购买记录
        const { data: purchase } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('item_id', 'all_access')
          .single();
        setHasPurchased(!!purchase);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: window.location.origin + '/auth/callback',
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (data?.url) {
        // 计算居中位置
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authWindow = window.open(
          data.url,
          'google-login',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!authWindow) {
          alert('弹窗被拦截，请允许弹窗后重试');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('登录失败，请重试');
    }
  };

  const simulatePurchase = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    try {
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_id: user.id,
          amount: 99,
          item_id: 'all_access',
          status: 'completed',
        });

      if (error) throw error;
      setHasPurchased(true);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('支付失败，请重试');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchased, signInWithGoogle, simulatePurchase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
