"use client";

import { useEffect, useState } from "react";
import {
  MEDIA_TYPE_MAP,
  MEDIA_STATUS_MAP,
  MOCK_RESERVATIONS,
  type MediaEquipment,
  type MediaStatus,
  type Reservation,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

const ALL_STATUSES: MediaStatus[] = [
  "available",
  "in_use",
  "charging",
  "maintenance",
  "unavailable_weather",
];

interface Props {
  equipment: MediaEquipment | null;
  weatherDisabled: boolean;
  availableReservations: Reservation[];
  onClose: () => void;
  onStatusChange: (eqId: string, newStatus: MediaStatus) => void;
  onLinkReservation: (eqId: string, reservationId: string) => void;
  onUnlinkReservation: (eqId: string) => void;
  onUpdateNote: (eqId: string, note: string) => void;
}

export default function MediaEquipmentDrawer({
  equipment: eq,
  weatherDisabled,
  availableReservations,
  onClose,
  onStatusChange,
  onLinkReservation,
  onUnlinkReservation,
  onUpdateNote,
}: Props) {
  const [linkResId, setLinkResId] = useState("");
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    setLinkResId("");
    setNoteValue(eq?.note ?? "");
  }, [eq?.id, eq?.note]);

  useEffect(() => {
    if (!eq) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [eq, onClose]);

  if (!eq) return null;

  const typeInfo = MEDIA_TYPE_MAP[eq.type];
  const statusInfo = MEDIA_STATUS_MAP[eq.status];

  // 연결된 예약의 상세 정보 조회
  const linkedReservation = eq.linkedReservation
    ? MOCK_RESERVATIONS.find((r) => r.id === eq.linkedReservation) ?? null
    : null;

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
            <p className="text-xs font-mono text-gray-400">{eq.id}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl">{typeInfo.icon}</span>
              <h2 className="text-lg font-bold text-gray-900">{eq.label}</h2>
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
          {weatherDisabled && eq.type === "drone" && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <span className="mt-0.5 animate-pulse text-red-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-red-800">기상 경고</p>
                <p className="text-red-700">
                  강풍 또는 폭우 감지 - 드론 비행이 불가합니다
                </p>
              </div>
            </div>
          )}
          {eq.status === "maintenance" && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
              <span className="mt-0.5 text-amber-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-amber-800">점검 중</p>
                <p className="text-amber-700">
                  현재 정비 점검이 진행 중입니다
                </p>
              </div>
            </div>
          )}

          {/* Equipment info */}
          <Section title="장비 정보">
            <Row label="ID" value={eq.id} />
            <Row label="종류" value={`${typeInfo.icon} ${typeInfo.label}`} />
            <Row label="상태" value={statusInfo.label} />
          </Section>

          {/* Note (editable) */}
          <Section title="메모">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="메모 입력"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                disabled={noteValue === eq.note}
                onClick={() => onUpdateNote(eq.id, noteValue)}
                className="rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-40"
              >
                저장
              </button>
            </div>
          </Section>

          {/* Reservation linking */}
          <Section title="연결 예약">
            {eq.linkedReservation ? (
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {eq.linkedReservation}
                  </p>
                  {linkedReservation && (
                    <p className="text-xs text-blue-600">
                      {linkedReservation.name} &middot;{" "}
                      {linkedReservation.participants}명 &middot;{" "}
                      {linkedReservation.date} {linkedReservation.time}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onUnlinkReservation(eq.id)}
                  className="rounded-lg border border-blue-200 px-4 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                >
                  연결 해제
                </button>
              </div>
            ) : (
              <div>
                {availableReservations.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    연결 가능한 예약이 없습니다.
                  </p>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={linkResId}
                      onChange={(e) => setLinkResId(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">예약 선택</option>
                      {availableReservations.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.id} - {r.name} ({r.date} {r.time})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!linkResId}
                      onClick={() => {
                        if (linkResId) {
                          onLinkReservation(eq.id, linkResId);
                          setLinkResId("");
                        }
                      }}
                      className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
                    >
                      연결
                    </button>
                  </div>
                )}
              </div>
            )}
          </Section>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 px-5 py-4">
          {/* Context-aware actions */}
          <div className="flex flex-col gap-2">
            {eq.status === "available" && (
              <>
                <button
                  type="button"
                  onClick={() => onStatusChange(eq.id, "in_use")}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  사용 시작
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onStatusChange(eq.id, "charging")}
                    className="flex-1 rounded-xl border border-violet-300 py-3.5 text-sm font-semibold text-violet-600 transition-colors hover:bg-violet-50"
                  >
                    충전 등록
                  </button>
                  <button
                    type="button"
                    onClick={() => onStatusChange(eq.id, "maintenance")}
                    className="flex-1 rounded-xl border border-amber-300 py-3.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                  >
                    점검 등록
                  </button>
                </div>
              </>
            )}
            {eq.status === "in_use" && (
              <button
                type="button"
                onClick={() => onStatusChange(eq.id, "available")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                사용 완료
              </button>
            )}
            {eq.status === "charging" && (
              <button
                type="button"
                onClick={() => onStatusChange(eq.id, "available")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                충전 완료
              </button>
            )}
            {eq.status === "maintenance" && (
              <button
                type="button"
                onClick={() => onStatusChange(eq.id, "available")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                점검 완료
              </button>
            )}
            {eq.status === "unavailable_weather" && (
              <button
                type="button"
                onClick={() => onStatusChange(eq.id, "available")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                기상 해제 (수동)
              </button>
            )}
          </div>

          {/* Emergency override */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-semibold text-red-500">
              긴급 수동 변경
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_STATUSES.filter((s) => s !== eq.status).map((s) => {
                const info = MEDIA_STATUS_MAP[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onStatusChange(eq.id, s)}
                    className="rounded-lg border border-red-200 px-3 py-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
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
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
