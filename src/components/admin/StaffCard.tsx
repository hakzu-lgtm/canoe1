"use client";

import {
  STAFF_ROLE_MAP,
  STAFF_STATUS_MAP,
  SHIFT_MAP,
  MOCK_SESSIONS,
  type Staff,
  type StaffScheduleEntry,
  type StaffStatus,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface StaffCardProps {
  staff: Staff;
  entry: StaffScheduleEntry;
  linkedSessionCount: number;
  onCardClick: () => void;
  onStatusChange: (entryId: string, newStatus: StaffStatus) => void;
}

const QUICK_STATUSES: StaffStatus[] = ["on_duty", "break", "off_duty"];

export default function StaffCard({
  staff,
  entry,
  linkedSessionCount,
  onCardClick,
  onStatusChange,
}: StaffCardProps) {
  const roleInfo = STAFF_ROLE_MAP[staff.role];
  const statusInfo = STAFF_STATUS_MAP[entry.status];
  const shiftInfo = SHIFT_MAP[entry.shift];

  const borderColor =
    entry.status === "absent"
      ? "border-red-200"
      : entry.status === "on_duty"
        ? "border-emerald-200"
        : entry.status === "break"
          ? "border-amber-200"
          : "border-gray-200";

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${borderColor}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RoleIcon role={staff.role} />
          <div>
            <p className="text-sm font-bold text-gray-900">{staff.name}</p>
            <p className="text-xs text-gray-400">{staff.id}</p>
          </div>
        </div>
        <StatusBadge {...statusInfo} />
      </div>

      {/* Role badge */}
      <div className="mb-3">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleInfo.color} ${roleInfo.bg}`}>
          {roleInfo.label}
        </span>
      </div>

      {/* Shift info */}
      <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">{shiftInfo.label}</span>
          <span className="text-xs text-gray-400">{shiftInfo.time}</span>
        </div>
      </div>

      {/* Linked sessions */}
      {linkedSessionCount > 0 && (
        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <span className="font-medium">배정 세션:</span> {linkedSessionCount}건
        </div>
      )}

      {/* Absent warning */}
      {entry.status === "absent" && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="font-semibold text-red-700">결근 - 대체 인력 필요</span>
        </div>
      )}

      {/* Quick status buttons */}
      <div
        className="flex items-center gap-1.5 border-t border-gray-100 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        {QUICK_STATUSES.map((st) => {
          const info = STAFF_STATUS_MAP[st];
          const isActive = entry.status === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => onStatusChange(entry.id, st)}
              className={`flex-1 rounded-lg px-3 py-3 min-h-[44px] text-xs font-medium transition-colors ${
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
  );
}

function RoleIcon({ role }: { role: string }) {
  const color =
    role === "chief_guide"
      ? "text-emerald-500 bg-emerald-50"
      : role === "canoe_guide"
        ? "text-blue-500 bg-blue-50"
        : "text-violet-500 bg-violet-50";
  return (
    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
  );
}
