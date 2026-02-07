import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mb-16 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-600">
            ABOUT
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            장자늪 카누 체험이란?
          </h2>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* 이미지 - 실제 수로 카누 체험 사진으로 교체하세요 */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/gallery-waterway.svg"
              alt="장자늪 수로를 따라 카누를 타는 모습"
              fill
              className="object-cover"
            />
          </div>

          {/* 텍스트 설명 */}
          <div>
            <h3 className="mb-6 text-2xl font-bold leading-snug text-gray-900">
              고요한 수로 위,
              <br />
              자연과 하나 되는 시간
            </h3>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                장자늪 카누 체험은 충주 장자늪 일원의 자연 수로를 따라
                왕복 약 3.3km를 이동하는 수로형 카누 프로그램입니다.
              </p>
              <p>
                모든 회차는 전문 자격을 갖춘 가이드가 동행하며,
                탑승 전 안전 교육과 구명조끼 착용을 필수로 진행합니다.
                초보자, 가족, 단체 모두 안심하고 참여할 수 있습니다.
              </p>
              <p>
                수상레저안전법에 따라 운영되며, 기상 상황에 따라
                운영이 조정될 수 있습니다. 안전이 항상 최우선입니다.
              </p>
            </div>

            {/* 핵심 수치 */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "3.3km", label: "수로 왕복" },
                { value: "2시간", label: "회당 소요" },
                { value: "2인승", label: "카누 10척" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-emerald-50 p-4 text-center"
                >
                  <p className="text-xl font-bold text-emerald-700">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
