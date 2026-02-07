import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-emerald-800 py-20 md:py-28">
      {/* 배경 장식 */}
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-700/50 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-900/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-300">
          RESERVATION
        </p>
        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
          장자늪에서 특별한 하루를 시작하세요
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-emerald-100/80">
          고요한 수로 위 카누 체험부터 자전거 라이딩까지,
          자연 속 힐링 프로그램을 온라인으로 간편하게 예약하세요.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/programs"
            className="w-full rounded-full border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
          >
            프로그램 보기
          </Link>
          <Link
            href="/reservation"
            className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-emerald-800 shadow-lg transition-all hover:bg-emerald-50 sm:w-auto"
          >
            예약하기
          </Link>
        </div>

        {/* 안내 텍스트 */}
        <p className="mt-8 text-xs text-emerald-300/60">
          현장 구매도 가능하며, 잔여석에 한해 이용 가능합니다.
          <br />
          기상 및 안전 상황에 따라 운영이 변경될 수 있습니다.
        </p>
      </div>
    </section>
  );
}
