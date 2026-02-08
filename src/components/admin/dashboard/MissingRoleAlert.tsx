import {
  MOCK_STAFF,
  MOCK_STAFF_SCHEDULE,
  STAFFING_RULES,
  STAFF_ROLE_MAP,
  type StaffRole,
} from "@/constants/mock-data";

interface MissingRoleAlertProps {
  date: string;
}

export default function MissingRoleAlert({ date }: MissingRoleAlertProps) {
  const todaySchedule = MOCK_STAFF_SCHEDULE.filter((e) => e.date === date);
  const activeEntries = todaySchedule.filter(
    (e) => e.status !== "absent" && e.status !== "off_duty",
  );
  const activeStaffIds = new Set(activeEntries.map((e) => e.staffId));
  const activeStaff = MOCK_STAFF.filter((s) => activeStaffIds.has(s.id));

  const warnings: string[] = [];

  // Total headcount check
  if (activeEntries.length < STAFFING_RULES.minTotal) {
    warnings.push(
      `총 인원 ${activeEntries.length}/${STAFFING_RULES.minTotal}명`,
    );
  }

  // Per-role check
  for (const [role, min] of Object.entries(STAFFING_RULES.minByRole)) {
    const count = activeStaff.filter((s) => s.role === role).length;
    if (count < min) {
      const label = STAFF_ROLE_MAP[role as StaffRole].label;
      warnings.push(`${label} ${count}/${min}명`);
    }
  }

  // Absent staff
  const absentEntries = todaySchedule.filter((e) => e.status === "absent");
  const absentNames = absentEntries.map(
    (e) => MOCK_STAFF.find((s) => s.id === e.staffId)?.name ?? e.staffId,
  );

  if (warnings.length === 0 && absentNames.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-start gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="animate-pulse text-lg text-red-500">&#9888;</span>
        <span className="text-sm font-bold text-red-800">인력 부족 경고</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {warnings.map((w) => (
          <span
            key={w}
            className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
          >
            {w}
          </span>
        ))}
        {absentNames.map((name) => (
          <span
            key={name}
            className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
          >
            {name} 결근
          </span>
        ))}
      </div>
    </div>
  );
}
