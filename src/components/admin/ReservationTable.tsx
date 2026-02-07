"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_RESERVATIONS,
  RESERVATION_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  type Reservation,
  type ReservationStatus,
  type PaymentStatus,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";
import ReservationFilterBar, {
  type ReservationFilters,
} from "./ReservationFilterBar";
import ReservationDetailDrawer from "./ReservationDetailDrawer";
import {
  hasAnyWarning,
  checkCapacityWarning,
  checkMediaWarnings,
} from "./reservationWarnings";

const INITIAL_FILTERS: ReservationFilters = {
  date: "",
  program: "",
  status: "all",
  mediaServices: [],
};

export default function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [filters, setFilters] = useState<ReservationFilters>(INITIAL_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((resId: string, newStatus: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r)),
    );
  }, []);

  const handlePaymentChange = useCallback((resId: string, newPayment: PaymentStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, paymentStatus: newPayment } : r)),
    );
  }, []);

  // 필터 적용 + 상태 카운트
  const { filtered, statusCounts } = useMemo(() => {
    // 상태 카운트는 상태 필터 이전의 전체 목록 기준
    const preFiltered = reservations.filter((r) => {
      if (filters.date && r.date !== filters.date) return false;
      if (filters.program && r.program !== filters.program) return false;
      if (
        filters.mediaServices.length > 0 &&
        !filters.mediaServices.some((ms) => r.mediaServices.includes(ms))
      )
        return false;
      return true;
    });

    const counts: Record<ReservationStatus | "all", number> = {
      all: preFiltered.length,
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      no_show: 0,
    };
    for (const r of preFiltered) {
      counts[r.status]++;
    }

    const result =
      filters.status === "all"
        ? preFiltered
        : preFiltered.filter((r) => r.status === filters.status);

    return { filtered: result, statusCounts: counts };
  }, [reservations, filters]);

  // 요약 카드 숫자 (전체 기준)
  const counts = useMemo(
    () => ({
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      inProgress: reservations.filter((r) => r.status === "in_progress").length,
      today: reservations.filter((r) => r.date === "2026-03-28").length,
    }),
    [reservations],
  );

  const selectedReservation =
    selectedId ? reservations.find((r) => r.id === selectedId) ?? null : null;

  return (
    <div className="space-y-6">
      {/* ───── 요약 카드 ───── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MiniStat label="전체 예약" value={counts.total} color="text-gray-900" />
        <MiniStat label="대기 중" value={counts.pending} color="text-amber-600" />
        <MiniStat label="확정" value={counts.confirmed} color="text-emerald-600" />
        <MiniStat label="진행 중" value={counts.inProgress} color="text-blue-600" />
        <MiniStat label="오늘 예약" value={counts.today} color="text-violet-600" />
      </div>

      {/* ───── 필터 바 ───── */}
      <ReservationFilterBar
        filters={filters}
        onChange={setFilters}
        statusCounts={statusCounts}
      />

      {/* ───── 테이블 ───── */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[800px]" role="table">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th scope="col" className="w-8 px-2 py-3" />
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500">예약번호</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500">날짜</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500">시간</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500">예약자</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold text-gray-500">프로그램</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold text-gray-500">인원</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold text-gray-500">미디어</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold text-gray-500">결제</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-semibold text-gray-500">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((res) => {
              const statusInfo = RESERVATION_STATUS_MAP[res.status];
              const paymentInfo = PAYMENT_STATUS_MAP[res.paymentStatus];
              const warning = hasAnyWarning(res);
              const isCapacity = checkCapacityWarning(res) !== null;
              const isMedia = checkMediaWarnings(res).length > 0;
              const isSelected = selectedId === res.id;

              // 경고 수준: 정원초과=red, 미디어만=amber
              const warningColor = isCapacity ? "border-red-400" : "border-amber-400";

              return (
                <tr
                  key={res.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    isSelected ? "bg-emerald-50/50" : ""
                  } ${warning ? `border-l-2 ${warningColor}` : ""}`}
                  onClick={() => setSelectedId(res.id)}
                >
                  {/* Warning icon column */}
                  <td className="px-2 py-3 text-center">
                    {warning && (
                      <span
                        className={`inline-block animate-pulse text-sm ${
                          isCapacity ? "text-red-500" : "text-amber-500"
                        }`}
                        title={
                          [
                            isCapacity ? "정원 초과" : "",
                            isMedia ? "미디어 장비 경고" : "",
                          ]
                            .filter(Boolean)
                            .join(", ")
                        }
                      >
                        &#9888;
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-gray-500">{res.id}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{res.date}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{res.time}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{res.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{res.program}</td>
                  <td className="px-3 py-3 text-center text-sm text-gray-900">{res.participants}명</td>
                  <td className="px-3 py-3 text-center">
                    {res.mediaServices.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-1">
                        {res.mediaServices.map((m) => (
                          <span
                            key={m}
                            className="rounded bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <StatusBadge {...paymentInfo} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <StatusBadge {...statusInfo} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-400">해당 조건의 예약이 없습니다.</p>
        )}
      </div>
      <p className="text-xs text-gray-400">행을 클릭하면 상세 정보를 확인할 수 있습니다.</p>

      {/* ───── 상세 드로어 ───── */}
      <ReservationDetailDrawer
        reservation={selectedReservation}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
        onPaymentChange={handlePaymentChange}
      />
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
