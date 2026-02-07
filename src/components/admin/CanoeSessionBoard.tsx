"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_SESSIONS,
  MOCK_RESERVATIONS,
  type CanoeSession,
  type SessionStatus,
} from "@/constants/mock-data";
import SessionTimelineCard from "./SessionTimelineCard";
import SessionDetailDrawer from "./SessionDetailDrawer";

const ALL_GUIDES = ["가이드A", "가이드B", "가이드C"] as const;

export default function CanoeSessionBoard() {
  const [sessions, setSessions] = useState<CanoeSession[]>(MOCK_SESSIONS);
  const [selectedDate, setSelectedDate] = useState<string>("2026-03-28");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // 날짜 목록 (동적)
  const availableDates = useMemo(
    () => [...new Set(sessions.map((s) => s.date))].sort(),
    [sessions],
  );

  // 선택된 날짜의 세션 (시간순)
  const dailySessions = useMemo(
    () =>
      sessions
        .filter((s) => s.date === selectedDate)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [sessions, selectedDate],
  );

  // 전체 요약 수치
  const counts = useMemo(
    () => ({
      total: sessions.length,
      open: sessions.filter((s) => s.status === "open").length,
      suspended: sessions.filter((s) => s.status === "suspended").length,
      totalParticipants: sessions.reduce(
        (sum, s) => sum + s.currentParticipants,
        0,
      ),
      nearCapacity: sessions.filter(
        (s) =>
          s.currentParticipants / s.maxCapacity >= 0.8 &&
          s.currentParticipants < s.maxCapacity,
      ).length,
      weatherWarnings: sessions.filter(
        (s) => s.weather === "heavy_rain" || s.weather === "strong_wind",
      ).length,
    }),
    [sessions],
  );

  // 드로어용 연결 예약
  const linkedReservations = useMemo(() => {
    if (!selectedSessionId) return [];
    const session = sessions.find((s) => s.id === selectedSessionId);
    if (!session) return [];
    return MOCK_RESERVATIONS.filter(
      (r) =>
        r.date === session.date &&
        r.time === session.time &&
        r.program.startsWith("카누"),
    );
  }, [sessions, selectedSessionId]);

  const selectedSession = selectedSessionId
    ? sessions.find((s) => s.id === selectedSessionId) ?? null
    : null;

  // 핸들러
  const handleStatusChange = useCallback(
    (sessionId: string, newStatus: SessionStatus) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, status: newStatus } : s,
        ),
      );
    },
    [],
  );

  const handleAddGuide = useCallback(
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

  const handleRemoveGuide = useCallback(
    (sessionId: string, guide: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                assignedGuides: s.assignedGuides.filter((g) => g !== guide),
              }
            : s,
        ),
      );
    },
    [],
  );

  return (
    <div className="space-y-6">
      {/* ───── 요약 카드 ───── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat label="전체 세션" value={`${counts.total}회`} color="text-gray-900" />
        <MiniStat label="운영 중" value={`${counts.open}회`} color="text-emerald-600" />
        <MiniStat label="중단" value={`${counts.suspended}회`} color="text-red-600" />
        <MiniStat label="총 예약 인원" value={`${counts.totalParticipants}명`} color="text-blue-600" />
      </div>

      {/* ───── 경고 요약 배너 ───── */}
      {(counts.nearCapacity > 0 || counts.weatherWarnings > 0) && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
          {counts.nearCapacity > 0 && (
            <span className="flex items-center gap-1 text-sm text-amber-800">
              <span>&#9888;</span> 정원 임박 세션{" "}
              <span className="font-bold">{counts.nearCapacity}건</span>
            </span>
          )}
          {counts.weatherWarnings > 0 && (
            <span className="flex items-center gap-1 text-sm text-red-700">
              <span>&#9888;</span> 기상 경고{" "}
              <span className="font-bold">{counts.weatherWarnings}건</span>
            </span>
          )}
        </div>
      )}

      {/* ───── 날짜 선택 ───── */}
      <div className="flex flex-wrap items-center gap-2">
        {availableDates.map((d) => (
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

      {/* ───── 타임라인 ───── */}
      <div>
        {dailySessions.map((session, i) => (
          <SessionTimelineCard
            key={session.id}
            session={session}
            isLast={i === dailySessions.length - 1}
            onCardClick={() => setSelectedSessionId(session.id)}
            onStatusChange={handleStatusChange}
          />
        ))}
        {dailySessions.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-400">
            해당 날짜의 세션이 없습니다.
          </p>
        )}
      </div>

      {/* ───── 상세 드로어 ───── */}
      <SessionDetailDrawer
        session={selectedSession}
        linkedReservations={linkedReservations}
        allGuides={ALL_GUIDES}
        onClose={() => setSelectedSessionId(null)}
        onStatusChange={handleStatusChange}
        onAddGuide={handleAddGuide}
        onRemoveGuide={handleRemoveGuide}
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
