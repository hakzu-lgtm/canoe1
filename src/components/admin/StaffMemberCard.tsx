"use client";

import {
  STAFF_ROLE_MAP,
  STAFF_STATUS_MAP,
  SHIFT_MAP,
  type Staff,
  type StaffScheduleEntry,
  type StaffStatus,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface StaffMemberCardProps {
  staff: Staff;
  entry: StaffScheduleEntry | null;
  linkedSessionCount: number;
  onCardClick: () => void;
  onStatusChange: (entryId: string, newStatus: StaffStatus) => void;
}

const QUICK_STATUSES: StaffStatus[] = ["on_duty", "break", "off_duty"];

const ROLE_AVATAR_COLOR: Record<string, string> = {
  chief_guide: "bg-emerald-50 text-emerald-600",
  canoe_guide: "bg-blue-50 text-blue-600",
  support_staff: "bg-violet-50 text-violet-600",
};

export default function StaffMemberCard({
  staff,
  entry,
  linkedSessionCount,
  onCardClick,
  onStatusChange,
}: StaffMemberCardProps) {
  const roleInfo = STAFF_ROLE_MAP[staff.role];
  const statusInfo = entry ? STAFF_STATUS_MAP[entry.status] : null;
  const shiftInfo = entry ? SHIFT_MAP[entry.shift] : null;

  const borderColor = entry
    ? entry.status === "absent"
      ? "border-red-200"
      : entry.status === "on_duty"
        ? "border-emerald-200"
        : entry.status === "break"
          ? "border-amber-200"
          : "border-gray-200"
    : "border-gray-200";

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${borderColor}`}
    >
      {/* Header: Avatar + Name + Role + Status */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${ROLE_AVATAR_COLOR[staff.role] ?? "bg-gray-50 text-gray-600"}`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">{staff.name}</p>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${roleInfo.color} ${roleInfo.bg}`}
          >
            {roleInfo.label}
          </span>
        </div>
        {statusInfo && <StatusBadge {...statusInfo} />}
      </div>

      {/* Contact shortcuts */}
      <div className="mb-3 flex gap-2">
        <a
          href={`tel:${staff.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-50 py-2.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 min-h-[44px]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          전화
        </a>
        <a
          href={`sms:${staff.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 min-h-[44px]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          메시지
        </a>
      </div>

      {/* Shift info */}
      {shiftInfo ? (
        <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">{shiftInfo.label}</span>
            <span className="text-xs text-gray-400">{shiftInfo.time}</span>
          </div>
        </div>
      ) : (
        <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-center text-sm text-gray-400">
          미배정
        </div>
      )}

      {/* Session count */}
      {linkedSessionCount > 0 && (
        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <span className="font-medium">배정 세션:</span> {linkedSessionCount}건
        </div>
      )}

      {/* Emergency absence toggle */}
      {entry && entry.status === "absent" && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="font-bold text-red-700">결근 상태 - 대체 인력 필요</span>
        </div>
      )}
      {entry && entry.status !== "absent" && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(entry.id, "absent");
          }}
          className="mb-3 w-full rounded-lg border-2 border-red-200 bg-red-50 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 min-h-[44px]"
        >
          긴급 결근 처리
        </button>
      )}

      {/* Quick status buttons */}
      {entry && (
        <div
          className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3"
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
                className={`rounded-lg px-3 py-3 min-h-[44px] text-xs font-medium transition-colors ${
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
      )}
    </div>
  );
}
