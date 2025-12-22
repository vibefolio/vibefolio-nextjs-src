import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase admin environment variables');
}

// 환경 변수가 있을 때만 클라이언트 초기화
// 없을 경우 null을 반환하면 사용처에서 런타임 에러가 날 수 있으므로,
// 최소한의 에러 방지용 객체(Proxy)를 반환하거나 null을 반환하고 사용처에서 주의해야 함.
// 여기서는 앱 크래시를 막기 위해 조건부 초기화를 수행.

let adminClient: any = null;

if (supabaseUrl && supabaseServiceKey) {
  try {
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  } catch (e) {
    console.error('Failed to initialize Supabase Admin client:', e);
  }
} else {
  console.warn('Missing Supabase admin environment variables - Admin features will not work.');
  // 크래시 방지용 더미 프록시
  adminClient = new Proxy({}, {
    get: () => () => {
      console.error('Supabase Admin client is not initialized due to missing environment variables.');
      return { data: null, error: { message: 'Supabase Admin not initialized' } };
    }
  });
}

export const supabaseAdmin = adminClient;
