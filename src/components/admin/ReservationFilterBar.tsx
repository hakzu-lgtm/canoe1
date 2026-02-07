"use client";

import {
  RESERVATION_STATUS_MAP,
  type ReservationStatus,
} from "@/constants/mock-data";

const MEDIA_SERVICES = ["드론 촬영", "360 카메라", "모션캠"] as const;

const STATUS_FILTERS: { value: ReservationStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "대기" },
  { value: "confirmed", label: "확정" },
  { value: "in_progress", label: "진행 중" },
  { value: "completed", label: "완료" },
  { value: "cancelled", label: "취소" },
  { value: "no_show", label: "노쇼" },
];

const PROGRAM_OPTIONS = [
  "카누 체험 (일반)",
  "카누 체험 (충주시민)",
  "카누 체험 (동주시민)",
  "카누 체험 (국가유공자)",
  "카누 체험 (숙박 프로모션)",
  "자전거 대여 (일반)",
  "자전거 대여 (2인)",
  "자전거 대여 (어린이용)",
];

export interface ReservationFilters {
  date: string;
  program: string;
  status: ReservationStatus | "all";
  mediaServices: string[];
}

interface Props {
  filters: ReservationFilters;
  onChange: (filters: ReservationFilters) => void;
  statusCounts: Record<ReservationStatus | "all", number>;
}

export default function ReservationFilterBar({ filters, onChange, statusCounts }: Props) {
  function set<K extends keyof ReservationFilters>(key: K, value: ReservationFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  function toggleMedia(service: string) {
    const next = filters.mediaServices.includes(service)
      ? filters.mediaServices.filter((s) => s !== service)
      : [...filters.mediaServices, service];
    set("mediaServices", next);
  }

  return (
    <div className="space-y-3">
      {/* Row 1: Date + Program */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => set("date", e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
        <select
          value={filters.program}
          onChange={(e) => set("program", e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">전체 프로그램</option>
          {PROGRAM_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {(filters.date || filters.program || filters.mediaServices.length > 0) && (
          <button
            type="button"
            onClick={() => onChange({ date: "", program: "", status: filters.status, mediaServices: [] })}
            className="rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* Row 2: Status pills */}
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => set("status", f.value)}
            className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
              filters.status === f.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
            <span className="ml-1 opacity-60">{statusCounts[f.value] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Row 3: Media service toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-400">미디어:</span>
        {MEDIA_SERVICES.map((m) => {
          const active = filters.mediaServices.includes(m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => toggleMedia(m)}
              className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? "bg-violet-600 text-white"
                  : "bg-violet-50 text-violet-700 hover:bg-violet-100"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
