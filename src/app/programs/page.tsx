import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard, ProgramSectionHeader } from "@/components/programs";
import {
  CANOE_PROGRAMS,
  SPECIAL_PROGRAMS,
  BIKE_PROGRAMS,
} from "@/constants/programs";

export const metadata: Metadata = {
  title: "프로그램 안내 | 장자늪 카누 체험장",
  description:
    "카누 체험, 자전거 대여 등 장자늪 카누 체험장의 다양한 프로그램을 소개합니다.",
};

export default function ProgramsPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-emerald-800 py-20 text-center text-white">
        <p className="mb-2 text-sm font-medium text-emerald-300">PROGRAMS</p>
        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
          프로그램 안내
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-emerald-100/80">
          장자늪 카누 체험장에서 제공하는 다양한 프로그램을 확인하세요.
        </p>
      </div>

      {/* ───── 1. 카누 체험 (대표 프로그램) ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <ProgramSectionHeader
          badge="카누 체험"
          title="장자늪 카누 체험 프로그램"
          description="전문 가이드와 함께 장자늪 자연 수로를 안전하게 즐기는 대표 프로그램입니다."
        />
        {CANOE_PROGRAMS.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            variant="featured"
          />
        ))}
      </section>

      {/* 구분선 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-100" />
      </div>

      {/* ───── 2. 특별 카누 프로그램 ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <ProgramSectionHeader
          badge="특별 프로그램"
          title="단체/시즌 특별 카누 투어"
          description="단체 행사 또는 계절 한정으로 운영되는 특별한 카누 체험입니다."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SPECIAL_PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      {/* 구분선 */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <hr className="border-gray-100" />
      </div>

      {/* ───── 3. 자전거 대여 ───── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
        <ProgramSectionHeader
          badge="자전거 대여"
          title="자전거 대여 프로그램"
          description="카누 체험 후 또는 단독으로 이용할 수 있는 자전거 대여 서비스입니다."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {BIKE_PROGRAMS.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      {/* ───── 하단 CTA ───── */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            마음에 드는 프로그램을 찾으셨나요?
          </h2>
          <p className="mb-8 text-gray-500">
            이용요금을 확인하시거나, 바로 예약을 진행하실 수 있습니다.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="w-full rounded-full border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              이용요금 보기
            </Link>
            <Link
              href="/reservation"
              className="w-full rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 sm:w-auto"
            >
              예약하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
