"use client";

import { useEffect, useState } from "react";
import {
  BIKE_STATUS_MAP,
  BIKE_RENTAL_DURATION_HOURS,
  type Bike,
  type Reservation,
} from "@/constants/mock-data";
import { PROGRAM_PRICE_MAP } from "@/constants/pricing";
import { StatusBadge } from "@/components/admin";

/** 현재 데모 시간 (오버듀 판정 기준) */
const CURRENT_TIME = "16:30";

interface Props {
  bike: Bike | null;
  mode: "view" | "rent";
  isOverdue: boolean;
  availableReservations: Reservation[];
  onClose: () => void;
  onRent: (bikeId: string, name: string, phone: string, startTime: string) => void;
  onReturn: (bikeId: string) => void;
  onToggleMaintenance: (bikeId: string) => void;
  onLinkReservation: (bikeId: string, reservationId: string) => void;
  onUnlinkReservation: (bikeId: string) => void;
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);
  const newH = h + hours;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function BikeDetailDrawer({
  bike,
  mode,
  isOverdue,
  availableReservations,
  onClose,
  onRent,
  onReturn,
  onToggleMaintenance,
  onLinkReservation,
  onUnlinkReservation,
}: Props) {
  const [rentName, setRentName] = useState("");
  const [rentPhone, setRentPhone] = useState("");
  const [rentStart, setRentStart] = useState(CURRENT_TIME);
  const [linkResId, setLinkResId] = useState("");

  // Reset form when bike changes
  useEffect(() => {
    setRentName("");
    setRentPhone("");
    setRentStart(CURRENT_TIME);
    setLinkResId("");
  }, [bike?.id]);

  // Escape key
  useEffect(() => {
    if (!bike) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [bike, onClose]);

  if (!bike) return null;

  const statusInfo = BIKE_STATUS_MAP[bike.status];
  const priceKey = `자전거 대여 (${bike.type})`;
  const price = PROGRAM_PRICE_MAP[priceKey] ?? 0;
  const expectedReturn = addHours(rentStart, BIKE_RENTAL_DURATION_HOURS);
  const canSubmitRent = rentName.trim() !== "" && rentPhone.trim() !== "";

  function handleRentSubmit() {
    if (!canSubmitRent) return;
    onRent(bike!.id, rentName.trim(), rentPhone.trim(), rentStart);
    onClose();
  }

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
            <p className="text-xs font-mono text-gray-400">{bike.id}</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{bike.label}</h2>
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
          {/* Overdue warning */}
          {isOverdue && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <span className="mt-0.5 animate-pulse text-red-500">&#9888;</span>
              <div className="text-sm">
                <p className="font-semibold text-red-800">반납 지연</p>
                <p className="text-red-700">
                  반납 예정 {bike.expectedReturn} - 현재 {CURRENT_TIME} (
                  {bike.renter}님)
                </p>
              </div>
            </div>
          )}

          {/* Bike info */}
          <Section title="자전거 정보">
            <Row label="ID" value={bike.id} />
            <Row label="종류" value={bike.type} />
            <Row label="상태" value={statusInfo.label} />
            <Row label="대여 요금" value={`${price.toLocaleString()}원`} />
          </Section>

          {/* Rental form (rent mode + available) */}
          {mode === "rent" && bike.status === "available" && (
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                대여 정보 입력
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    대여자 이름
                  </label>
                  <input
                    type="text"
                    value={rentName}
                    onChange={(e) => setRentName(e.target.value)}
                    placeholder="이름 입력"
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    연락처
                  </label>
                  <input
                    type="tel"
                    value={rentPhone}
                    onChange={(e) => setRentPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-500">
                    대여 시작 시간
                  </label>
                  <input
                    type="time"
                    value={rentStart}
                    onChange={(e) => setRentStart(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="mt-1.5 flex gap-1.5">
                    {["14:00", "14:30", "15:00", "15:30"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setRentStart(t)}
                        className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
                          rentStart === t
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  반납 예정: <span className="font-semibold text-gray-900">{expectedReturn}</span>
                  <span className="ml-1 text-xs text-gray-400">({BIKE_RENTAL_DURATION_HOURS}시간)</span>
                </div>
              </div>
            </div>
          )}

          {/* Rental status (view mode + rented) */}
          {bike.status === "rented" && bike.renter && mode === "view" && (
            <Section title="대여 현황">
              <Row label="대여자" value={bike.renter} />
              <Row
                label="연락처"
                value={
                  bike.phone ? (
                    <a href={`tel:${bike.phone}`} className="text-emerald-600 hover:underline">
                      {bike.phone}
                    </a>
                  ) : (
                    "-"
                  )
                }
              />
              <Row label="대여 시작" value={bike.rentalStart ?? "-"} />
              <Row label="반납 예정" value={bike.expectedReturn ?? "-"} />
              {isOverdue && (
                <Row
                  label="상태"
                  value={
                    <span className="font-semibold text-red-600">반납 지연</span>
                  }
                />
              )}
            </Section>
          )}

          {/* Reservation linking */}
          {bike.status === "rented" && (
            <Section title="예약 연결">
              {bike.linkedReservation ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">
                    {bike.linkedReservation}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUnlinkReservation(bike.id)}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
                  >
                    연결 해제
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableReservations.length === 0 ? (
                    <p className="text-sm text-gray-400">연결 가능한 예약이 없습니다.</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={linkResId}
                        onChange={(e) => setLinkResId(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">예약 선택</option>
                        {availableReservations.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.id} - {r.name} ({r.participants}명)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={!linkResId}
                        onClick={() => {
                          if (linkResId) {
                            onLinkReservation(bike.id, linkResId);
                            setLinkResId("");
                          }
                        }}
                        className="rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
                      >
                        연결
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Section>
          )}
        </div>

        {/* Action buttons */}
        <div className="border-t border-gray-200 px-5 py-4">
          <div className="flex flex-col gap-2">
            {mode === "rent" && bike.status === "available" && (
              <button
                type="button"
                disabled={!canSubmitRent}
                onClick={handleRentSubmit}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-40"
              >
                대여 시작
              </button>
            )}
            {mode === "view" && bike.status === "available" && (
              <p className="text-center text-sm text-gray-400">
                대여 가능 상태입니다.
              </p>
            )}
            {bike.status === "rented" && (
              <>
                <button
                  type="button"
                  onClick={() => onReturn(bike.id)}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  반납 처리
                </button>
                <button
                  type="button"
                  onClick={() => onToggleMaintenance(bike.id)}
                  className="w-full rounded-xl border border-amber-300 py-3.5 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50"
                >
                  점검 등록
                </button>
              </>
            )}
            {bike.status === "maintenance" && (
              <button
                type="button"
                onClick={() => onToggleMaintenance(bike.id)}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                대여 가능으로 변경
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold text-gray-900" : "text-gray-500"}>
        {label}
      </span>
      <span className={bold ? "font-bold text-gray-900" : "text-gray-900"}>
        {value}
      </span>
    </div>
  );
}
