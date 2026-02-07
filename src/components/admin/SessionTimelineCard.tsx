"use client";

import {
  SESSION_STATUS_MAP,
  WEATHER_STATUS_MAP,
  type CanoeSession,
  type SessionStatus,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface SessionTimelineCardProps {
  session: CanoeSession;
  isLast: boolean;
  onCardClick: () => void;
  onStatusChange: (sessionId: string, newStatus: SessionStatus) => void;
}

const STATUS_KEYS: SessionStatus[] = ["open", "closed", "suspended"];

export default function SessionTimelineCard({
  session,
  isLast,
  onCardClick,
  onStatusChange,
}: SessionTimelineCardProps) {
  const capacityPercent = Math.round(
    (session.currentParticipants / session.maxCapacity) * 100,
  );
  const isFull = session.currentParticipants >= session.maxCapacity;
  const isNearCapacity = capacityPercent >= 80 && !isFull;
  const isWeatherDangerous =
    session.weather === "heavy_rain" || session.weather === "strong_wind";
  const statusInfo = SESSION_STATUS_MAP[session.status];
  const weatherInfo = WEATHER_STATUS_MAP[session.weather];

  const borderColor =
    session.status === "suspended"
      ? "border-red-200"
      : isNearCapacity || isFull
        ? "border-amber-200"
        : "border-gray-200";

  return (
    <div className="flex gap-4">
      {/* ── Time pillar ── */}
      <div className="flex w-16 flex-shrink-0 flex-col items-center pt-1">
        <span className="text-lg font-bold text-gray-900">{session.time}</span>
        {!isLast && <div className="mt-2 h-full w-px bg-gray-200" />}
      </div>

      {/* ── Card body ── */}
      <div
        onClick={onCardClick}
        className={`mb-2 flex-1 cursor-pointer rounded-xl border bg-white p-4 transition-shadow hover:shadow-md ${borderColor}`}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{session.id}</span>
            <span className="text-lg" title={weatherInfo.label}>
              {weatherInfo.icon}
            </span>
            <StatusBadge {...statusInfo} />
          </div>
          <div className="flex items-center gap-1.5">
            {isNearCapacity && (
              <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                &#9888; 정원 임박
              </span>
            )}
            {isFull && (
              <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                &#9888; 마감
              </span>
            )}
            {isWeatherDangerous && (
              <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                &#9888; 운영 불가
              </span>
            )}
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-gray-500">
              참가 인원:{" "}
              <span className="font-bold text-gray-900">
                {session.currentParticipants}
              </span>{" "}
              / {session.maxCapacity}명
            </span>
            <span
              className={`font-bold ${
                isFull
                  ? "text-red-500"
                  : isNearCapacity
                    ? "text-amber-600"
                    : "text-emerald-600"
              }`}
            >
              {isFull
                ? "마감"
                : `잔여 ${session.maxCapacity - session.currentParticipants}명`}
            </span>
          </div>
          <div
            className={`h-2 overflow-hidden rounded-full bg-gray-100 ${
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
        </div>

        {/* Guide chips */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {session.assignedGuides.map((g) => (
              <span
                key={g}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Status toggle buttons */}
        <div
          className="flex items-center gap-1.5 border-t border-gray-100 pt-3"
          onClick={(e) => e.stopPropagation()}
        >
          {STATUS_KEYS.map((st) => {
            const info = SESSION_STATUS_MAP[st];
            const isActive = session.status === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(session.id, st)}
                className={`rounded-lg px-4 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? `${info.bg} ${info.color} ring-1 ring-current`
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                }`}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
