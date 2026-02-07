const FEATURES = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "전문 가이드 동행",
    description:
      "자격을 갖춘 전문 가이드가 매 회차 함께합니다. 출발부터 도착까지 안전하게 안내합니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: "가족/단체 맞춤",
    description:
      "2인승 카누로 가족, 연인, 친구, 단체 누구나 편안하게 참여할 수 있습니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "안전 최우선 운영",
    description:
      "수상레저안전법 준수, 구명조끼 필수 착용, 기상 상황별 운영 기준을 엄격히 적용합니다.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375m0 0V4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v9.375m0 0h.375" />
      </svg>
    ),
    title: "자전거 대여 가능",
    description:
      "카누 체험 후 목계 일대를 자전거로 즐길 수 있습니다. 헬멧과 안전 안내가 제공됩니다.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-600">
            FEATURES
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            장자늪 카누 체험의 특징
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            안전하고 자연친화적인 공공 관광 프로그램입니다.
          </p>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
