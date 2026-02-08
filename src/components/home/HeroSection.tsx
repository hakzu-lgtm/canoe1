"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
      {/* 배경 동영상 - public/videos/hero-canoe.mp4 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/gallery-waterway.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-canoe.mp4"
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        {/* 뱃지 */}
        <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-medium tracking-wide backdrop-blur-sm">
          충청북도 충주시 / 장자늪 수로
        </span>

        {/* 메인 타이틀 */}
        <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          대한민국 유일의
          <br />
          <span className="text-emerald-300">수로형 카누 체험</span>
        </h1>

        {/* 서브타이틀 */}
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
          장자늪의 고요한 수로를 따라 약 3.3km,
          <br className="hidden sm:block" />
          전문 가이드와 함께하는 안전한 자연 속 카누 여행
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/reservation"
            className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-500/25"
          >
            예약하기
          </Link>
          <Link
            href="/programs"
            className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            프로그램 보기
          </Link>
        </div>

        {/* 운영 정보 간략 */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/60">
          <span>운영기간 : 3월 ~ 11월</span>
          <span className="hidden sm:inline">/</span>
          <span>수로 왕복 약 3.3km</span>
          <span className="hidden sm:inline">/</span>
          <span>회당 약 2시간 소요</span>
        </div>
      </div>

      {/* 하단 스크롤 유도 */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-white/50"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </div>
    </section>
  );
}
