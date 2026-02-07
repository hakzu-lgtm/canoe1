import Image from "next/image";
import Link from "next/link";
import type { Program } from "@/constants/programs";

interface ProgramCardProps {
  program: Program;
  /** "featured"는 큰 가로형 카드, "default"는 세로형 카드 */
  variant?: "featured" | "default";
}

export default function ProgramCard({
  program,
  variant = "default",
}: ProgramCardProps) {
  if (variant === "featured") {
    return <FeaturedCard program={program} />;
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50">
      {/* 이미지 - 실제 사진으로 교체하세요 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={program.image}
          alt={program.imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {program.title}
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-gray-500">
          {program.description}
        </p>

        {/* 소요 시간 */}
        <div className="mb-4 flex items-center gap-2 text-sm text-emerald-700">
          <svg
            className="h-4 w-4"
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
          <span className="font-medium">{program.duration}</span>
        </div>

        {/* 하이라이트 */}
        <ul className="mb-5 space-y-1.5">
          {program.highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        {/* 추천 대상 태그 */}
        <div className="mt-auto flex flex-wrap gap-2">
          {program.recommended.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

/** 메인 카누 체험용 가로형 대형 카드 */
function FeaturedCard({ program }: { program: Program }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50">
      <div className="grid md:grid-cols-2">
        {/* 이미지 - 실제 사진으로 교체하세요 */}
        <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
          <Image
            src={program.image}
            alt={program.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* 뱃지 */}
          <div className="absolute left-4 top-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
            대표 프로그램
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="flex flex-col justify-center p-8 md:p-10">
          <h3 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
            {program.title}
          </h3>
          <p className="mb-6 text-base leading-relaxed text-gray-500">
            {program.description}
          </p>

          {/* 소요 시간 */}
          <div className="mb-6 flex items-center gap-2 text-sm text-emerald-700">
            <svg
              className="h-4 w-4"
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
            <span className="font-medium">{program.duration}</span>
          </div>

          {/* 하이라이트 */}
          <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {program.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          {/* 추천 대상 + CTA */}
          <div className="flex flex-wrap items-center gap-3">
            {program.recommended.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href="/reservation"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            예약하기
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
      </div>
    </article>
  );
}
