"use client";

import { useEffect } from "react";
import {
  RESERVATION_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  type Reservation,
  type ReservationStatus,
  type PaymentStatus,
} from "@/constants/mock-data";
import {
  PROGRAM_PRICE_MAP,
  MEDIA_SERVICE_PRICING,
} from "@/constants/pricing";
import { StatusBadge } from "@/components/admin";
import {
  checkCapacityWarning,
  checkMediaWarnings,
  type CapacityWarning,
  type MediaWarning,
} from "./reservationWarnings";

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ReservationStatus) => void;
  onPaymentChange: (id: string, status: PaymentStatus) => void;
}

const PAYMENT_OPTIONS = Object.entries(PAYMENT_STATUS_MAP).map(
  ([value, { label }]) => ({ value, label }),
);

export default function ReservationDetailDrawer({
  reservation,
  onClose,
  onStatusChange,
  onPaymentChange,
}: Props) {
  // Escape 키 닫기
  useEffect(() => {
    if (!reservation) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [reservation, onClose]);

  if (!reservation) return null;

  const res = reservation;
  const statusInfo = RESERVATION_STATUS_MAP[res.status];
  const paymentInfo = PAYMENT_STATUS_MAP[res.paymentStatus];
  const capacityWarning: CapacityWarning | null = checkCapacityWarning(res);
  const mediaWarnings: MediaWarning[] = checkMediaWarnings(res);
  const hasWarnings = capacityWarning !== null || mediaWarnings.length > 0;

  // 가격 계산
  const programPrice = PROGRAM_PRICE_MAP[res.program] ?? 0;
  const programTotal = programPrice * res.participants;
  const mediaTotal = res.mediaServices.reduce(
    (sum, s) => sum + (MEDIA_SERVICE_PRICING[s] ?? 0),
    0,
  );
  const grandTotal = programTotal + mediaTotal;

  const isTerminal = ["completed", "cancelled", "no_show"].includes(res.status);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-mono text-gray-400">{res.id}</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{res.name}</h2>
              <StatusBadge {...statusInfo} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-5 px-5 py-5">
          {/* Warnings banner */}
          {hasWarnings && (
            <div className="space-y-2">
              {capacityWarning && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <span className="mt-0.5 text-amber-500">&#9888;</span>
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800">정원 초과 경고</p>
                    <p className="text-amber-700">
                      세션 {capacityWarning.sessionId}: 현재 {capacityWarning.current}명 + 예약 {res.participants}명 = {capacityWarning.current + res.participants}명 (최대 {capacityWarning.max}명, {capacityWarning.overflow}명 초과)
                    </p>
                  </div>
                </div>
              )}
              {mediaWarnings.map((w) => (
                <div key={w.service} className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <span className="mt-0.5 text-red-500">&#9888;</span>
                  <div className="text-sm">
                    <p className="font-semibold text-red-800">미디어 장비 경고</p>
                    <p className="text-red-700">{w.service}: 가용 장비 없음 ({w.reason})</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schedule */}
          <Section title="일정">
            <Row label="날짜" value={res.date} />
            <Row label="시간" value={res.time} />
            <Row label="프로그램" value={res.program} />
          </Section>

          {/* Participant info */}
          <Section title="예약자 정보">
            <Row label="이름" value={res.name} />
            <Row
              label="연락처"
              value={
                <a href={`tel:${res.phone}`} className="text-emerald-600 hover:underline">
                  {res.phone}
                </a>
              }
            />
            <Row label="인원" value={`${res.participants}명`} />
          </Section>

          {/* Media add-ons */}
          {res.mediaServices.length > 0 && (
            <Section title="미디어 서비스">
              {res.mediaServices.map((s) => (
                <Row
                  key={s}
                  label={s}
                  value={`${(MEDIA_SERVICE_PRICING[s] ?? 0).toLocaleString()}원`}
                />
              ))}
              <div className="border-t border-gray-100 pt-1">
                <Row label="미디어 소계" value={`${mediaTotal.toLocaleString()}원`} bold />
              </div>
            </Section>
          )}

          {/* Price calculation */}
          <Section title="요금 계산">
            <Row
              label={`${res.program} × ${res.participants}명`}
              value={`${programTotal.toLocaleString()}원`}
            />
            {mediaTotal > 0 && (
              <Row label="미디어 추가" value={`+${mediaTotal.toLocaleString()}원`} />
            )}
            <div className="border-t border-gray-200 pt-1">
              <Row label="합계" value={`${grandTotal.toLocaleString()}원`} bold />
            </div>
          </Section>

          {/* Payment status */}
          <Section title="결제 상태">
            <div className="flex items-center justify-between">
              <StatusBadge {...paymentInfo} />
              <select
                value={res.paymentStatus}
                onChange={(e) => onPaymentChange(res.id, e.target.value as PaymentStatus)}
                className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {PAYMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </Section>

          {/* Memo */}
          <Section title="요청사항">
            <p className="text-sm text-gray-700">{res.memo || "없음"}</p>
          </Section>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 px-5 py-4">
          {isTerminal ? (
            <p className="text-center text-sm text-gray-400">
              {RESERVATION_STATUS_MAP[res.status].label} 상태에서는 변경할 수 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {res.status === "pending" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(res.id, "confirmed")}
                  className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  예약 확정
                </button>
              )}
              {res.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(res.id, "in_progress")}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  체험 시작
                </button>
              )}
              {res.status === "in_progress" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(res.id, "completed")}
                  className="w-full rounded-xl bg-gray-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                >
                  체험 완료
                </button>
              )}
              {/* 취소 버튼 (활성 상태에서만) */}
              <button
                type="button"
                onClick={() => onStatusChange(res.id, "cancelled")}
                className="w-full rounded-xl border border-red-300 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold text-gray-900" : "text-gray-500"}>
        {label}
      </span>
      <span className={bold ? "font-bold text-gray-900" : "text-gray-900"}>
        {value}
      </span>
    </div>
  );
}
