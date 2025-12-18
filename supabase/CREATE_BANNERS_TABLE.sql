-- 메인 배너 테이블 생성
CREATE TABLE IF NOT EXISTS public.banners (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  bg_color TEXT DEFAULT '#000000',
  text_color TEXT DEFAULT '#ffffff',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 공개 정책: 활성화된 배너만 조회 가능
CREATE POLICY "Active banners are viewable by everyone."
  ON public.banners
  FOR SELECT
  USING (is_active = true);

-- 관리자 정책: 관리자는 모든 배너 관리 가능
CREATE POLICY "Admins can manage banners."
  ON public.banners
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW
  EXECUTE FUNCTION update_popups_updated_at(); -- 기존 트리거 함수 재사용

-- 샘플 데이터
INSERT INTO public.banners (title, subtitle, image_url, bg_color, display_order) VALUES
('Creative Space', '당신의 영감을 펼칠 수 있는 공간', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop', '#1a1a1a', 1),
('Discover Art', '새로운 크리에이티브를 발견하세요', 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop', '#2a2a2a', 2);
