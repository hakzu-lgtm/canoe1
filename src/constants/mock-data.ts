/* ================================================================
   자전거 대여
   ================================================================ */

export type BikeStatus = "available" | "rented" | "maintenance";

export interface Bike {
  id: string;
  label: string;
  type: "일반" | "2인" | "어린이용";
  status: BikeStatus;
  renter: string | null;
  phone: string | null;
  rentalStart: string | null;
  expectedReturn: string | null;
  actualReturn: string | null;
  linkedReservation: string | null;
}

export const BIKE_STATUS_MAP: Record<
  BikeStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: "대여 가능", color: "text-emerald-700", bg: "bg-emerald-50" },
  rented: { label: "대여 중", color: "text-blue-700", bg: "bg-blue-50" },
  maintenance: { label: "점검 중", color: "text-amber-700", bg: "bg-amber-50" },
};

export const BIKE_RENTAL_DURATION_HOURS = 2;

function bikesOfType(type: "일반" | "2인" | "어린이용", prefix: string): Bike[] {
  return Array.from({ length: 7 }, (_, i) => ({
    id: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    label: `${type === "2인" ? "2인 자전거" : type === "어린이용" ? "어린이 자전거" : "일반 자전거"} #${i + 1}`,
    type,
    status: "available" as BikeStatus,
    renter: null,
    phone: null,
    rentalStart: null,
    expectedReturn: null,
    actualReturn: null,
    linkedReservation: null,
  }));
}

const _bikes = [
  ...bikesOfType("일반", "BN"),
  ...bikesOfType("2인", "BT"),
  ...bikesOfType("어린이용", "BC"),
];
// 일부에 대여/점검 상태 부여
_bikes[1] = { ..._bikes[1], status: "rented", renter: "김민수", phone: "010-1234-5678", rentalStart: "14:00", expectedReturn: "16:00", linkedReservation: "R-2026-0301" };
_bikes[2] = { ..._bikes[2], status: "rented", renter: "이지은", phone: "010-9876-5432", rentalStart: "13:30", expectedReturn: "15:30", linkedReservation: null };
_bikes[4] = { ..._bikes[4], status: "maintenance", renter: null, phone: null, rentalStart: null, expectedReturn: null, actualReturn: null, linkedReservation: null };
_bikes[8] = { ..._bikes[8], status: "rented", renter: "박서준", phone: "010-5555-1234", rentalStart: "15:00", expectedReturn: "17:00", linkedReservation: "R-2026-0303" };
_bikes[14] = { ..._bikes[14], status: "rented", renter: "김하윤", phone: "010-2222-3333", rentalStart: "14:30", expectedReturn: "16:30", linkedReservation: null };
_bikes[16] = { ..._bikes[16], status: "maintenance", renter: null, phone: null, rentalStart: null, expectedReturn: null, actualReturn: null, linkedReservation: null };

export const MOCK_BIKES: Bike[] = _bikes;

/* ================================================================
   예약 관리
   ================================================================ */

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Reservation {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  program: string;
  participants: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  mediaServices: string[];
  memo: string;
}

export const RESERVATION_STATUS_MAP: Record<
  ReservationStatus,
  { label: string; color: string; bg: string }
> = {
  pending: { label: "대기", color: "text-amber-700", bg: "bg-amber-50" },
  confirmed: { label: "확정", color: "text-emerald-700", bg: "bg-emerald-50" },
  in_progress: { label: "진행 중", color: "text-blue-700", bg: "bg-blue-50" },
  completed: { label: "완료", color: "text-gray-600", bg: "bg-gray-100" },
  cancelled: { label: "취소", color: "text-red-600", bg: "bg-red-50" },
  no_show: { label: "노쇼", color: "text-rose-700", bg: "bg-rose-50" },
};

export const PAYMENT_STATUS_MAP: Record<
  PaymentStatus,
  { label: string; color: string; bg: string }
