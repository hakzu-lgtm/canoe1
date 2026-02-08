import {
  MOCK_STAFF,
  MOCK_STAFF_SCHEDULE,
  MOCK_SESSIONS,
  STAFF_ROLE_MAP,
  STAFF_STATUS_MAP,
  SHIFT_MAP,
} from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface TodayStaffWidgetProps {
  date: string;
}

const ROLE_DOT_COLOR: Record<string, string> = {
  chief_guide: "bg-emerald-500",
  canoe_guide: "bg-blue-500",
  support_staff: "bg-violet-500",
};

const ROW_BG: Record<string, string> = {
  absent: "bg-red-50/60",
  break: "bg-amber-50/40",
};

export default function TodayStaffWidget({ date }: TodayStaffWidgetProps) {
  const todayEntries = MOCK_STAFF_SCHEDULE.filter((e) => e.date === date);
  const daySessions = MOCK_SESSIONS.filter((s) => s.date === date);

  const staffRows = todayEntries.map((entry) => {
    const staff = MOCK_STAFF.find((s) => s.id === entry.staffId)!;
    const role = STAFF_ROLE_MAP[staff.role];
    const shift = SHIFT_MAP[entry.shift];
    const status = STAFF_STATUS_MAP[entry.status];
    const sessionCount = daySessions.filter((s) =>
      s.assignedGuides.includes(staff.name),
    ).length;

    return { staff, entry, role, shift, status, sessionCount };
  });

  const activeCount = todayEntries.filter(
    (e) => e.status !== "absent" && e.status !== "off_duty",
  ).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900">오늘의 근무자</h3>
        </div>
        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-bold text-teal-700">
          {activeCount}명
        </span>
      </div>

      {/* Staff list */}
      <div className="divide-y divide-gray-50">
        {staffRows.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            배정된 스태프가 없습니다.
          </p>
        ) : (
          staffRows.map(({ staff, entry, role, shift, status, sessionCount }) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 px-5 py-3 ${ROW_BG[entry.status] ?? ""}`}
            >
              {/* Role dot */}
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${ROLE_DOT_COLOR[staff.role] ?? "bg-gray-400"}`}
              />

              {/* Name */}
              <span className="w-16 shrink-0 text-sm font-semibold text-gray-900">
                {staff.name}
              </span>

              {/* Role badge */}
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${role.color} ${role.bg}`}
              >
                {role.label.length > 4 ? role.label.slice(0, 2) : role.label}
              </span>

              {/* Shift time */}
              <span className="flex-1 text-xs text-gray-400">
                {shift.time}
              </span>

              {/* Status */}
              <StatusBadge {...status} />

              {/* Session count (for guides) */}
              {sessionCount > 0 && (
                <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                  세션 {sessionCount}건
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
