import type { StaffAvailability } from "@/contexts/StaffContext";
import type { CanoeSession } from "@/constants/mock-data";

interface Props {
  availability: StaffAvailability;
  overlappingSessions: CanoeSession[];
  compact?: boolean;
}

const AVAILABILITY_MAP: Record<
  StaffAvailability,
  { label: string; dot: string; text: string }
> = {
  available: { label: "배정 가능", dot: "bg-emerald-500", text: "text-emerald-700" },
  on_shift_other_session: { label: "다른 세션 배정 중", dot: "bg-amber-500", text: "text-amber-700" },
  off_shift: { label: "근무 시간 외", dot: "bg-gray-400", text: "text-gray-500" },
  absent: { label: "결근", dot: "bg-red-500", text: "text-red-600" },
  off_duty: { label: "퇴근", dot: "bg-gray-400", text: "text-gray-500" },
};

export default function StaffAvailabilityIndicator({
  availability,
  overlappingSessions,
  compact = false,
}: Props) {
  const info = AVAILABILITY_MAP[availability];

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1" title={info.label}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${info.dot}`} />
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${info.dot}`} />
      <span className={`text-[11px] font-medium ${info.text}`}>
        {info.label}
      </span>
      {availability === "on_shift_other_session" && overlappingSessions.length > 0 && (
        <span className="text-[10px] text-amber-600">
          ({overlappingSessions.map((s) => s.id).join(", ")})
        </span>
      )}
    </div>
  );
}
