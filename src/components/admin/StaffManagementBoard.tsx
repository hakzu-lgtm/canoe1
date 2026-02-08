"use client";

import { useState, useMemo } from "react";
import {
  MOCK_STAFF,
  STAFF_ROLE_MAP,
  STAFFING_RULES,
  type StaffRole,
} from "@/constants/mock-data";
import { useStaffContext } from "@/contexts/StaffContext";
import StaffMemberCard from "./StaffMemberCard";
import StaffDetailDrawer from "./StaffDetailDrawer";

const TODAY = "2026-03-28";

export default function StaffManagementBoard() {
  const { staffEntries, updateStaffStatus, updateStaffShift, sessions } =
    useStaffContext();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const todayEntries = useMemo(
    () => staffEntries.filter((e) => e.date === TODAY),
    [staffEntries],
  );

  // Counts
  const counts = useMemo(() => ({
    total: MOCK_STAFF.length,
    onDuty: todayEntries.filter((e) => e.status === "on_duty").length,
    onBreak: todayEntries.filter((e) => e.status === "break").length,
    absent: todayEntries.filter((e) => e.status === "absent").length,
  }), [todayEntries]);

  // Staffing warnings
  const warnings = useMemo(() => {
    const active = todayEntries.filter(
      (e) => e.status !== "absent" && e.status !== "off_duty",
    );
    const activeStaffIds = new Set(active.map((e) => e.staffId));
    const activeStaff = MOCK_STAFF.filter((s) => activeStaffIds.has(s.id));

    const msgs: string[] = [];
    if (active.length < STAFFING_RULES.minTotal)
      msgs.push(`최소 인원 미달 (${active.length}/${STAFFING_RULES.minTotal}명)`);
    for (const [role, min] of Object.entries(STAFFING_RULES.minByRole)) {
      const count = activeStaff.filter((s) => s.role === role).length;
      if (count < min) {
        const roleLabel = STAFF_ROLE_MAP[role as StaffRole].label;
        msgs.push(`${roleLabel} ${min}명 미만 (${count}명)`);
      }
    }
    return msgs;
  }, [todayEntries]);

  // Session count per staff
  const sessionCountByStaff = useMemo(() => {
    const map: Record<string, number> = {};
    const daySessions = sessions.filter((s) => s.date === TODAY);
    for (const staff of MOCK_STAFF) {
      map[staff.id] = daySessions.filter((s) =>
        s.assignedGuides.includes(staff.name),
      ).length;
    }
    return map;
  }, [sessions]);

  // Selected entry + staff for drawer
  const selectedEntry = selectedEntryId
    ? staffEntries.find((e) => e.id === selectedEntryId) ?? null
    : null;
  const selectedStaff = selectedEntry
    ? MOCK_STAFF.find((s) => s.id === selectedEntry.staffId) ?? null
    : null;
  const selectedWeekEntries = useMemo(() => {
    if (!selectedEntry) return [];
    return staffEntries
      .filter((e) => e.staffId === selectedEntry.staffId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [staffEntries, selectedEntry]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat label="전체 스태프" value={`${counts.total}명`} color="text-gray-900" />
        <MiniStat label="근무 중" value={`${counts.onDuty}명`} color="text-emerald-600" />
        <MiniStat label="휴식" value={`${counts.onBreak}명`} color="text-amber-600" />
        <MiniStat
          label="결근"
          value={`${counts.absent}명`}
          color={counts.absent > 0 ? "text-red-600" : "text-gray-400"}
        />
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="animate-pulse text-red-500">&#9888;</span>
          {warnings.map((w) => (
            <span key={w} className="text-sm font-semibold text-red-800">
              {w}
            </span>
          ))}
        </div>
      )}

      {/* Staff grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_STAFF.map((staff) => {
          const entry = todayEntries.find((e) => e.staffId === staff.id) ?? null;
          return (
            <StaffMemberCard
              key={staff.id}
              staff={staff}
              entry={entry}
              linkedSessionCount={sessionCountByStaff[staff.id] ?? 0}
              onCardClick={() => {
                if (entry) setSelectedEntryId(entry.id);
              }}
              onStatusChange={updateStaffStatus}
            />
          );
        })}
      </div>

      {/* Staffing rules info */}
      <p className="text-xs text-gray-400">
        최소 {STAFFING_RULES.minTotal}명 /{" "}
        {Object.entries(STAFFING_RULES.minByRole)
          .map(
            ([role, min]) =>
              `${STAFF_ROLE_MAP[role as StaffRole].label} ${min}명`,
          )
          .join(" + ")}{" "}
        필수
      </p>

      {/* Detail drawer */}
      <StaffDetailDrawer
        staff={selectedStaff}
        entry={selectedEntry}
        weekEntries={selectedWeekEntries}
        onClose={() => setSelectedEntryId(null)}
        onStatusChange={updateStaffStatus}
        onShiftChange={updateStaffShift}
      />
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