> = {
  unpaid: { label: "미결제", color: "text-red-600", bg: "bg-red-50" },
  paid: { label: "결제완료", color: "text-emerald-700", bg: "bg-emerald-50" },
  refunded: { label: "환불", color: "text-gray-600", bg: "bg-gray-100" },
};

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: "R-2026-0301", date: "2026-03-28", time: "09:00", name: "김민수", phone: "010-1234-5678", program: "카누 체험 (일반)", participants: 4, status: "confirmed", paymentStatus: "paid", mediaServices: ["드론 촬영"], memo: "" },
  { id: "R-2026-0302", date: "2026-03-28", time: "09:00", name: "이지은", phone: "010-9876-5432", program: "카누 체험 (충주시민)", participants: 2, status: "confirmed", paymentStatus: "paid", mediaServices: [], memo: "초보자입니다" },
  { id: "R-2026-0303", date: "2026-03-28", time: "11:00", name: "박서준", phone: "010-5555-1234", program: "카누 체험 (일반)", participants: 6, status: "pending", paymentStatus: "unpaid", mediaServices: ["360 카메라"], memo: "단체 문의" },
  { id: "R-2026-0304", date: "2026-03-29", time: "09:00", name: "최유리", phone: "010-3333-4444", program: "자전거 대여 (일반)", participants: 3, status: "pending", paymentStatus: "unpaid", mediaServices: ["모션캠"], memo: "" },
  { id: "R-2026-0305", date: "2026-03-29", time: "13:30", name: "정도윤", phone: "010-7777-8888", program: "카누 체험 (일반)", participants: 2, status: "confirmed", paymentStatus: "paid", mediaServices: ["드론 촬영", "모션캠"], memo: "모션캠 대여 희망" },
  { id: "R-2026-0306", date: "2026-03-30", time: "11:00", name: "한소희", phone: "010-1111-2222", program: "카누 체험 (숙박 프로모션)", participants: 4, status: "pending", paymentStatus: "unpaid", mediaServices: [], memo: "숙박확인서 지참 예정" },
  { id: "R-2026-0307", date: "2026-03-25", time: "09:00", name: "오세훈", phone: "010-4444-5555", program: "카누 체험 (일반)", participants: 2, status: "completed", paymentStatus: "paid", mediaServices: ["360 카메라"], memo: "" },
  { id: "R-2026-0308", date: "2026-03-25", time: "15:30", name: "윤서아", phone: "010-6666-7777", program: "자전거 대여 (2인)", participants: 2, status: "completed", paymentStatus: "paid", mediaServices: [], memo: "" },
  { id: "R-2026-0309", date: "2026-03-26", time: "11:00", name: "강태호", phone: "010-8888-9999", program: "카누 체험 (일반)", participants: 4, status: "cancelled", paymentStatus: "refunded", mediaServices: ["드론 촬영"], memo: "우천 취소" },
  { id: "R-2026-0310", date: "2026-03-31", time: "09:00", name: "임지현", phone: "010-2222-3333", program: "카누 체험 (국가유공자)", participants: 2, status: "pending", paymentStatus: "unpaid", mediaServices: [], memo: "증빙서류 지참" },
  { id: "R-2026-0311", date: "2026-03-28", time: "13:30", name: "송지효", phone: "010-1122-3344", program: "카누 체험 (일반)", participants: 2, status: "in_progress", paymentStatus: "paid", mediaServices: ["360 카메라"], memo: "" },
  { id: "R-2026-0312", date: "2026-03-27", time: "09:00", name: "유재석", phone: "010-5566-7788", program: "카누 체험 (일반)", participants: 4, status: "no_show", paymentStatus: "paid", mediaServices: [], memo: "" },
];

/* ================================================================
   카누 세션 관리
   ================================================================ */

export type SessionStatus = "open" | "closed" | "suspended";
export type WeatherStatus = "clear" | "cloudy" | "light_rain" | "heavy_rain" | "strong_wind";

