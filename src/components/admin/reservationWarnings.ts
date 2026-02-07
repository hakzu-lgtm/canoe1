import {
  MOCK_SESSIONS,
  MOCK_MEDIA,
  type Reservation,
  type MediaType,
} from "@/constants/mock-data";
import { MEDIA_SERVICE_TO_TYPE } from "@/constants/pricing";

export interface CapacityWarning {
  sessionId: string;
  current: number;
  max: number;
  overflow: number;
}

export interface MediaWarning {
  service: string;
  reason: string;
}

/** 해당 예약의 날짜+시간에 매칭되는 세션을 찾아 정원 초과 여부를 확인 */
export function checkCapacityWarning(
  reservation: Reservation,
): CapacityWarning | null {
  // 자전거 프로그램은 세션 정원 체크 불필요
  if (reservation.program.startsWith("자전거")) return null;

  const session = MOCK_SESSIONS.find(
    (s) => s.date === reservation.date && s.time === reservation.time,
  );
  if (!session) return null;

  const projected = session.currentParticipants + reservation.participants;
  if (projected > session.maxCapacity) {
    return {
      sessionId: session.id,
      current: session.currentParticipants,
      max: session.maxCapacity,
      overflow: projected - session.maxCapacity,
    };
  }
  return null;
}

/** 예약의 미디어 서비스별로 장비 가용 여부를 확인 */
export function checkMediaWarnings(reservation: Reservation): MediaWarning[] {
  const warnings: MediaWarning[] = [];

  for (const service of reservation.mediaServices) {
    const mediaType: MediaType | undefined = MEDIA_SERVICE_TO_TYPE[service];
    if (!mediaType) continue;

    const equipmentOfType = MOCK_MEDIA.filter((m) => m.type === mediaType);
    const available = equipmentOfType.some((m) => m.status === "available");

    if (!available) {
      const statuses = equipmentOfType.map((m) => m.status);
      const reason = statuses.includes("maintenance")
        ? "점검 중"
        : statuses.includes("in_use")
          ? "모두 사용 중"
          : "사용 불가";
      warnings.push({ service, reason });
    }
  }

  return warnings;
}

/** 예약에 경고가 하나라도 있는지 여부 */
export function hasAnyWarning(reservation: Reservation): boolean {
  return (
    checkCapacityWarning(reservation) !== null ||
    checkMediaWarnings(reservation).length > 0
  );
}
