import {
  MOCK_STAFF,
  MOCK_STAFF_SCHEDULE,
  STAFF_ROLE_MAP,
  SHIFT_MAP,
  STAFFING_RULES,
  type StaffRole,
} from "@/constants/mock-data";

interface ShiftChangeWidgetProps {
  date: string;
}

interface TransitionGroup {
  time: string;
  label: string;
  items: { name: string; roleLabel: string; roleColor: string; roleBg: string; desc: string }[];
  warning: string | null;
}

export default function ShiftChangeWidget({ date }: ShiftChangeWidgetProps) {
  const todayEntries = MOCK_STAFF_SCHEDULE.filter(
    (e) => e.date === date && e.status !== "absent",
  );

  const groups: TransitionGroup[] = [];

  // 13:00 transition — morning shifts ending, afternoon shifts starting
  const morningEnding = todayEntries.filter((e) => e.shift === "morning");
  const afternoonStarting = todayEntries.filter((e) => e.shift === "afternoon");

  if (morningEnding.length > 0 || afternoonStarting.length > 0) {
    const items: TransitionGroup["items"] = [];

    for (const entry of morningEnding) {
      const staff = MOCK_STAFF.find((s) => s.id === entry.staffId)!;
      const role = STAFF_ROLE_MAP[staff.role];
      items.push({
        name: staff.name,
        roleLabel: role.label,
        roleColor: role.color,
        roleBg: role.bg,
        desc: "오전 근무 종료",
      });
    }
    for (const entry of afternoonStarting) {
      const staff = MOCK_STAFF.find((s) => s.id === entry.staffId)!;
      const role = STAFF_ROLE_MAP[staff.role];
      items.push({
        name: staff.name,
        roleLabel: role.label,
        roleColor: role.color,
        roleBg: role.bg,
        desc: "오후 근무 시작",
      });
    }

    // Check for afternoon coverage gaps
    let warning: string | null = null;
    const afternoonActive = todayEntries.filter(
      (e) => e.shift === "full" || e.shift === "afternoon",
    );
    const afternoonStaffIds = new Set(afternoonActive.map((e) => e.staffId));
    const afternoonStaff = MOCK_STAFF.filter((s) => afternoonStaffIds.has(s.id));

    for (const [role, min] of Object.entries(STAFFING_RULES.minByRole)) {
      const count = afternoonStaff.filter((s) => s.role === role).length;
      if (count < min) {
        const label = STAFF_ROLE_MAP[role as StaffRole].label;
        warning = `13시 이후 ${label} ${count}명으로 감소`;
        break;
      }
    }

    groups.push({ time: "13:00", label: "교대 시간", items, warning });
  }

  // 18:00 — end of day for full and afternoon shifts
  const endOfDay = todayEntries.filter(
    (e) => e.shift === "full" || e.shift === "afternoon",
  );
  if (endOfDay.length > 0) {
    const items = endOfDay.map((entry) => {
      const staff = MOCK_STAFF.find((s) => s.id === entry.staffId)!;
      const role = STAFF_ROLE_MAP[staff.role];
      return {
        name: staff.name,
        roleLabel: role.label,
        roleColor: role.color,
        roleBg: role.bg,
        desc: `${SHIFT_MAP[entry.shift].label} 종료`,
      };
    });
    groups.push({ time: "18:00", label: "근무 종료", items, warning: null });
  }

  if (groups.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-900">교대 일정</h3>
      </div>

      {/* Timeline */}
      <div className="px-5 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group.time} className="relative pl-6">
            {/* Timeline dot + line */}
            <div className="absolute left-0 top-0 flex h-full flex-col items-center">
              <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
              </div>
              <div className="flex-1 w-px bg-gray-200" />
            </div>

            {/* Time header */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                {group.time}
              </span>
              <span className="text-xs text-gray-400">{group.label}</span>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <div
                  key={`${item.name}-${item.desc}`}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${item.roleColor} ${item.roleBg}`}
                  >
                    {item.roleLabel.length > 4
                      ? item.roleLabel.slice(0, 2)
                      : item.roleLabel}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Warning */}
            {group.warning && (
              <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5">
                <span className="text-xs text-amber-500">&#9888;</span>
                <span className="text-xs font-semibold text-amber-700">
                  {group.warning}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