export interface CanoeSession {
  id: string;
  date: string;
  time: string;
  maxCapacity: number;
  currentParticipants: number;
  assignedGuides: string[];
  weather: WeatherStatus;
  status: SessionStatus;
}

export const SESSION_STATUS_MAP: Record<
  SessionStatus,
  { label: string; color: string; bg: string }
> = {
  open: { label: "운영", color: "text-emerald-700", bg: "bg-emerald-50" },
  closed: { label: "마감", color: "text-gray-600", bg: "bg-gray-100" },
  suspended: { label: "중단", color: "text-red-600", bg: "bg-red-50" },
};

export const WEATHER_STATUS_MAP: Record<
  WeatherStatus,
  { label: string; icon: string }
> = {
  clear: { label: "맑음", icon: "☀️" },
  cloudy: { label: "흐림", icon: "☁️" },
  light_rain: { label: "약한 비", icon: "🌦️" },
  heavy_rain: { label: "폭우", icon: "🌧️" },
  strong_wind: { label: "강풍", icon: "💨" },
};

export const MOCK_SESSIONS: CanoeSession[] = [
  { id: "S-0328-1", date: "2026-03-28", time: "09:00", maxCapacity: 16, currentParticipants: 6, assignedGuides: ["가이드A", "가이드B"], weather: "clear", status: "open" },
  { id: "S-0328-2", date: "2026-03-28", time: "11:00", maxCapacity: 16, currentParticipants: 14, assignedGuides: ["가이드A", "가이드C"], weather: "clear", status: "open" },
  { id: "S-0328-3", date: "2026-03-28", time: "13:30", maxCapacity: 16, currentParticipants: 2, assignedGuides: ["가이드B"], weather: "cloudy", status: "open" },
  { id: "S-0328-4", date: "2026-03-28", time: "15:30", maxCapacity: 16, currentParticipants: 0, assignedGuides: ["가이드C"], weather: "cloudy", status: "open" },
  { id: "S-0329-1", date: "2026-03-29", time: "09:00", maxCapacity: 16, currentParticipants: 3, assignedGuides: ["가이드A", "가이드B"], weather: "clear", status: "open" },
  { id: "S-0329-2", date: "2026-03-29", time: "11:00", maxCapacity: 16, currentParticipants: 0, assignedGuides: ["가이드A"], weather: "clear", status: "open" },
  { id: "S-0329-3", date: "2026-03-29", time: "13:30", maxCapacity: 16, currentParticipants: 2, assignedGuides: ["가이드B"], weather: "light_rain", status: "open" },
  { id: "S-0329-4", date: "2026-03-29", time: "15:30", maxCapacity: 16, currentParticipants: 0, assignedGuides: ["가이드C"], weather: "light_rain", status: "suspended" },
  { id: "S-0330-1", date: "2026-03-30", time: "09:00", maxCapacity: 16, currentParticipants: 0, assignedGuides: ["가이드A", "가이드B"], weather: "strong_wind", status: "suspended" },
  { id: "S-0330-2", date: "2026-03-30", time: "11:00", maxCapacity: 16, currentParticipants: 4, assignedGuides: ["가이드A", "가이드C"], weather: "clear", status: "open" },
];

/* ================================================================
   미디어 장비 관리
   ================================================================ */

export type MediaType = "drone" | "camera_360" | "motion_cam";
export type MediaStatus = "available" | "in_use" | "charging" | "maintenance" | "unavailable_weather";

export interface MediaEquipment {
  id: string;
  type: MediaType;
  label: string;
  status: MediaStatus;
  linkedReservation: string | null;
  note: string;
}

export const MEDIA_TYPE_MAP: Record<MediaType, { label: string; icon: string }> = {
  drone: { label: "드론", icon: "🛸" },
  camera_360: { label: "360 카메라", icon: "📷" },
  motion_cam: { label: "모션캠", icon: "🎥" },
};

export const MEDIA_STATUS_MAP: Record<
  MediaStatus,
  { label: string; color: string; bg: string }
