"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

// 30분 세션 타임아웃 (밀리초)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

interface UserProfile {
  nickname: string;
  profile_image_url: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userProfile: UserProfile | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const initializedRef = useRef(false);

  // ====== 1. 세션 타임아웃 체크 (30분 규칙) ======
  const checkSessionTimeout = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      const lastActivity = localStorage.getItem('lastActivity');
      if (!lastActivity) return false;
      
      const lastTime = parseInt(lastActivity, 10);
      const elapsed = Date.now() - lastTime;
      
      if (elapsed > SESSION_TIMEOUT_MS) {
        console.warn("[Auth] 30min Inactive -> Logout Triggered");
        return true; 
      }
    } catch (e) {
      return false;
    }
    return false;
  }, []);

  // ====== 2. 프로필 정보 로드 (ONLY DB) ======
  const loadUserProfile = useCallback(async (currentUser: User): Promise<UserProfile> => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role, nickname, profile_image_url")
        .eq("id", currentUser.id)
        .single();

      if (userError || !userData) {
        return { nickname: "알 수 없음", profile_image_url: "/globe.svg", role: "user" };
      }

      const typedData = userData as { role?: string; nickname?: string; profile_image_url?: string };
      return {
        nickname: typedData.nickname || "이름 없음",
        profile_image_url: typedData.profile_image_url || "/globe.svg",
        role: typedData.role || "user",
      };
    } catch (error) {
      return { nickname: "오류", profile_image_url: "/globe.svg", role: "user" };
    }
  }, []);

  // ====== 3. 상태 업데이트 및 스토리지 동기화 ======
  const syncAuthState = useCallback(async (newSession: Session | null) => {
    if (!newSession) {
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setIsAdmin(false);
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('isLoggedIn');
    } else {
      const profile = await loadUserProfile(newSession.user);
      setSession(newSession);
      setUser(newSession.user);
      setUserProfile(profile);
      setIsAdmin(profile.role === 'admin');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('lastActivity', Date.now().toString());
    }
    setLoading(false);
  }, [loadUserProfile]);

  // ====== 4. 초기화 및 이벤트 리스너 ======
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      console.log(`[Auth] Initializing on ${pathname}`);
      
      // 콜백 페이지면 컨텍스트 초기화는 건너뛰고 콜백 페이지 전용 로직에 맡김
      if (pathname === "/auth/callback") {
        setLoading(false);
        return;
      }

      // 30분 타임아웃 먼저 체크
      if (checkSessionTimeout()) {
        await supabase.auth.signOut();
        await syncAuthState(null);
        return;
      }

      // 세션 확인 (getSession은 캐시 우선이라 빠름)
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      await syncAuthState(initialSession);
    };

    init();

    // 상태 변경 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`[Auth] Event: ${event}`);
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        await syncAuthState(currentSession);
      } else if (event === "SIGNED_OUT") {
        await syncAuthState(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, checkSessionTimeout, syncAuthState]);

  // ====== 5. 주기적 타임아웃 체크 (30분 규칙 강화) ======
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && checkSessionTimeout()) {
        supabase.auth.signOut().then(() => syncAuthState(null));
      }
    }, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, [user, checkSessionTimeout, syncAuthState]);

  const signOut = async () => {
    await supabase.auth.signOut();
    await syncAuthState(null);
    router.push("/");
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    userProfile,
    signOut,
    refreshSession: async () => {
      const { data: { session: rs } } = await supabase.auth.refreshSession();
      await syncAuthState(rs);
    },
    refreshUserProfile: async () => {
      if (user) {
        const p = await loadUserProfile(user);
        setUserProfile(p);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export type UserInterests = { genres?: string[]; fields?: string[] };
