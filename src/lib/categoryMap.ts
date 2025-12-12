// 카테고리 매핑 - StickyMenu value와 DB name 연결
export const CATEGORY_MAP: Record<string, string> = {
  "korea": "전체",
  "video": "영상/모션그래픽",
  "graphic-design": "그래픽 디자인",
  "brand": "브랜딩/편집",
  "ui": "UI/UX",
  "web-design": "웹 디자인",
  "illustration": "일러스트레이션",
  "illust": "일러스트",
  "digital-art": "디지털 아트",
  "ai": "AI",
  "3d": "3D",
  "cartoon": "캐릭터 디자인",
  "product-design": "제품/패키지 디자인",
  "photography": "포토그래피",
  "photo": "사진",
  "typography": "타이포그래피",
  "craft": "공예",
  "art": "파인아트",
};

// 역매핑 - DB name에서 value로
export const CATEGORY_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([key, value]) => [value, key])
);

// value를 DB name으로 변환
export function getCategoryName(value: string): string {
  return CATEGORY_MAP[value] || "전체";
}

// DB name을 value로 변환
export function getCategoryValue(name: string): string {
  return CATEGORY_REVERSE_MAP[name] || "korea";
}
