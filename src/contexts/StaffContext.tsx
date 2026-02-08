"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  MOCK_STAFF,
  MOCK_STAFF_SCHEDULE,
  MOCK_SESSIONS,
  SESSION_TIME_SHIFT_MAP,
  type StaffScheduleEntry,
  type StaffStatus,
  type ShiftType,
  type CanoeSession,
  type SessionStatus,
} from "@/constants/mock-data";

/* ── Types ── */

export type StaffAvailability =
  | "available"
  | "on_shift_other_session"
  | "off_shift"
  | "absent"
  | "off_duty";

interface StaffContextValue {
  // Staff schedule
  staffEntries: StaffScheduleEntry[];
  updateStaffStatus: (entryId: string, newStatus: StaffStatus) => void;
  updateStaffShift: (entryId: string, newShift: ShiftType) => void;

  // Canoe sessions
  sessions: CanoeSession[];
  updateSessionStatus: (sessionId: string, newStatus: SessionStatus) => void;
  addGuideToSession: (sessionId: string, guide: string) => void;
  removeGuideFromSession: (sessionId: string, guide: string) => void;

  // Derived helpers
  getStaffAvailability: (
    staffName: string,
    date: string,
    time: string,
  ) => StaffAvailability;
  getOverlappingSessions: (
    staffName: string,
    date: string,
    time: string,
  ) => CanoeSession[];
}

const StaffContext = createContext<StaffContextValue | null>(null);

/* ── Hook ── */

export function useStaffContext() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaffContext must be used within StaffContextProvider");
  return ctx;
}

/* ── Provider ── */

export default function StaffContextProvider({ children }: { children: ReactNode }) {
  const [staffEntries, setStaffEntries] = useState<StaffScheduleEntry[]>(MOCK_STAFF_SCHEDULE);
  const [sessions, setSessions] = useState<CanoeSession[]>(MOCK_SESSIONS);

  /* Staff schedule mutations */
  const updateStaffStatus = useCallback(
    (entryId: string, newStatus: StaffStatus) => {
      setStaffEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, status: newStatus } : e)),
      );
    },
    [],
  );

  const updateStaffShift = useCallback(
    (entryId: string, newShift: ShiftType) => {
      setStaffEntries((prev) =>
        prev.map((e) => (e.id === entryId ? { ...e, shift: newShift } : e)),
      );
    },
    [],
  );

  /* Session mutations */
  const updateSessionStatus = useCallback(
    (sessionId: string, newStatus: SessionStatus) => {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s)),
      );
    },
    [],
  );

  const addGuideToSession = useCallback(
    (sessionId: string, guide: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId && !s.assignedGuides.includes(guide)
            ? { ...s, assignedGuides: [...s.assignedGuides, guide] }
            : s,
        ),
      );
    },
    [],
  );

  const removeGuideFromSession = useCallback(
    (sessionId: string, guide: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, assignedGuides: s.assignedGuides.filter((g) => g !== guide) }
            : s,
        ),
      );
    },
    [],
  );

  /* Derived helpers */
  const getStaffAvailability = useCallback(
    (staffName: string, date: string, time: string): StaffAvailability => {
      const staff = MOCK_STAFF.find((s) => s.name === staffName);
      if (!staff) return "off_duty";

      const entry = staffEntries.find(
        (e) => e.staffId === staff.id && e.date === date,
      );
      if (!entry) return "off_shift";
      if (entry.status === "absent") return "absent";
      if (entry.status === "off_duty") return "off_duty";

      // Check shift coverage
      const coveringShifts = SESSION_TIME_SHIFT_MAP[time] ?? ["full"];
      if (!coveringShifts.includes(entry.shift)) return "off_shift";

      // Check overlapping session assignments
      const overlapping = sessions.filter(
        (s) =>
          s.date === date &&
          s.time === time &&
          s.assignedGuides.includes(staffName),
      );
      if (overlapping.length > 0) return "on_shift_other_session";

      return "available";
    },
    [staffEntries, sessions],
  );

  const getOverlappingSessions = useCallback(
    (staffName: string, date: string, time: string): CanoeSession[] => {
      return sessions.filter(
        (s) =>
          s.date === date &&
          s.time === time &&
          s.assignedGuides.includes(staffName),
      );
    },
    [sessions],
  );

  return (
    <StaffContext.Provider
      value={{
        staffEntries,
        updateStaffStatus,
        updateStaffShift,
        sessions,
        updateSessionStatus,
        addGuideToSession,
        removeGuideFromSession,
        getStaffAvailability,
        getOverlappingSessions,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
}
