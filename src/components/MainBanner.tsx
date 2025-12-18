"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
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
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  bg_color: string;
  text_color: string;
}

export function MainBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Fallback if no banners in DB
          setBanners([
            {
              id: 0,
              title: "Creative Space",
              subtitle: "당신의 영감을 펼칠 수 있는 공간",
              image_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
              link_url: null,
              bg_color: "#1a1a1a",
              text_color: "#ffffff"
            },
            {
              id: 1,
              title: "Discover Art",
              subtitle: "새로운 크리에이티브를 발견하세요",
              image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2664&auto=format&fit=crop",
              link_url: null,
              bg_color: "#2a2a2a",
              text_color: "#ffffff"
            }
          ]);
        }
      } catch (error) {
        console.error('배너 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <Carousel className="w-full">
          <CarouselContent className="w-full flex justify-start gap-4 -ml-4">
            <Skeleton className="min-w-[90vw] md:min-w-[600px] w-[90vw] md:w-[600px] h-[300px] md:h-[400px] rounded-2xl ml-4" />
            <Skeleton className="min-w-[90vw] md:min-w-[600px] w-[90vw] md:w-[600px] h-[300px] md:h-[400px] rounded-2xl" />
          </CarouselContent>
        </Carousel>
      </section>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="w-full flex justify-start gap-4 -ml-4 py-4 px-1">
          {banners.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="basis-[90vw] md:basis-[600px] pl-4"
            >
              <Link href={banner.link_url || "#"} className={banner.link_url ? "cursor-pointer" : "cursor-default"}>
                <Card 
                  className="w-full h-[300px] md:h-[400px] overflow-hidden hover:shadow-xl transition-all duration-300 border-none rounded-[32px] group relative"
                >
                  <CardContent className="flex items-center justify-center h-full p-0 relative">
                    {/* Background Image with Zoom Effect */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${banner.image_url})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col items-start gap-3">
                      {banner.subtitle && (
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase backdrop-blur-md bg-white/20 border border-white/30"
                          style={{ color: banner.text_color }}
                        >
                          {banner.subtitle}
                        </div>
                      )}
                      
                      <h2 
                        className="text-3xl md:text-4xl font-black tracking-tight leading-tight"
                        style={{ color: banner.text_color }}
                      >
                        {banner.title}
                      </h2>
                      
                      {banner.link_url && (
                        <div 
                          className="mt-2 flex items-center gap-2 text-sm font-bold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                          style={{ color: banner.text_color }}
                        >
                          자세히 보기 <ExternalLink size={14} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="left-8 w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 backdrop-blur-md text-white hidden md:flex" />
            <CarouselNext className="right-8 w-12 h-12 rounded-full border-none bg-white/10 hover:bg-white/20 backdrop-blur-md text-white hidden md:flex" />
          </>
        )}
      </Carousel>
    </section>
  );
}

export default MainBanner;
