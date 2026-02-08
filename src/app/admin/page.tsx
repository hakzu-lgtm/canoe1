import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin";
import StatusLogTable from "@/components/admin/StatusLogTable";
import {
  MissingRoleAlert,
  TodayStaffWidget,
  ShiftChangeWidget,
  UnifiedOpsPanel,
} from "@/components/admin/dashboard";
import {
  MOCK_BIKES,
  MOCK_RESERVATIONS,
  MOCK_SESSIONS,
  MOCK_MEDIA,
  MOCK_STAFF,
  MOCK_STAFF_SCHEDULE,
} from "@/constants/mock-data";

export const metadata: Metadata = {
  title: "관리자 | 장자늪 카누 체험장",
};

const TODAY = "2026-03-28";

export default function AdminPage() {
  const todayReservations = MOCK_RESERVATIONS.filter((r) => r.date === TODAY);
  const pendingCount = MOCK_RESERVATIONS.filter((r) => r.status === "pending").length;
  const rentedBikes = MOCK_BIKES.filter((b) => b.status === "rented").length;
  const openSessions = MOCK_SESSIONS.filter((s) => s.status === "open" && s.date === TODAY).length;
  const mediaAvailable = MOCK_MEDIA.filter((m) => m.status === "available").length;
  const activeStaffCount = MOCK_STAFF_SCHEDULE.filter(
    (e) => e.date === TODAY && e.status !== "absent" && e.status !== "off_duty",
  ).length;

  return (
    <div>
      {/* ───── 헤더 ───── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-gray-500">
          장자늪 카누 체험장 운영 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* ───── 인력 부족 경고 배너 ───── */}
      <MissingRoleAlert date={TODAY} />

      {/* ───── 통계 카드 ───── */}
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="오늘 예약"
          value={`${todayReservations.length}건`}
          subtitle="2026-03-28 기준"
          accentColor="text-blue-600"
          icon={<IconCalendar />}
        />
        <StatCard
          title="대기 예약"
          value={`${pendingCount}건`}
          subtitle="확인 필요"
          accentColor="text-amber-600"
          icon={<IconClock />}
        />
        <StatCard
          title="오늘 운영 세션"
          value={`${openSessions}회`}
          subtitle={`전체 ${MOCK_SESSIONS.filter((s) => s.date === TODAY).length}회 중`}
          accentColor="text-emerald-600"
          icon={<IconWater />}
        />
        <StatCard
          title="자전거 대여 중"
          value={`${rentedBikes}대`}
          subtitle={`전체 ${MOCK_BIKES.length}대 중`}
          accentColor="text-violet-600"
          icon={<IconBike />}
        />
        <StatCard
          title="미디어 사용 가능"
          value={`${mediaAvailable}대`}
          subtitle={`전체 ${MOCK_MEDIA.length}대 중`}
          accentColor="text-pink-600"
          icon={<IconCamera />}
        />
        <StatCard
          title="오늘 근무 인원"
          value={`${activeStaffCount}명`}
          subtitle={`전체 ${MOCK_STAFF.length}명 중`}
          accentColor="text-teal-600"
          icon={<IconStaff />}
        />
      </div>

      {/* ───── 운영 현황 + 스태프 (2단 레이아웃) ───── */}
      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-8">
        {/* 왼쪽: 통합 운영 패널 */}
        <div className="lg:col-span-5">
          <UnifiedOpsPanel date={TODAY} />
        </div>

        {/* 오른쪽: 스태프 위젯 */}
        <div className="space-y-6 lg:col-span-3">
          <TodayStaffWidget date={TODAY} />
          <ShiftChangeWidget date={TODAY} />
        </div>
      </div>

      {/* ───── 빠른 이동 ───── */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">빠른 이동</h2>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <QuickLink href="/admin/reservation-management" title="예약 관리" desc="예약 현황 및 상태 변경" color="emerald" />
        <QuickLink href="/admin/canoe-sessions" title="카누 세션 관리" desc="회차별 운영 상태 관리" color="blue" />
        <QuickLink href="/admin/bike-rental" title="자전거 대여 관리" desc="자전거 대여 현황 관리" color="violet" />
        <QuickLink href="/admin/media-equipment" title="미디어 장비 관리" desc="드론/카메라/모션캠 관리" color="pink" />
        <QuickLink href="/admin/staff-scheduling" title="스태프 일정" desc="근무 일정 및 배정 관리" color="teal" />
      </div>

      {/* ───── 오늘 예약 미리보기 ───── */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        오늘의 예약 (3/28)
      </h2>
      {todayReservations.length === 0 ? (
        <p className="mb-10 py-8 text-center text-sm text-gray-400">오늘 예약이 없습니다.</p>
      ) : (
        <div className="mb-10 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">시간</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">예약자</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">프로그램</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">인원</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">미디어</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">결제</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todayReservations.map((r) => {
                const statusCls =
                  r.status === "confirmed" ? "text-emerald-700 bg-emerald-50"
                  : r.status === "in_progress" ? "text-blue-700 bg-blue-50"
                  : r.status === "pending" ? "text-amber-700 bg-amber-50"
                  : "text-gray-600 bg-gray-100";
                const statusLabel =
                  r.status === "confirmed" ? "확정"
                  : r.status === "in_progress" ? "진행 중"
                  : r.status === "pending" ? "대기"
                  : r.status;
                const payCls = r.paymentStatus === "paid" ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50";
                const payLabel = r.paymentStatus === "paid" ? "결제완료" : "미결제";
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{r.program}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">{r.participants}명</td>
                    <td className="px-4 py-3 text-center">
                      {r.mediaServices.length > 0 ? (
                        <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
                          {r.mediaServices.join(", ")}
                        </span>
                      ) : <span className="text-xs text-gray-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${payCls}`}>{payLabel}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCls}`}>{statusLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ───── 상태 변경 로그 ───── */}
      <h2 className="mb-4 text-lg font-bold text-gray-900">최근 상태 변경 로그</h2>
      <StatusLogTable />
    </div>
  );
}

/* ── 빠른 이동 카드 ── */
function QuickLink({ href, title, desc, color }: { href: string; title: string; desc: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600",
    pink: "bg-pink-50 text-pink-600 group-hover:bg-pink-600",
    teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-600",
  };
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:text-white ${colorMap[color]}`}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="truncate text-xs text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}

/* ── 아이콘들 ── */
function IconCalendar() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
}
function IconClock() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconWater() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
}
function IconBike() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375m0 0V4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v9.375m0 0h.375" /></svg>;
}
function IconCamera() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>;
}
function IconStaff() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
}
