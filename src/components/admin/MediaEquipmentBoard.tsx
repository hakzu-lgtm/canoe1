"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_MEDIA,
  MOCK_SESSIONS,
  MOCK_RESERVATIONS,
  MEDIA_TYPE_MAP,
  type MediaEquipment,
  type MediaType,
  type MediaStatus,
} from "@/constants/mock-data";
import { MEDIA_SERVICE_TO_TYPE } from "@/constants/pricing";
import MediaEquipmentCard from "./MediaEquipmentCard";
import MediaEquipmentDrawer from "./MediaEquipmentDrawer";

const TYPE_FILTERS: { value: MediaType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "drone", label: "드론" },
  { value: "camera_360", label: "360 카메라" },
  { value: "motion_cam", label: "모션캠" },
];

const MEDIA_TYPES: MediaType[] = ["drone", "camera_360", "motion_cam"];

/** 미디어 서비스명 → 장비타입 역매핑 */
const TYPE_TO_SERVICES: Record<MediaType, string[]> = Object.entries(
  MEDIA_SERVICE_TO_TYPE,
).reduce(
  (acc, [service, type]) => {
    acc[type] = acc[type] ?? [];
    acc[type].push(service);
    return acc;
  },
  {} as Record<MediaType, string[]>,
);

export default function MediaEquipmentBoard() {
  const [equipment, setEquipment] = useState<MediaEquipment[]>(MOCK_MEDIA);
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // 기상 경고: 세션에 폭우/강풍이 있는지 확인
  const weatherWarningActive = useMemo(
    () =>
      MOCK_SESSIONS.some(
        (s) => s.weather === "heavy_rain" || s.weather === "strong_wind",
      ),
    [],
  );

  // 타입별 가용 현황
  const typeAvailability = useMemo(() => {
    const result: Record<MediaType, { total: number; available: number }> = {
      drone: { total: 0, available: 0 },
      camera_360: { total: 0, available: 0 },
      motion_cam: { total: 0, available: 0 },
    };
    for (const eq of equipment) {
      result[eq.type].total++;
      if (eq.status === "available") result[eq.type].available++;
    }
    return result;
  }, [equipment]);

  // 전체 사용 불가 타입
  const allUnavailableTypes = useMemo(
    () =>
      MEDIA_TYPES.filter(
        (t) => typeAvailability[t].total > 0 && typeAvailability[t].available === 0,
      ),
    [typeAvailability],
  );

  // 필터링 + 그룹핑
  const filtered = useMemo(
    () =>
      typeFilter === "all"
        ? equipment
        : equipment.filter((eq) => eq.type === typeFilter),
    [equipment, typeFilter],
  );

  const grouped = useMemo(() => {
    const groups: Record<MediaType, MediaEquipment[]> = {
      drone: [],
      camera_360: [],
      motion_cam: [],
    };
    for (const eq of filtered) {
      groups[eq.type].push(eq);
    }
    return groups;
  }, [filtered]);

  // 카운트
  const counts = useMemo(
    () => ({
      total: equipment.length,
      available: equipment.filter((eq) => eq.status === "available").length,
      inUse: equipment.filter((eq) => eq.status === "in_use").length,
      unavailable: equipment.filter(
        (eq) =>
          eq.status === "charging" ||
          eq.status === "maintenance" ||
          eq.status === "unavailable_weather",
      ).length,
    }),
    [equipment],
  );

  // 선택된 장비에 연결 가능한 예약
  const availableReservations = useMemo(() => {
    if (!selectedEquipmentId) return [];
    const eq = equipment.find((e) => e.id === selectedEquipmentId);
    if (!eq) return [];
    const services = TYPE_TO_SERVICES[eq.type] ?? [];
    const linkedIds = new Set(
      equipment.filter((e) => e.linkedReservation).map((e) => e.linkedReservation),
    );
    return MOCK_RESERVATIONS.filter(
      (r) =>
        r.mediaServices.some((ms) => services.includes(ms)) &&
        (r.status === "pending" || r.status === "confirmed" || r.status === "in_progress") &&
        !linkedIds.has(r.id),
    );
  }, [equipment, selectedEquipmentId]);

  const selectedEquipment = selectedEquipmentId
    ? equipment.find((eq) => eq.id === selectedEquipmentId) ?? null
    : null;

  // ───── 핸들러 ─────

  const handleStatusChange = useCallback(
    (eqId: string, newStatus: MediaStatus) => {
      setEquipment((prev) =>
        prev.map((eq) => {
          if (eq.id !== eqId) return eq;
          const clearLink = newStatus !== "in_use";
          return {
            ...eq,
            status: newStatus,
            linkedReservation: clearLink ? null : eq.linkedReservation,
          };
        }),
      );
    },
    [],
  );

  const handleLinkReservation = useCallback(
    (eqId: string, reservationId: string) => {
      setEquipment((prev) =>
        prev.map((eq) =>
          eq.id === eqId ? { ...eq, linkedReservation: reservationId } : eq,
        ),
      );
    },
    [],
  );

  const handleUnlinkReservation = useCallback((eqId: string) => {
    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === eqId ? { ...eq, linkedReservation: null } : eq,
      ),
    );
  }, []);

  const handleUpdateNote = useCallback((eqId: string, note: string) => {
    setEquipment((prev) =>
      prev.map((eq) => (eq.id === eqId ? { ...eq, note } : eq)),
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* ───── 요약 카드 ───── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiniStat label="전체 장비" value={`${counts.total}대`} color="text-gray-900" />
        <MiniStat label="사용 가능" value={`${counts.available}대`} color="text-emerald-600" />
        <MiniStat label="사용 중" value={`${counts.inUse}대`} color="text-blue-600" />
        <MiniStat label="사용 불가" value={`${counts.unavailable}대`} color="text-amber-600" />
      </div>

      {/* ───── 경고 배너 ───── */}
      {weatherWarningActive && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="text-sm font-semibold text-red-800">
            드론 비행 불가
          </span>
          <span className="text-sm text-red-700">
            - 기상 경고 (강풍/폭우 감지)
          </span>
        </div>
      )}
      {allUnavailableTypes.map((type) => {
        const info = MEDIA_TYPE_MAP[type];
        return (
          <div
            key={type}
            className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5"
          >
            <span className="text-amber-500">&#9888;</span>
            <span className="text-sm font-semibold text-amber-800">
              {info.icon} {info.label} 전체 사용 불가
            </span>
            <span className="text-sm text-amber-700">
              - 가용 장비가 없습니다
            </span>
          </div>
        );
      })}

      {/* ───── 장비 보유 현황 ───── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-3 text-xs font-semibold text-gray-500">장비 보유 현황</p>
        <div className="flex flex-wrap gap-4">
          {MEDIA_TYPES.map((type) => {
            const info = MEDIA_TYPE_MAP[type];
            const avail = typeAvailability[type];
            const allDown = avail.total > 0 && avail.available === 0;
            return (
              <div
                key={type}
                className={`flex items-center gap-3 rounded-lg px-4 py-2 ${
                  allDown ? "bg-red-50" : "bg-gray-50"
                }`}
              >
                <span className="text-xl">{info.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{info.label}</p>
                  <p
                    className={`text-xs ${
                      allDown ? "font-semibold text-red-600" : "text-gray-400"
                    }`}
                  >
                    보유 {avail.total}대 &middot; 사용가능{" "}
                    {avail.available}대
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───── 타입 필터 ───── */}
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map((f) => {
          const c =
            f.value === "all"
              ? equipment.length
              : equipment.filter((eq) => eq.type === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
              <span className="ml-1 opacity-60">{c}</span>
            </button>
          );
        })}
      </div>

      {/* ───── 그룹별 섹션 ───── */}
      {MEDIA_TYPES.map((type) => {
        const items = grouped[type];
        if (items.length === 0) return null;
        const info = MEDIA_TYPE_MAP[type];
        const avail = typeAvailability[type];
        return (
          <div key={type}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">{info.icon}</span>
              <h3 className="text-sm font-bold text-gray-900">{info.label}</h3>
              <span className="text-xs text-gray-400">
                {avail.total}대 보유 &middot; {avail.available}대 가용
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((eq) => (
                <MediaEquipmentCard
                  key={eq.id}
                  equipment={eq}
                  weatherDisabled={
                    weatherWarningActive && eq.type === "drone"
                  }
                  onCardClick={() => setSelectedEquipmentId(eq.id)}
                  onQuickStatusChange={(newStatus) =>
                    handleStatusChange(eq.id, newStatus)
                  }
                />
              ))}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">
          해당 조건의 장비가 없습니다.
        </p>
      )}

      {/* ───── 상세 드로어 ───── */}
      <MediaEquipmentDrawer
        equipment={selectedEquipment}
        weatherDisabled={
          weatherWarningActive &&
          selectedEquipment?.type === "drone"
        }
        availableReservations={availableReservations}
        onClose={() => setSelectedEquipmentId(null)}
        onStatusChange={handleStatusChange}
        onLinkReservation={handleLinkReservation}
        onUnlinkReservation={handleUnlinkReservation}
        onUpdateNote={handleUpdateNote}
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
