import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants/navigation";

export const metadata: Metadata = {
  title: "찾아오는 길 | 장자늪 카누 체험장",
  description:
    "장자늪 카누 체험장 오시는 길 안내. 충청북도 충주시 장천리 목계 솔밭 일원.",
};

export default function DirectionsPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-emerald-800 py-20 text-center text-white">
        <p className="mb-2 text-sm font-medium text-emerald-300">DIRECTIONS</p>
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          찾아오는 길
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-emerald-100/80">
          장자늪 카누 체험장으로 오시는 방법을 안내합니다.
        </p>
      </div>

      {/* 지도 + 정보 */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* 구글 지도 */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.5!2d127.9082!3d36.9544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7LaksKTroZzrj4Qg7Lap7KO87IucIOyepeyynOumrCA3OTEtMTA!5e0!3m2!1sko!2skr!4v1700000000000"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="장자늪 카누 체험장 위치"
                className="h-[400px] w-full sm:h-[500px]"
              />
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="space-y-6">
            {/* 체험장 주소 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </span>
                <h3 className="font-bold text-gray-900">체험장 주소</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {SITE_CONFIG.address}
              </p>
            </div>

            {/* 출발지 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                  </svg>
                </span>
                <h3 className="font-bold text-gray-900">출발지 (집결 장소)</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                {SITE_CONFIG.departureSite}
              </p>
            </div>

            {/* 연락처 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <h3 className="font-bold text-gray-900">문의 전화</h3>
              </div>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-lg font-semibold text-emerald-600 hover:underline"
              >
                {SITE_CONFIG.phone}
              </a>
            </div>

            {/* 운영 시간 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h3 className="font-bold text-gray-900">운영 시간</h3>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>운영기간: {SITE_CONFIG.operatingPeriod}</p>
                <p>일반: {SITE_CONFIG.operatingHours.standard}</p>
                <p>하절기: {SITE_CONFIG.operatingHours.summer}</p>
                <p>휴무: {SITE_CONFIG.closedDays}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 교통 안내 */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            교통 안내
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TransportCard
              icon="car"
              title="자가용"
              items={[
                "중부내륙고속도로 → 충주IC → 국도3호선 → 목계방면 약 20분",
                "네비게이션: '목계 솔밭 캠핑장' 또는 '장자늪' 검색",
                "주차장 무료 이용 가능",
              ]}
            />
            <TransportCard
              icon="bus"
              title="대중교통"
              items={[
                "충주시외버스터미널 → 목계방면 시내버스",
                "충주역 → 택시 약 25분",
                "정확한 버스 시간표는 전화 문의",
              ]}
            />
            <TransportCard
              icon="info"
              title="참고 사항"
              items={[
                "출발 30분 전까지 집결 장소 도착",
                "기상 악화 시 운영 취소 가능 (사전 안내)",
                "문의사항은 전화로 연락 부탁드립니다",
              ]}
            />
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            방문을 결정하셨나요?
          </h2>
          <p className="mb-8 text-gray-500">
            원하시는 날짜에 예약하시고, 편하게 방문해 주세요.
          </p>
          <Link
            href="/reservation"
            className="inline-block rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            예약하기
          </Link>
        </div>
      </section>
    </div>
  );
}

const ICON_PATHS: Record<string, string> = {
  car: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M3.375 14.25V6.375c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v1.5m0 0h3.375c.621 0 1.125.504 1.125 1.125v5.25",
  bus: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M3.375 14.25V6.375c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v7.875",
  info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
};

function TransportCard({
  icon,
  title,
  items,
}: {
  icon: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[icon]} />
          </svg>
        </span>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-gray-600">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
