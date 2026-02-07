export interface PricingRow {
  program: string;
  type: string;
  duration: string;
  price: string;
  notes: string;
}

export const CANOE_PRICING: PricingRow[] = [
  {
    program: "카누 체험",
    type: "일반",
    duration: "약 2시간",
    price: "20,000원",
    notes: "구명조끼 필수 착용 / 가이드 동행",
  },
  {
    program: "카누 체험",
    type: "충주시민",
    duration: "약 2시간",
    price: "10,000원",
    notes: "신분증 확인 필요",
  },
  {
    program: "카누 체험",
    type: "동주시민",
    duration: "약 2시간",
    price: "14,000원",
    notes: "신분증 확인 필요",
  },
  {
    program: "카누 체험",
    type: "국가유공자 및 장애인",
    duration: "약 2시간",
    price: "14,000원",
    notes: "관련 증빙 서류 필요",
  },
  {
    program: "카누 체험",
    type: "충주 관내 숙박 프로모션",
    duration: "약 2시간",
    price: "10,000원",
    notes: "숙박 확인서 지참",
  },
];

export const BIKE_PRICING: PricingRow[] = [
  {
    program: "자전거 대여",
    type: "일반 자전거",
    duration: "자유 이용",
    price: "10,000원",
    notes: "헬멧 제공 / 안전 안내 포함",
  },
  {
    program: "자전거 대여",
    type: "2인 자전거",
    duration: "자유 이용",
    price: "15,000원",
    notes: "2인 탑승 / 헬멧 제공",
  },
  {
    program: "자전거 대여",
    type: "어린이용",
    duration: "자유 이용",
    price: "5,000원",
    notes: "보호자 동반 권장",
  },
];

export const OPTION_PRICING: PricingRow[] = [
  {
    program: "옵션 서비스",
    type: "모션캠 대여",
    duration: "체험 시간 동안",
    price: "+10,000원",
    notes: "자전거/카누 이용 시 추가 선택",
  },
];

/** 미디어 서비스 가격 (원) */
export const MEDIA_SERVICE_PRICING: Record<string, number> = {
  "드론 촬영": 20000,
  "360 카메라": 15000,
  "모션캠": 10000,
};

/** 프로그램 문자열 → 1인당 가격 (원) */
export const PROGRAM_PRICE_MAP: Record<string, number> = {
  "카누 체험 (일반)": 20000,
  "카누 체험 (충주시민)": 10000,
  "카누 체험 (동주시민)": 14000,
  "카누 체험 (국가유공자)": 14000,
  "카누 체험 (숙박 프로모션)": 10000,
  "자전거 대여 (일반)": 10000,
  "자전거 대여 (2인)": 15000,
  "자전거 대여 (어린이용)": 5000,
};

/** 미디어 서비스 이름 → MediaType */
export const MEDIA_SERVICE_TO_TYPE: Record<string, "drone" | "camera_360" | "motion_cam"> = {
  "드론 촬영": "drone",
  "360 카메라": "camera_360",
  "모션캠": "motion_cam",
};

/** 예약 페이지 프로그램 셀렉트 옵션 */
export const RESERVATION_PROGRAMS = [
  { value: "canoe-general", label: "카누 체험 - 일반 (20,000원)" },
  { value: "canoe-chungju", label: "카누 체험 - 충주시민 (10,000원)" },
  { value: "canoe-dongju", label: "카누 체험 - 동주시민 (14,000원)" },
  { value: "canoe-veteran", label: "카누 체험 - 국가유공자/장애인 (14,000원)" },
  { value: "canoe-promo", label: "카누 체험 - 숙박 프로모션 (10,000원)" },
  { value: "bike-normal", label: "자전거 대여 - 일반 (10,000원)" },
  { value: "bike-tandem", label: "자전거 대여 - 2인 (15,000원)" },
  { value: "bike-child", label: "자전거 대여 - 어린이용 (5,000원)" },
] as const;

/** 시간대 슬롯 */
export const TIME_SLOTS = {
  standard: [
    { value: "09:00", label: "1회차 09:00" },
    { value: "11:00", label: "2회차 11:00" },
    { value: "13:30", label: "3회차 13:30" },
    { value: "15:30", label: "4회차 15:30" },
  ],
  summer: [
    { value: "06:00", label: "1회차 06:00" },
    { value: "08:30", label: "2회차 08:30" },
    { value: "11:00", label: "3회차 11:00" },
  ],
} as const;
