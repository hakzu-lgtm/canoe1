import type { Metadata } from "next";
import Link from "next/link";
import {
  CANOE_PRICING,
  BIKE_PRICING,
  OPTION_PRICING,
  type PricingRow,
} from "@/constants/pricing";

export const metadata: Metadata = {
  title: "이용요금 | 장자늪 카누 체험장",
  description: "장자늪 카누 체험장 카누 체험, 자전거 대여, 옵션 서비스 이용요금 안내",
};

/* ────────────────────────────────────────────
   재사용 가능한 요금표 컴포넌트
   ──────────────────────────────────────────── */
function PricingTable({
  rows,
  accentColor = "emerald",
  showDuration = false,
}: {
  rows: PricingRow[];
  accentColor?: "emerald" | "gray";
  showDuration?: boolean;
}) {
  const headBg =
    accentColor === "emerald" ? "bg-emerald-600" : "bg-gray-700";

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className={`${headBg} text-white`}>
            <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">
              구분
            </th>
            {showDuration && (
              <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">
                이용시간
              </th>
            )}
            <th scope="col" className="px-5 py-4 text-right text-sm font-semibold">
              요금
            </th>
            <th scope="col" className="px-5 py-4 text-left text-sm font-semibold">
              비고
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr
              key={`${row.type}-${i}`}
              className="transition-colors hover:bg-emerald-50/30"
            >
              <td className="px-5 py-4 text-sm font-medium text-gray-900">
                {row.type}
              </td>
              {showDuration && (
                <td className="px-5 py-4 text-sm text-gray-500">
                  {row.duration}
                </td>
              )}
              <td className="px-5 py-4 text-right text-sm font-bold text-emerald-700">
                {row.price}
              </td>
              <td className="px-5 py-4 text-xs text-gray-400">
                {row.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ────────────────────────────────────────────
   섹션 헤더
   ──────────────────────────────────────────── */
function SectionHeader({
  badge,
  badgeColor = "emerald",
  title,
  titleSuffix,
  subtitle,
}: {
  badge: string;
  badgeColor?: "emerald" | "gray";
  title: string;
  titleSuffix?: string;
  subtitle: string;
}) {
  const badgeCls =
    badgeColor === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-gray-100 text-gray-600";
  return (
    <div className="mb-6">
      <span
        className={`mb-2 inline-block rounded-full px-4 py-1.5 text-xs font-semibold ${badgeCls}`}
      >
        {badge}
      </span>
      <h2 className="text-2xl font-bold text-gray-900">
        {title}
        {titleSuffix && (
          <span className="ml-2 text-base font-medium text-gray-400">{titleSuffix}</span>
        )}
      </h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   메인 페이지
   ──────────────────────────────────────────── */
export default function PricingPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-emerald-800 py-20 text-center text-white">
        <p className="mb-2 text-sm font-medium text-emerald-300">PRICING</p>
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          이용요금 안내
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-emerald-100/80">
          프로그램별 이용요금을 확인하시고, 편리하게 예약하세요.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        {/* ───── 1. 카누 체험 + 자전거 대여 (좌우 배치) ───── */}
        <section className="mb-16">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* 카누 체험 요금 */}
            <div>
              <SectionHeader
                badge="카누 체험"
                title="카누 체험 요금"
                titleSuffix="(이용시간 약 2시간)"
                subtitle="수로 왕복 3.3km / 전문 가이드 동행 / 안전장비 포함"
              />
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <PricingTable rows={CANOE_PRICING} />
              </div>
            </div>

            {/* 자전거 대여 요금 */}
            <div>
              <SectionHeader
                badge="자전거 대여"
                title="자전거 대여 요금"
                titleSuffix="(이용시간 2시간)"
                subtitle="카누 체험 후 연계 이용 또는 단독 이용 가능 / 헬멧 제공"
              />
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <PricingTable rows={BIKE_PRICING} />
              </div>
            </div>
          </div>
        </section>

        {/* ───── 3. 옵션 서비스 ───── */}
        <section className="mb-16" aria-labelledby="pricing-option">
          <SectionHeader
            badge="옵션 서비스"
            badgeColor="gray"
            title="옵션 서비스"
            subtitle="기본 요금에 추가로 선택할 수 있는 서비스입니다."
          />
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <PricingTable rows={OPTION_PRICING} accentColor="gray" />
          </div>
        </section>

        {/* ───── 요금 비교 카드 ───── */}
        <section className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            한눈에 비교하기
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* 카누 체험 */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-sm">
              <div className="absolute right-0 top-0 rounded-bl-xl bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                인기
              </div>
              <h3 className="mb-1 text-lg font-bold text-gray-900">카누 체험</h3>
              <p className="mb-4 text-xs text-gray-400">수로 왕복 3.3km / 약 2시간</p>
              <p className="mb-6 text-3xl font-extrabold text-emerald-700">
                20,000
                <span className="text-base font-medium text-gray-400">원~</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check /> 전문 가이드 동행
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 안전 교육 / 구명조끼 제공
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 충주시민 50% 할인
                </li>
              </ul>
            </div>

            {/* 카누 + 자전거 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-1 text-lg font-bold text-gray-900">카누 + 자전거</h3>
              <p className="mb-4 text-xs text-gray-400">카누 체험 후 자전거 연계 이용</p>
              <p className="mb-6 text-3xl font-extrabold text-gray-900">
                30,000
                <span className="text-base font-medium text-gray-400">원~</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check /> 카누 체험 포함
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 일반 자전거 대여 포함
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 헬멧 / 안전 안내 제공
                </li>
              </ul>
            </div>

            {/* 자전거만 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-1 text-lg font-bold text-gray-900">자전거 대여</h3>
              <p className="mb-4 text-xs text-gray-400">단독 자전거 이용</p>
              <p className="mb-6 text-3xl font-extrabold text-gray-900">
                5,000
                <span className="text-base font-medium text-gray-400">원~</span>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check /> 일반 / 2인 / 어린이용 선택
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 헬멧 제공
                </li>
                <li className="flex items-center gap-2">
                  <Check /> 모션캠 옵션 가능
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ───── 안내사항 ───── */}
        <section className="mb-12 rounded-2xl bg-gray-50 p-6 md:p-8">
          <h3 className="mb-4 text-base font-bold text-gray-900">안내사항</h3>
          <ul className="space-y-2.5 text-sm leading-relaxed text-gray-600">
            {[
              "충주시민 할인은 주민등록증 등 신분증 확인 후 적용됩니다.",
              "국가유공자 및 장애인 할인은 관련 증빙 서류 확인이 필요합니다.",
              "충주 관내 숙박 프로모션은 숙박 확인서를 지참해 주세요.",
              "단체 요금은 별도 문의 바랍니다.",
              "기상 및 안전 상황에 따라 프로그램이 변경/취소될 수 있습니다.",
              "7월은 장마 및 폭염으로 휴장하며, 매주 화/수요일은 정기 휴무입니다.",
            ].map((text) => (
              <li key={text} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {text}
              </li>
            ))}
          </ul>
        </section>

        {/* ───── CTA ───── */}
        <div className="text-center">
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-200"
          >
            예약하기
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/** 체크 아이콘 */
function Check() {
  return (
    <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}