> = {
  available: { label: "사용 가능", color: "text-emerald-700", bg: "bg-emerald-50" },
  in_use: { label: "사용 중", color: "text-blue-700", bg: "bg-blue-50" },
  charging: { label: "충전 중", color: "text-violet-700", bg: "bg-violet-50" },
  maintenance: { label: "점검 중", color: "text-amber-700", bg: "bg-amber-50" },
  unavailable_weather: { label: "기상 불가", color: "text-red-600", bg: "bg-red-50" },
};

export const MOCK_MEDIA: MediaEquipment[] = [
  // 드론 1대
  { id: "DR-01", type: "drone", label: "드론 #1", status: "maintenance", linkedReservation: null, note: "정기 점검" },
  // 360 카메라 3대
  { id: "C360-01", type: "camera_360", label: "360 카메라 #1", status: "available", linkedReservation: null, note: "" },
  { id: "C360-02", type: "camera_360", label: "360 카메라 #2", status: "in_use", linkedReservation: "R-2026-0311", note: "09:00 세션 사용 중" },
  { id: "C360-03", type: "camera_360", label: "360 카메라 #3", status: "charging", linkedReservation: null, note: "15시 사용 예정" },
  // 모션캠 3대
  { id: "MC-01", type: "motion_cam", label: "모션캠 #1", status: "available", linkedReservation: null, note: "" },
  { id: "MC-02", type: "motion_cam", label: "모션캠 #2", status: "in_use", linkedReservation: "R-2026-0305", note: "정도윤님 대여" },
  { id: "MC-03", type: "motion_cam", label: "모션캠 #3", status: "maintenance", linkedReservation: null, note: "렌즈 점검" },
];

/* ================================================================
   상태 변경 로그
   ================================================================ */

export interface StatusLog {
  id: string;
  timestamp: string;
  category: "reservation" | "bike" | "session" | "media";
  targetId: string;
  targetLabel: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
}

export const MOCK_LOGS: StatusLog[] = [
  { id: "L-001", timestamp: "2026-03-28 08:45", category: "reservation", targetId: "R-2026-0301", targetLabel: "김민수 예약", fromStatus: "대기", toStatus: "확정", changedBy: "관리자A" },
  { id: "L-002", timestamp: "2026-03-28 08:50", category: "reservation", targetId: "R-2026-0302", targetLabel: "이지은 예약", fromStatus: "대기", toStatus: "확정", changedBy: "관리자A" },
  { id: "L-003", timestamp: "2026-03-28 09:05", category: "media", targetId: "C360-02", targetLabel: "360 카메라 #2", fromStatus: "사용 가능", toStatus: "사용 중", changedBy: "가이드A" },
  { id: "L-004", timestamp: "2026-03-28 13:30", category: "bike", targetId: "BN-02", targetLabel: "일반 자전거 #2", fromStatus: "대여 가능", toStatus: "대여 중", changedBy: "관리자B" },
  { id: "L-005", timestamp: "2026-03-28 14:00", category: "reservation", targetId: "R-2026-0311", targetLabel: "송지효 예약", fromStatus: "확정", toStatus: "진행 중", changedBy: "관리자A" },
  { id: "L-006", timestamp: "2026-03-27 09:30", category: "reservation", targetId: "R-2026-0312", targetLabel: "유재석 예약", fromStatus: "확정", toStatus: "노쇼", changedBy: "관리자A" },
  { id: "L-007", timestamp: "2026-03-28 14:30", category: "bike", targetId: "BC-01", targetLabel: "어린이 자전거 #1", fromStatus: "대여 가능", toStatus: "대여 중", changedBy: "관리자B" },
  { id: "L-008", timestamp: "2026-03-28 08:30", category: "session", targetId: "S-0329-4", targetLabel: "3/29 15:30 세션", fromStatus: "운영", toStatus: "중단", changedBy: "관리자A" },
];
