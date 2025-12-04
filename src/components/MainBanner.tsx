// src/components/MainBanner.tsx

// 🚨 캐러셀은 상호작용이 필요한 컴포넌트이므로 클라이언트 컴포넌트로 지정합니다.
"use client";

import {
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Skeleton,
} from "@/components/ui/index";

// 🚨 컴포넌트 Props 타입 정의
interface MainBannerProps {
  // 🚨 타입 이름 AppMainBannerProps -> MainBannerProps로 변경
  loading: boolean;
  // 임시 타입: 갤러리 항목은 배열이어야 하지만, 실제 데이터 스키마에 맞게 수정해야 합니다.
  gallery: unknown[];
}

// 🚨 컴포넌트 이름 AppMainBanner -> MainBanner로 변경
export function MainBanner({ loading, gallery }: MainBannerProps) {
  return (
    <section className="w-full">
      <Carousel
      // ... (생략)
      >
        <CarouselContent className="w-full flex justify-start gap-6 -mx-100">
          {loading ? (
            <>
              {/* 스켈레톤도 반응형으로 변경하는 것이 좋지만, 일단은 min-w를 유지 */}
              <Skeleton className="min-w-[580px] w-[580px] h-80" />
              {/* ... 나머지 Skeleton 생략 ... */}
            </>
          ) : (
            gallery.map((_, index) => (
              <CarouselItem
                key={index}
                // 🚨 CarouselItem의 basis 클래스를 조정하여 반응형을 보장합니다.
                // basis-full: 기본값으로 100% (모바일)
                // sm:basis-1/2: 작은 화면에서 50%
                // md:basis-1/3: 중간 화면에서 33%
                // xl:basis-1/4: 큰 화면에서 25% (원본 JS의 의도에 맞게)
                className="basis-full sm:basis-1/2 md:basis-1/3 xl:basis-1/4 pl-6"
              >
                <Card className="w-full h-80">
                  {" "}
                  {/* 🚨 w-[580px] min-w-[580px] 클래스 제거 */}
                  <CardContent>
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        {/* CarouselPrevious와 CarouselNext의 mx-30은 Tailwind에서 정의되지 않은 클래스일 수 있습니다. */}
        {/* 🚨 임시로 mx-auto (중앙 정렬)나 mx-4 (여백)로 변경하는 것을 고려해보세요. */}
        <CarouselPrevious className="mx-30 rounded-full hidden md:flex" />
        <CarouselNext className="mx-30 rounded-full" />
      </Carousel>
    </section>
  );
}

// 🚨 익스포트 이름 AppMainBanner -> MainBanner로 변경
export default MainBanner;
