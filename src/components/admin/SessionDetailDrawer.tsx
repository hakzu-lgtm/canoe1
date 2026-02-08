"use client";

import { useEffect, useState } from "react";
import {
  SESSION_STATUS_MAP,
  WEATHER_STATUS_MAP,
  RESERVATION_STATUS_MAP,
  type CanoeSession,
  type SessionStatus,
  type Reservation,
} from "@/constants/mock-data";
import type { StaffAvailability } from "@/contexts/StaffContext";
import { StatusBadge } from "@/components/admin";
import StaffAvailabilityIndicator from "./StaffAvailabilityIndicator";

interface Props {
  session: CanoeSession | null;
  linkedReservations: Reservation[];
  allGuides: string[];
  guideAvailability?: Record<
    string,
    { availability: StaffAvailability; overlaps: CanoeSession[] }
  >;
  onClose: () => void;
  onStatusChange: (sessionId: string, newStatus: SessionStatus) => void;
  onAddGuide: (sessionId: string, guide: string) => void;
  onRemoveGuide: (sessionId: string, guide: string) => void;
}

export default function SessionDetailDrawer({
  session,
  linkedReservations,
  allGuides,
  guideAvailability,
  onClose,
  onStatusChange,
  onAddGuide,
  onRemoveGuide,
}: Props) {
  const [confirmingGuide, setConfirmingGuide] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [session, onClose]);

  useEffect(() => {
    if (!session) setConfirmingGuide(null);
  }, [session]);

  if (!session) return null;

  const statusInfo = SESSION_STATUS_MAP[session.status];
  const weatherInfo = WEATHER_STATUS_MAP[session.weather];
  const capacityPercent = Math.round(
    (session.currentParticipants / session.maxCapacity) * 100,
  );
  const isFull = session.currentParticipants >= session.maxCapacity;
  const isNearCapacity = capacityPercent >= 80 && !isFull;
  const isWeatherDangerous =
    session.weather === "heavy_rain" || session.weather === "strong_wind";
  const unassignedGuides = allGuides.filter(
    (g) => !session.assignedGuides.includes(g),
  );

  function handleAddGuideClick(guide: string) {
    const info = guideAvailability?.[guide];
    if (info && info.availability === "on_shift_other_session") {
      setConfirmingGuide(guide);
      return;
    }
    onAddGuide(session!.id, guide);
  }

  function confirmAdd() {
    if (confirmingGuide && session) {
      onAddGuide(session.id, confirmingGuide);
      setConfirmingGuide(null);
    }
  }

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
            <p className="text-xs font-mono text-gray-400">{session.id}</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                {session.date.slice(5).replace("-", "/")} &middot; {session.time}
              </h2>
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
          {/* Warning banners */}
          {(isNearCapacity || isFull) && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
              <span className="mt-0.5 text-amber-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-amber-800">
                  정원 {isFull ? "마감" : "임박"}
                </p>
                <p className="text-amber-700">
                  현재 {session.currentParticipants}명 / 최대{" "}
                  {session.maxCapacity}명 ({capacityPercent}%)
                </p>
              </div>
            </div>
          )}
          {isWeatherDangerous && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <span className="mt-0.5 text-red-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-red-800">기상 경고</p>
                <p className="text-red-700">
                  {weatherInfo.icon} {weatherInfo.label} - 운영 불가 기상 조건
                </p>
              </div>
            </div>
          )}

          {/* Session info */}
          <Section title="세션 정보">
            <Row label="날짜" value={session.date} />
            <Row label="시간" value={session.time} />
            <Row
              label="기상"
              value={`${weatherInfo.icon} ${weatherInfo.label}`}
            />
            <Row
              label="정원"
              value={`${session.currentParticipants} / ${session.maxCapacity}명`}
            />
          </Section>

          {/* Capacity bar */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              정원 현황
            </h3>
            <div
              className={`h-3 overflow-hidden rounded-full bg-gray-100 ${
                isNearCapacity ? "ring-1 ring-amber-300" : ""
              }`}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  isFull
                    ? "bg-red-400"
                    : isNearCapacity
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                }`}
                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {capacityPercent}% 사용 &middot; 잔여{" "}
              {Math.max(session.maxCapacity - session.currentParticipants, 0)}명
            </p>
          </div>

          {/* Guide management with availability */}
          <Section title="배정 가이드">
            <div className="space-y-2">
              {session.assignedGuides.length === 0 && (
                <p className="text-sm text-gray-400">배정된 가이드가 없습니다.</p>
              )}
              {session.assignedGuides.map((g) => {
                const avail = guideAvailability?.[g];
                return (
                  <div key={g} className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                      {g}
                      <button
                        type="button"
                        onClick={() => onRemoveGuide(session.id, g)}
                        className="ml-0.5 rounded-full p-1 hover:bg-emerald-100"
                        aria-label={`${g} 제거`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                    {avail && avail.availability !== "available" && (
                      <StaffAvailabilityIndicator
                        availability={avail.availability}
                        overlappingSessions={avail.overlaps}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Unassigned guides with availability */}
            {unassignedGuides.length > 0 && (
              <div className="mt-3">
                <p className="mb-1.5 text-xs text-gray-400">가이드 추가</p>
                <div className="space-y-2">
                  {unassignedGuides.map((g) => {
                    const avail = guideAvailability?.[g];
                    const isUnavailable =
                      avail &&
                      (avail.availability === "absent" ||
                        avail.availability === "off_duty" ||
                        avail.availability === "off_shift");
                    const hasOverlap =
                      avail && avail.availability === "on_shift_other_session";

                    return (
                      <div key={g}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddGuideClick(g)}
                            disabled={!!isUnavailable}
                            className={`rounded-full border border-dashed px-3 py-2 text-xs font-medium transition-colors ${
                              isUnavailable
                                ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300"
                                : hasOverlap
                                  ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "border-gray-300 text-gray-500 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            + {g}
                          </button>
                          {avail && (
                            <StaffAvailabilityIndicator
                              availability={avail.availability}
                              overlappingSessions={avail.overlaps}
                            />
                          )}
                        </div>

                        {/* Overlap confirmation */}
                        {confirmingGuide === g && (
                          <div className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                            <p className="text-xs text-amber-800">
                              이 가이드는 같은 시간대 다른 세션에 배정되어 있습니다. 그래도 배정하시겠습니까?
                            </p>
                            <div className="mt-1.5 flex gap-2">
                              <button
                                type="button"
                                onClick={confirmAdd}
                                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                              >
                                확인
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmingGuide(null)}
                                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Section>

          {/* Linked reservations */}
          <Section title={`연결된 예약 (${linkedReservations.length}건)`}>
            {linkedReservations.length === 0 ? (
              <p className="text-sm text-gray-400">연결된 예약이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {linkedReservations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {r.id} &middot; {r.participants}명
                      </p>
                    </div>
                    <StatusBadge {...RESERVATION_STATUS_MAP[r.status]} />
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 px-5 py-4">
          <p className="mb-2 text-xs text-gray-400">세션 상태 변경</p>
          <div className="flex flex-col gap-2">
            {session.status !== "open" && (
              <button
                type="button"
                onClick={() => onStatusChange(session.id, "open")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                운영 시작
              </button>
            )}
            {session.status !== "closed" && (
              <button
                type="button"
                onClick={() => onStatusChange(session.id, "closed")}
                className="w-full rounded-xl bg-gray-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                마감
              </button>
            )}
            {session.status !== "suspended" && (
              <button
                type="button"
                onClick={() => onStatusChange(session.id, "suspended")}
                className="w-full rounded-xl border border-red-300 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                운영 중단
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
