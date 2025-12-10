"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 시도:", formData);
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      alert("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (!formData.username.trim()) {
      setError("사용자 이름을 입력해주세요.");
      alert("사용자 이름을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      // 1. Supabase Auth 회원가입
      console.log("Supabase Auth 회원가입 시도...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nickname: formData.username,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("회원가입에 실패했습니다. (No User Data)");

      console.log("Supabase Auth 가입 성공:", authData.user);

      // 2. public.User 테이블에 프로필 생성 (연동)
      console.log("프로필 생성 시도...");
      const { data: userData, error: userError } = await (supabase as any)
        .from('User')
        .insert([
          {
            email: formData.email,
            // 비밀번호는 Supabase Auth가 관리하므로 여기엔 더미나 비워둘 수 있지만, 
            // 기존 로직 호환성을 위해 해시된 값을 넣거나, 혹은 Auth 사용 시엔 무시하도록 수정이 필요함.
            // 일단은 'managed_by_supabase_auth' 같은 값을 넣습니다.
            password: 'managed_by_supabase_auth', 
            nickname: formData.username,
            is_active: true,
            role: 'user',
          },
        ])
        .select()
        .single();

      if (userError) {
        console.error("프로필 생성 실패 (Auth는 성공함):", userError);
        // 이미 Auth는 가입되었으므로, 여기서 에러를 내면 꼬일 수 있음.
        // 하지만 프로필이 없으면 서비스 이용이 불가하므로 에러 처리.
        // 추가: 중복 이메일 에러일 경우 처리
        if (userError.code === '23505') { // unique_violation
           throw new Error("이미 가입된 이메일입니다 (Public DB).");
        }
        throw userError;
      }
      
      console.log("프로필 생성 성공:", userData);

      // 3. 로컬 스토리지 저장 및 로그인 처리
      localStorage.setItem('userProfile', JSON.stringify({
        user_id: userData.user_id,
        email: userData.email,
        nickname: userData.nickname,
        profile_image_url: userData.profile_image_url,
        role: userData.role,
      }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userData.user_id.toString());

      alert('회원가입이 완료되었습니다!');
      router.push('/');
      
    } catch (error: any) {
      console.error('회원가입 오류:', error);
      setError(error.message || '회원가입 중 오류가 발생했습니다.');
      alert(`회원가입 오류: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium text-[#4ACAD4] hover:text-[#41a3aa]"
            >
              로그인
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                사용자 이름
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="사용자 이름"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="최소 6자 이상"
              />
            </div>

            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호 확인
              </label>
              <Input
                id="password-confirm"
                name="password-confirm"
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={(e) =>
                  setFormData({ ...formData, passwordConfirm: e.target.value })
                }
                placeholder="비밀번호를 다시 입력하세요"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4ACAD4] hover:bg-[#41a3aa] text-white"
            >
              {loading ? "가입 중..." : "가입하기"}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>
            회원가입 시{" "}
            <a href="#" className="text-[#4ACAD4] hover:underline">
              이용약관
            </a>{" "}
            및{" "}
            <a href="#" className="text-[#4ACAD4] hover:underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
