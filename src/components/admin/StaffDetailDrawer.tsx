"use client";

import { useEffect } from "react";
import {
  STAFF_ROLE_MAP,
  STAFF_STATUS_MAP,
  SHIFT_MAP,
  MOCK_SESSIONS,
  type Staff,
  type StaffScheduleEntry,
  type StaffStatus,
  type ShiftType,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface Props {
  staff: Staff | null;
  entry: StaffScheduleEntry | null;
  weekEntries: StaffScheduleEntry[];
  onClose: () => void;
  onStatusChange: (entryId: string, newStatus: StaffStatus) => void;
  onShiftChange: (entryId: string, newShift: ShiftType) => void;
}

const SHIFT_KEYS: ShiftType[] = ["full", "morning", "afternoon"];

export default function StaffDetailDrawer({
  staff,
  entry,
  weekEntries,
  onClose,
  onStatusChange,
  onShiftChange,
}: Props) {
  useEffect(() => {
    if (!staff) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [staff, onClose]);

  if (!staff || !entry) return null;

  const roleInfo = STAFF_ROLE_MAP[staff.role];
  const statusInfo = STAFF_STATUS_MAP[entry.status];
  const shiftInfo = SHIFT_MAP[entry.shift];

  // Find sessions this staff is assigned to on the entry date
  const linkedSessions = MOCK_SESSIONS.filter(
    (s) => s.date === entry.date && s.assignedGuides.includes(staff.name),
  );

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
            <p className="text-xs font-mono text-gray-400">{staff.id}</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{staff.name}</h2>
              <StatusBadge {...roleInfo} />
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
          {/* Absent warning */}
          {entry.status === "absent" && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <span className="mt-0.5 animate-pulse text-red-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-red-800">결근</p>
                <p className="text-red-700">대체 인력 배정이 필요합니다</p>
              </div>
            </div>
          )}

          {/* Contact info */}
          <Section title="연락처">
            <div className="flex gap-2">
              <a
                href={`tel:${staff.phone}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-50 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                전화
              </a>
              <a
                href={`sms:${staff.phone}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                메시지
              </a>
            </div>
            <p className="mt-1 text-center text-xs text-gray-400">{staff.phone}</p>
          </Section>

          {/* Staff info */}
          <Section title="스태프 정보">
            <Row label="이름" value={staff.name} />
            <Row label="역할" value={roleInfo.label} />
            <Row label="상태" value={statusInfo.label} />
            <Row label="근무일" value={entry.date} />
          </Section>

          {/* Shift assignment */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              근무 시간 배정
            </h3>
            <div className="flex gap-2">
              {SHIFT_KEYS.map((sh) => {
                const info = SHIFT_MAP[sh];
                const isActive = entry.shift === sh;
                return (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => onShiftChange(entry.id, sh)}
                    className={`flex-1 rounded-lg px-3 py-3 text-center transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <p className="text-xs font-semibold">{info.label}</p>
                    <p className="mt-0.5 text-[11px] opacity-70">{info.time}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Linked sessions */}
          <Section title={`배정 세션 (${linkedSessions.length}건)`}>
            {linkedSessions.length === 0 ? (
              <p className="text-sm text-gray-400">배정된 세션이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {linkedSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.time} 세션</p>
                      <p className="text-xs text-gray-400">
                        {s.id} - {s.currentParticipants}/{s.maxCapacity}명
                      </p>
                    </div>
                    <StatusBadge
                      label={s.status === "open" ? "운영" : s.status === "closed" ? "마감" : "중단"}
                      color={s.status === "open" ? "text-emerald-700" : s.status === "closed" ? "text-gray-600" : "text-red-600"}
                      bg={s.status === "open" ? "bg-emerald-50" : s.status === "closed" ? "bg-gray-100" : "bg-red-50"}
                    />
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Week schedule */}
          <Section title="주간 일정">
            <div className="space-y-1.5">
              {weekEntries.map((we) => {
                const weShift = SHIFT_MAP[we.shift];
                const weStatus = STAFF_STATUS_MAP[we.status];
                const isToday = we.id === entry.id;
                return (
                  <div
                    key={we.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                      isToday ? "bg-emerald-50 ring-1 ring-emerald-200" : "bg-gray-50"
                    }`}
                  >
                    <span className={`font-medium ${isToday ? "text-emerald-800" : "text-gray-700"}`}>
                      {we.date.slice(5).replace("-", "/")}
                    </span>
                    <span className="text-xs text-gray-400">{weShift.label}</span>
                    <StatusBadge {...weStatus} />
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 px-5 py-4">
          {/* Emergency absence — prominent section */}
          {entry.status !== "absent" && (
            <div className="mb-3 border-b border-gray-100 pb-3">
              <button
                type="button"
                onClick={() => onStatusChange(entry.id, "absent")}
                className="w-full rounded-xl border-2 border-red-300 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
              >
                긴급 결근 처리
              </button>
            </div>
          )}

          <p className="mb-2 text-xs text-gray-400">상태 변경</p>
          <div className="flex flex-col gap-2">
            {entry.status !== "on_duty" && (
              <button
                type="button"
                onClick={() => onStatusChange(entry.id, "on_duty")}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                근무 시작
              </button>
            )}
            {entry.status !== "break" && entry.status !== "off_duty" && (
              <button
                type="button"
                onClick={() => onStatusChange(entry.id, "break")}
                className="w-full rounded-xl border border-amber-300 py-3.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50"
              >
                휴식
              </button>
            )}
            {entry.status !== "off_duty" && (
              <button
                type="button"
                onClick={() => onStatusChange(entry.id, "off_duty")}
                className="w-full rounded-xl bg-gray-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                퇴근
              </button>
            )}
          </div>
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

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
