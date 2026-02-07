import type { Metadata } from "next";
import Link from "next/link";
import { ReservationForm } from "@/components/reservation";

export const metadata: Metadata = {
  title: "예약하기 | 장자늪 카누 체험장",
  description: "장자늪 카누 체험장 온라인 예약 - 카누 체험, 자전거 대여 예약",
};

export default function ReservationPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-emerald-800 py-20 text-center text-white">
        <p className="mb-2 text-sm font-medium text-emerald-300">
          RESERVATION
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          예약하기
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-emerald-100/80">
          원하시는 프로그램과 일정을 선택하여 간편하게 예약하세요.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* ───── 좌측: 예약 폼 ───── */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <ReservationForm />
            </div>
          </div>

          {/* ───── 우측: 사이드바 정보 ───── */}
          <aside className="space-y-6">
            {/* 운영 안내 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
                <svg
                  className="h-5 w-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                운영 안내
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">운영기간</dt>
                  <dd className="text-gray-900">2026.03.23 ~ 11.30</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">
                    일반 시즌 운영
                  </dt>
                  <dd className="text-gray-900">09:00 ~ 18:00 (1일 4회)</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">
                    하절기 운영
                  </dt>
                  <dd className="text-gray-900">06:00 ~ 15:00 (1일 3회)</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">정기 휴무</dt>
                  <dd className="text-gray-900">매주 화/수요일</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">휴장</dt>
                  <dd className="text-gray-900">7월 전체 (장마/폭염)</dd>
                </div>
              </dl>
            </div>

            {/* 오시는 길 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
                <svg
                  className="h-5 w-5 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                오시는 길
              </h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">체험장 주소</dt>
                  <dd className="text-gray-900">
                    충청북도 충주시 장천리 791-10
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">
                    출발/도착 지점
                  </dt>
                  <dd className="text-gray-900">
                    목계 솔밭 캠핑장 (장천리 399)
                  </dd>
                </div>
              </dl>
            </div>

            {/* 요금 안내 링크 */}
            <div className="rounded-2xl bg-emerald-50 p-6">
              <h3 className="mb-2 text-base font-bold text-gray-900">
                요금이 궁금하신가요?
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                프로그램별 상세 요금을 확인하세요.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-600"
              >
                이용요금 보기
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
