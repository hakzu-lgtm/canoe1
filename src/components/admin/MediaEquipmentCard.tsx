"use client";

import {
  MEDIA_TYPE_MAP,
  MEDIA_STATUS_MAP,
  type MediaEquipment,
  type MediaStatus,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface MediaEquipmentCardProps {
  equipment: MediaEquipment;
  weatherDisabled: boolean;
  onCardClick: () => void;
  onQuickStatusChange: (newStatus: MediaStatus) => void;
}

export default function MediaEquipmentCard({
  equipment: eq,
  weatherDisabled,
  onCardClick,
  onQuickStatusChange,
}: MediaEquipmentCardProps) {
  const typeInfo = MEDIA_TYPE_MAP[eq.type];
  const statusInfo = MEDIA_STATUS_MAP[eq.status];

  const borderColor = weatherDisabled
    ? "border-red-200"
    : eq.status === "in_use"
      ? "border-blue-200"
      : eq.status === "charging"
        ? "border-violet-200"
        : eq.status === "maintenance"
          ? "border-amber-200"
          : eq.status === "unavailable_weather"
            ? "border-red-200"
            : "border-gray-200";

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${borderColor}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-xl">
            {typeInfo.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{eq.label}</p>
            <p className="text-xs text-gray-400">
              {eq.id} &middot; {typeInfo.label}
            </p>
          </div>
        </div>
        <StatusBadge {...statusInfo} />
      </div>

      {/* Weather disabled banner (drones) */}
      {weatherDisabled && eq.type === "drone" && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="font-semibold text-red-700">
            기상 조건으로 비행 불가
          </span>
        </div>
      )}

      {/* Linked reservation */}
      {eq.linkedReservation && (
        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <span className="font-medium">연결 예약:</span> {eq.linkedReservation}
          {eq.note && <span className="ml-1 text-blue-500">({eq.note})</span>}
        </div>
      )}

      {/* Note (when no linked reservation) */}
      {eq.note && !eq.linkedReservation && (
        <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
          {eq.note}
        </div>
      )}

      {/* Weather unavailable info */}
      {eq.status === "unavailable_weather" && !weatherDisabled && (
        <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          기상 조건으로 사용이 불가합니다.
        </div>
      )}

      {/* Quick action buttons */}
      <div
        className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        {eq.status === "available" && (
          <>
            <button
              type="button"
              onClick={() => onQuickStatusChange("in_use")}
              className="flex-1 rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              사용 시작
            </button>
            <button
              type="button"
              onClick={() => onQuickStatusChange("charging")}
              className="rounded-lg border border-violet-300 px-3 py-3 text-xs font-semibold text-violet-600 transition-colors hover:bg-violet-50"
            >
              충전
            </button>
            <button
              type="button"
              onClick={() => onQuickStatusChange("maintenance")}
              className="rounded-lg border border-amber-300 px-3 py-3 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-50"
            >
              점검
            </button>
          </>
        )}
        {eq.status === "in_use" && (
          <button
            type="button"
            onClick={() => onQuickStatusChange("available")}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            반납
          </button>
        )}
        {eq.status === "charging" && (
          <button
            type="button"
            onClick={() => onQuickStatusChange("available")}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            충전 완료
          </button>
        )}
        {eq.status === "maintenance" && (
          <button
            type="button"
            onClick={() => onQuickStatusChange("available")}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            점검 완료
          </button>
        )}
        {eq.status === "unavailable_weather" && (
          <button
            type="button"
            onClick={() => onQuickStatusChange("available")}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            기상 해제
          </button>
        )}
      </div>
    </div>
  );
}
