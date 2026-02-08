import Image from "next/image";

/**
 * 갤러리 이미지 목록
 * src를 실제 촬영 사진 경로로 교체하세요.
 * 권장 해상도: 최소 800×600px
 */
const GALLERY_ITEMS = [
  {
    src: "/images/gallery-canoe.jpg",
    alt: "카누 체험 모습",
    label: "카누 체험",
    span: "md:col-span-2 md:row-span-2", // 큰 카드
  },
  {
    src: "/images/gallery-waterway.jpg",
    alt: "장자늪 수로 풍경",
    label: "장자늪 수로",
    span: "",
  },
  {
    src: "/images/gallery-safety.jpg",
    alt: "안전 장비 착용 모습",
    label: "안전 장비",
    span: "",
  },
  {
    src: "/images/gallery-group.jpg",
    alt: "단체 카누 체험 활동",
    label: "단체 체험",
    span: "",
  },
  {
    src: "/images/gallery-drone.jpg",
    alt: "드론으로 촬영한 수로 항공 뷰",
    label: "드론 항공샷",
    span: "",
  },
  {
    src: "/images/gallery-bike.jpg",
    alt: "자전거 대여 프로그램",
    label: "자전거 대여",
    span: "",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-gray-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-600">
            GALLERY
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            체험 갤러리
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            장자늪의 아름다운 자연과 카누 체험의 순간들을 만나보세요.
          </p>
        </div>

        {/* 이미지 그리드 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[220px]">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl ${item.span}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="px-5 pb-5 text-sm font-semibold text-white">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
