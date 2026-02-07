"use client";

import { BIKE_STATUS_MAP, type Bike } from "@/constants/mock-data";
import { StatusBadge } from "@/components/admin";

interface BikeCardProps {
  bike: Bike;
  isOverdue: boolean;
  onCardClick: () => void;
  onQuickRent: () => void;
  onQuickReturn: () => void;
  onToggleMaintenance: () => void;
}

export default function BikeCard({
  bike,
  isOverdue,
  onCardClick,
  onQuickRent,
  onQuickReturn,
  onToggleMaintenance,
}: BikeCardProps) {
  const statusInfo = BIKE_STATUS_MAP[bike.status];

  const borderColor = isOverdue
    ? "border-red-300"
    : bike.status === "rented"
      ? "border-blue-200"
      : bike.status === "maintenance"
        ? "border-amber-200"
        : "border-gray-200";

  return (
    <div
      onClick={onCardClick}
      className={`cursor-pointer rounded-xl border bg-white p-5 transition-shadow hover:shadow-md ${borderColor}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BikeIcon type={bike.type} />
          <div>
            <p className="text-sm font-bold text-gray-900">{bike.label}</p>
            <p className="text-xs text-gray-400">{bike.id}</p>
          </div>
        </div>
        <StatusBadge {...statusInfo} />
      </div>

      {/* Overdue alert */}
      {isOverdue && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs">
          <span className="animate-pulse text-red-500">&#9888;</span>
          <span className="font-semibold text-red-700">
            반납 지연 - 예정 {bike.expectedReturn}
          </span>
        </div>
      )}

      {/* Rental info */}
      {bike.status === "rented" && bike.renter && (
        <div className="mb-3 space-y-1 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
          <div>
            <span className="font-medium">대여자:</span> {bike.renter}
          </div>
          {bike.rentalStart && (
            <div>
              <span className="font-medium">대여:</span> {bike.rentalStart}
              {bike.expectedReturn && (
                <>
                  {" → "}
                  <span className="font-medium">반납 예정:</span>{" "}
                  {bike.expectedReturn}
                </>
              )}
            </div>
          )}
          {bike.linkedReservation && (
            <div>
              <span className="font-medium">예약:</span>{" "}
              {bike.linkedReservation}
            </div>
          )}
        </div>
      )}

      {/* Maintenance info */}
      {bike.status === "maintenance" && (
        <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          정비 점검 중입니다.
        </div>
      )}

      {/* Quick action buttons */}
      <div
        className="flex items-center gap-2 border-t border-gray-100 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        {bike.status === "available" && (
          <button
            type="button"
            onClick={onQuickRent}
            className="flex-1 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            대여 시작
          </button>
        )}
        {bike.status === "rented" && (
          <button
            type="button"
            onClick={onQuickReturn}
            className="flex-1 rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
          >
            반납 처리
          </button>
        )}
        <button
          type="button"
          onClick={onToggleMaintenance}
          className={`rounded-lg border px-3 py-3 text-xs font-semibold transition-colors ${
            bike.status === "maintenance"
              ? "border-amber-300 text-amber-600 hover:bg-amber-50"
              : "border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {bike.status === "maintenance" ? "점검 해제" : "점검"}
        </button>
      </div>
    </div>
  );
}

function BikeIcon({ type }: { type: string }) {
  const color =
    type === "2인"
      ? "text-violet-500 bg-violet-50"
      : type === "어린이용"
        ? "text-pink-500 bg-pink-50"
        : "text-gray-500 bg-gray-50";
  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375m0 0V4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v9.375m0 0h.375"
        />
      </svg>
    </div>
  );
}
