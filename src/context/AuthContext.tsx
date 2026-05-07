import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  loading: boolean;
  hasPurchased: boolean;
  signInWithGoogle: () => Promise<void>;
  simulatePurchase: () => Promise<void>;
  completePayment: () => Promise<void>;
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
          const { data: purchases } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('item_id', 'all_access')
            .limit(1);
          
          setHasPurchased(purchases && purchases.length > 0);
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
        const { data: purchases } = await supabase
          .from('purchases')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('item_id', 'all_access')
          .limit(1);
        setHasPurchased(purchases && purchases.length > 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 处理支付成功回调
    const params = new URLSearchParams(window.location.search);
    if (params.get('unlock') === 'true') {
      // 如果还在加载用户信息，先等待
      if (loading) return;
      
      const processPayment = async () => {
        if (user) {
          await completePayment();
          
          if (window.opener) {
            window.opener.postMessage('creem_payment_success', '*');
            setTimeout(() => window.close(), 500); // 尝试关闭弹窗
          }
          // 不管是不是弹窗，如果当前页面还在，就清理 URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // 这个时候已经加载完毕且没有用户，说明丢失了登录态
          alert('支付成功！但系统未能获取到您的登录状态。请尝试重新登录，我们将自动为您恢复购买记录。');
          // 也可以清理 URL，避免再次刷新重复弹窗
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      };
      
      processPayment();
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'creem_payment_success') {
        if (user) {
          completePayment();
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, loading, hasPurchased]);

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (data?.url) {
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
          alert('弹窗被拦截，请允许弹窗后重试。浏览器可能阻止了弹窗。');
          // 可选地，直接本页访问： window.location.href = data.url;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('登录失败，请重试');
    }
  };

  const initiatePayment = async () => {
    if (!user) {
      alert('请先登录');
      return;
    }

    const checkoutUrl = import.meta.env.VITE_CREEM_CHECKOUT_URL || 'https://www.creem.io/test/payment/prod_5xXOa84Nq51M6OpgInrSKp';
    if (checkoutUrl) {
      const url = new URL(checkoutUrl);
      url.searchParams.append('client_reference_id', user.id);
      url.searchParams.append('success_url', window.location.origin + window.location.pathname + '?unlock=true');
      
      // 恢复使用弹窗的形式进行支付，以便原页面可以监听到回调
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const paymentWindow = window.open(
        url.toString(),
        'creem-payment',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      if (!paymentWindow) {
        alert('弹窗被拦截，将直接在当前页面打开支付');
        window.location.href = url.toString();
      }
    }
  };

  const completePayment = async () => {
    if (!user) return;
    try {
      // 检查是否已经存在购买记录
      const { data: existingPurchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', 'all_access')
        .limit(1);

      if (existingPurchases && existingPurchases.length > 0) {
        setHasPurchased(true);
        return;
      }

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
    } catch (error: any) {
      console.error('Purchase validation error:', error);
      alert('保存购买记录失败: ' + (error?.message || '未知错误') + '\n如果一直失败，请联系客服。');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, hasPurchased, signInWithGoogle, simulatePurchase: initiatePayment, completePayment }}>
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
