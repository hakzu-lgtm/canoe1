"use client";

import { useState, useMemo } from "react";
import {
  MOCK_STAFF,
  STAFF_ROLE_MAP,
  STAFF_STATUS_MAP,
  SHIFT_MAP,
  STAFFING_RULES,
  type StaffRole,
} from "@/constants/mock-data";
import { useStaffContext } from "@/contexts/StaffContext";
import { StatusBadge } from "@/components/admin";
import StaffCard from "./StaffCard";
import StaffDetailDrawer from "./StaffDetailDrawer";

const OPERATING_DATES = ["2026-03-27", "2026-03-28", "2026-03-29", "2026-03-30", "2026-03-31"];

export default function StaffScheduleBoard() {
  const {
    staffEntries: entries,
    updateStaffStatus,
    updateStaffShift,
    sessions,
  } = useStaffContext();

  const [viewMode, setViewMode] = useState<"daily" | "weekly">("weekly");
  const [selectedDate, setSelectedDate] = useState("2026-03-28");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Daily entries
  const dailyEntries = useMemo(
    () => entries.filter((e) => e.date === selectedDate),
    [entries, selectedDate],
  );

  // Counts for selected date
  const counts = useMemo(() => {
    const day = dailyEntries;
    return {
      total: day.length,
      onDuty: day.filter((e) => e.status === "on_duty").length,
      onBreak: day.filter((e) => e.status === "break").length,
      absent: day.filter((e) => e.status === "absent").length,
    };
  }, [dailyEntries]);

  // Staffing warnings for selected date
  const warnings = useMemo(() => {
    const active = dailyEntries.filter((e) => e.status !== "absent" && e.status !== "off_duty");
    const activeStaffIds = new Set(active.map((e) => e.staffId));
    const activeStaff = MOCK_STAFF.filter((s) => activeStaffIds.has(s.id));

    const msgs: string[] = [];
    if (active.length < STAFFING_RULES.minTotal) msgs.push(`최소 인원 미달 (${active.length}/${STAFFING_RULES.minTotal}명)`);
    for (const [role, min] of Object.entries(STAFFING_RULES.minByRole)) {
      const count = activeStaff.filter((s) => s.role === role).length;
      if (count < min) {
        const roleLabel = STAFF_ROLE_MAP[role as StaffRole].label;
        msgs.push(`${roleLabel} ${min}명 미만 (${count}명)`);
      }
    }
    return msgs;
  }, [dailyEntries]);

  // Warnings per date for weekly visual validation
  const warningsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const d of OPERATING_DATES) {
      const dayEntries = entries.filter((e) => e.date === d);
      const active = dayEntries.filter((e) => e.status !== "absent" && e.status !== "off_duty");
      const activeStaffIds = new Set(active.map((e) => e.staffId));
      const activeStaff = MOCK_STAFF.filter((s) => activeStaffIds.has(s.id));
      const msgs: string[] = [];
      if (active.length < STAFFING_RULES.minTotal) msgs.push("인원 부족");
      for (const [role, min] of Object.entries(STAFFING_RULES.minByRole)) {
        const count = activeStaff.filter((s) => s.role === role).length;
        if (count < min) msgs.push(`${STAFF_ROLE_MAP[role as StaffRole].label.slice(0, 2)} 부족`);
      }
      map[d] = msgs;
    }
    return map;
  }, [entries]);

  // Linked session count per staff
  const sessionCountByStaff = useMemo(() => {
    const map: Record<string, number> = {};
    const daySessions = sessions.filter((s) => s.date === selectedDate);
    for (const staff of MOCK_STAFF) {
      map[staff.id] = daySessions.filter((s) => s.assignedGuides.includes(staff.name)).length;
    }
    return map;
  }, [sessions, selectedDate]);

  // Selected entry + staff
  const selectedEntry = selectedEntryId ? entries.find((e) => e.id === selectedEntryId) ?? null : null;
  const selectedStaff = selectedEntry ? MOCK_STAFF.find((s) => s.id === selectedEntry.staffId) ?? null : null;
  const selectedWeekEntries = useMemo(() => {
    if (!selectedEntry) return [];
    return entries
      .filter((e) => e.staffId === selectedEntry.staffId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, selectedEntry]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat label="배정 인원" value={`${counts.total}명`} color="text-gray-900" />
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
            <span key={w} className="text-sm font-semibold text-red-800">{w}</span>
          ))}
        </div>
      )}

      {/* View toggle + date selection */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("daily")}
            className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
              viewMode === "daily" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            일간
          </button>
          <button
            type="button"
            onClick={() => setViewMode("weekly")}
            className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
              viewMode === "weekly" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            주간
          </button>
        </div>

        {viewMode === "daily" && (
          <div className="flex flex-wrap items-center gap-2">
            {OPERATING_DATES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                  selectedDate === d
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d.slice(5).replace("-", "/")}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Daily view */}
      {viewMode === "daily" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dailyEntries.map((entry) => {
            const staff = MOCK_STAFF.find((s) => s.id === entry.staffId)!;
            return (
              <StaffCard
                key={entry.id}
                staff={staff}
                entry={entry}
                linkedSessionCount={sessionCountByStaff[staff.id] ?? 0}
                onCardClick={() => setSelectedEntryId(entry.id)}
                onStatusChange={updateStaffStatus}
              />
            );
          })}
          {dailyEntries.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-gray-400">
              해당 날짜의 스케줄이 없습니다.
            </p>
          )}
        </div>
      )}

      {/* Weekly view with visual role validation */}
      {viewMode === "weekly" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">스태프</th>
                {OPERATING_DATES.map((d) => {
                  const hasWarning = warningsByDate[d]?.length > 0;
                  return (
                    <th
                      key={d}
                      className={`px-3 py-3 text-center text-xs font-semibold ${
                        hasWarning ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {d.slice(5).replace("-", "/")}
                        {hasWarning && (
                          <span
                            className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"
                            title={warningsByDate[d].join(", ")}
                          />
                        )}
                      </div>
                      {hasWarning && (
                        <p className="mt-0.5 text-[10px] font-medium text-red-500">
                          {warningsByDate[d][0]}
                        </p>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_STAFF.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STAFF_ROLE_MAP[staff.role].color} ${STAFF_ROLE_MAP[staff.role].bg}`}>
                        {STAFF_ROLE_MAP[staff.role].label.slice(0, 2)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{staff.name}</span>
                    </div>
                  </td>
                  {OPERATING_DATES.map((d) => {
                    const e = entries.find((en) => en.staffId === staff.id && en.date === d);
                    const hasDateWarning = warningsByDate[d]?.length > 0;
                    if (!e) return (
                      <td
                        key={d}
                        className={`px-3 py-3 text-center text-xs text-gray-300 ${
                          hasDateWarning ? "bg-red-50/40" : ""
                        }`}
                      >
                        -
                      </td>
                    );
                    const sInfo = STAFF_STATUS_MAP[e.status];
                    const shInfo = SHIFT_MAP[e.shift];
                    return (
                      <td
                        key={d}
                        className={`cursor-pointer px-3 py-3 text-center transition-colors hover:bg-gray-100 ${
                          hasDateWarning && (e.status === "absent" || e.status === "off_duty")
                            ? "bg-red-50/40"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedDate(d);
                          setSelectedEntryId(e.id);
                        }}
                      >
                        <StatusBadge {...sInfo} />
                        <p className="mt-1 text-[11px] text-gray-400">{shInfo.label}</p>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Staffing rules info */}
      <p className="text-xs text-gray-400">
        운영일: 목-월 / 최소 {STAFFING_RULES.minTotal}명 /{" "}
        {Object.entries(STAFFING_RULES.minByRole)
          .map(([role, min]) => `${STAFF_ROLE_MAP[role as StaffRole].label} ${min}명`)
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

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
