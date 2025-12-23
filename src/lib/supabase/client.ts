import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 디버그: 환경 변수 확인
if (typeof window !== 'undefined') {
  console.log('[Supabase] ENV Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'MISSING!',
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'MISSING!',
  });
}

let supabase: SupabaseClient<Database>;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // URL에서 세션을 자동 감지
    },
  });
  console.log('[Supabase] Client initialized successfully');
} else {
  console.error('[Supabase] CRITICAL: Missing environment variables!');
  console.error('[Supabase] Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  // 안전한 더미 프록시 (체이닝 지원) - 프로덕션에서는 이게 실행되면 안 됨
  const createSafeMock = (): any => new Proxy(() => {}, {
    get: (_, prop) => {
      if (prop === 'then') {
        return (resolve: Function) => resolve({ data: null, error: { message: 'Supabase not configured' } });
      }
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          signOut: () => Promise.resolve({ error: null }),
        };
      }
      return createSafeMock();
    },
    apply: () => createSafeMock(),
  });
  supabase = createSafeMock() as any;
}

export { supabase };
export { supabaseAdmin } from './admin';
