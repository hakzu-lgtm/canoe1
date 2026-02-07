"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MOCK_BIKES,
  MOCK_RESERVATIONS,
  BIKE_STATUS_MAP,
  BIKE_RENTAL_DURATION_HOURS,
  type Bike,
  type BikeStatus,
} from "@/constants/mock-data";
import BikeCard from "./BikeCard";
import BikeDetailDrawer from "./BikeDetailDrawer";

/** 데모용 현재 시각 (오버듀 판정 기준) */
const CURRENT_TIME = "16:30";

const TYPE_FILTERS = ["전체", "일반", "2인", "어린이용"] as const;

const STATUS_FILTERS: { value: BikeStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "available", label: "대여 가능" },
  { value: "rented", label: "대여 중" },
  { value: "maintenance", label: "점검 중" },
];

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const newH = h + hours;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function BikeRentalDashboard() {
  const [bikes, setBikes] = useState<Bike[]>(MOCK_BIKES);
  const [typeFilter, setTypeFilter] = useState<string>("전체");
  const [statusFilter, setStatusFilter] = useState<BikeStatus | "all">("all");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState<string | null>(null);
  const [drawerMode, setDrawerMode] = useState<"view" | "rent">("view");

  // 오버듀 판정
  const overdueBikeIds = useMemo(
    () =>
      new Set(
        bikes
          .filter(
            (b) =>
              b.status === "rented" &&
              b.expectedReturn !== null &&
              b.expectedReturn < CURRENT_TIME,
          )
          .map((b) => b.id),
      ),
    [bikes],
  );

  // 필터링
  const filtered = useMemo(() => {
    let list = bikes;
    if (typeFilter !== "전체") list = list.filter((b) => b.type === typeFilter);
    if (statusFilter !== "all") list = list.filter((b) => b.status === statusFilter);
    if (showOverdueOnly) list = list.filter((b) => overdueBikeIds.has(b.id));
    return list;
  }, [bikes, typeFilter, statusFilter, showOverdueOnly, overdueBikeIds]);

  // 카운트
  const counts = useMemo(
    () => ({
      total: bikes.length,
      available: bikes.filter((b) => b.status === "available").length,
      rented: bikes.filter((b) => b.status === "rented").length,
      maintenance: bikes.filter((b) => b.status === "maintenance").length,
      overdue: overdueBikeIds.size,
    }),
    [bikes, overdueBikeIds],
  );

  // 연결 가능한 예약 (자전거 프로그램 + 활성 상태 + 아직 미연결)
  const availableReservations = useMemo(() => {
    const linkedIds = new Set(
      bikes.filter((b) => b.linkedReservation).map((b) => b.linkedReservation),
    );
    return MOCK_RESERVATIONS.filter(
      (r) =>
        r.program.includes("자전거") &&
        (r.status === "pending" || r.status === "confirmed") &&
        !linkedIds.has(r.id),
    );
  }, [bikes]);

  const selectedBike = selectedBikeId
    ? bikes.find((b) => b.id === selectedBikeId) ?? null
    : null;

  // ───── 핸들러 ─────

  const handleRent = useCallback(
    (bikeId: string, name: string, phone: string, startTime: string) => {
      setBikes((prev) =>
        prev.map((b) =>
          b.id === bikeId
            ? {
                ...b,
                status: "rented" as BikeStatus,
                renter: name,
                phone,
                rentalStart: startTime,
                expectedReturn: addHours(startTime, BIKE_RENTAL_DURATION_HOURS),
                actualReturn: null,
                linkedReservation: b.linkedReservation,
              }
            : b,
        ),
      );
    },
    [],
  );

  const handleReturn = useCallback((bikeId: string) => {
    setBikes((prev) =>
      prev.map((b) =>
        b.id === bikeId
          ? {
              ...b,
              status: "available" as BikeStatus,
              renter: null,
              phone: null,
              rentalStart: null,
              expectedReturn: null,
              actualReturn: CURRENT_TIME,
              linkedReservation: null,
            }
          : b,
      ),
    );
  }, []);

  const handleToggleMaintenance = useCallback((bikeId: string) => {
    setBikes((prev) =>
      prev.map((b) => {
        if (b.id !== bikeId) return b;
        const toMaintenance = b.status !== "maintenance";
        return {
          ...b,
          status: (toMaintenance ? "maintenance" : "available") as BikeStatus,
          renter: toMaintenance ? null : b.renter,
          phone: toMaintenance ? null : b.phone,
          rentalStart: toMaintenance ? null : b.rentalStart,
          expectedReturn: toMaintenance ? null : b.expectedReturn,
          actualReturn: null,
          linkedReservation: toMaintenance ? null : b.linkedReservation,
        };
      }),
    );
  }, []);

  const handleLinkReservation = useCallback(
    (bikeId: string, reservationId: string) => {
      setBikes((prev) =>
        prev.map((b) =>
          b.id === bikeId ? { ...b, linkedReservation: reservationId } : b,
        ),
      );
    },
    [],
  );

  const handleUnlinkReservation = useCallback((bikeId: string) => {
    setBikes((prev) =>
      prev.map((b) =>
        b.id === bikeId ? { ...b, linkedReservation: null } : b,
      ),
    );
  }, []);

  function openDrawer(bikeId: string, mode: "view" | "rent") {
    setSelectedBikeId(bikeId);
    setDrawerMode(mode);
  }

  return (
    <div className="space-y-6">
      {/* ───── 요약 카드 ───── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MiniStat label="전체 보유" value={`${counts.total}대`} color="text-gray-900" />
        <MiniStat label="대여 가능" value={`${counts.available}대`} color="text-emerald-600" />
        <MiniStat label="대여 중" value={`${counts.rented}대`} color="text-blue-600" />
        <MiniStat label="점검 중" value={`${counts.maintenance}대`} color="text-amber-600" />
        <MiniStat
          label="반납 지연"
          value={`${counts.overdue}건`}
          color={counts.overdue > 0 ? "text-red-600" : "text-gray-400"}
          pulse={counts.overdue > 0}
        />
      </div>

      {/* ───── 오버듀 배너 ───── */}
      {counts.overdue > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="text-sm font-semibold text-red-800">
            반납 지연 {counts.overdue}건
          </span>
          <span className="text-sm text-red-700">
            - 즉시 확인이 필요합니다
          </span>
        </div>
      )}

      {/* ───── 필터 ───── */}
      <div className="space-y-2">
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((t) => {
            const c =
              t === "전체"
                ? bikes.length
                : bikes.filter((b) => b.type === t).length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t}
                <span className="ml-1 opacity-60">{c}</span>
              </button>
            );
          })}
        </div>

        {/* Status pills + overdue toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => {
            const c =
              f.value === "all"
                ? bikes.length
                : bikes.filter((b) => b.status === f.value).length;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => {
                  setStatusFilter(f.value);
                  setShowOverdueOnly(false);
                }}
                className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                  statusFilter === f.value && !showOverdueOnly
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
                <span className="ml-1 opacity-60">{c}</span>
              </button>
            );
          })}
          {counts.overdue > 0 && (
            <button
              type="button"
              onClick={() => setShowOverdueOnly(!showOverdueOnly)}
              className={`rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                showOverdueOnly
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              지연만 보기
              <span className="ml-1 opacity-60">{counts.overdue}</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        대여 시간: {BIKE_RENTAL_DURATION_HOURS}시간 / 종류별 7대 보유 (총 21대) / 현재 시각: {CURRENT_TIME}
      </p>

      {/* ───── 카드 그리드 ───── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            isOverdue={overdueBikeIds.has(bike.id)}
            onCardClick={() => openDrawer(bike.id, "view")}
            onQuickRent={() => openDrawer(bike.id, "rent")}
            onQuickReturn={() => handleReturn(bike.id)}
            onToggleMaintenance={() => handleToggleMaintenance(bike.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">
          해당 조건의 자전거가 없습니다.
        </p>
      )}

      {/* ───── 상세 드로어 ───── */}
      <BikeDetailDrawer
        bike={selectedBike}
        mode={drawerMode}
        isOverdue={selectedBikeId ? overdueBikeIds.has(selectedBikeId) : false}
        availableReservations={availableReservations}
        onClose={() => setSelectedBikeId(null)}
        onRent={handleRent}
        onReturn={handleReturn}
        onToggleMaintenance={handleToggleMaintenance}
        onLinkReservation={handleLinkReservation}
        onUnlinkReservation={handleUnlinkReservation}
      />
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
  pulse,
}: {
  label: string;
  value: string;
  color: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-medium text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color} ${pulse ? "animate-pulse" : ""}`}>
        {value}
      </p>
    </div>
  );
}
