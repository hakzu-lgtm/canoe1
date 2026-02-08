export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "프로그램", href: "/programs" },
  { label: "찾아오는 길", href: "/directions" },
  { label: "이용요금", href: "/pricing" },
  { label: "예약하기", href: "/reservation" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  {
    label: "관리자",
    href: "/admin",
    children: [
      { label: "예약 관리", href: "/admin/reservation-management" },
      { label: "카누 세션 관리", href: "/admin/canoe-sessions" },
      { label: "자전거 대여 관리", href: "/admin/bike-rental" },
      { label: "미디어 장비 관리", href: "/admin/media-equipment" },
      { label: "스태프 관리", href: "/admin/staff-management" },
      { label: "스태프 일정", href: "/admin/staff-scheduling" },
    ],
  },
];

export const SITE_CONFIG = {
  name: "장자늪 카누 체험장",
  description: "자연 속에서 즐기는 특별한 카누 체험",
  address: "충청북도 충주시 장천리 791-10, 장자늪 수로 일원",
  departureSite: "목계 솔밭 캠핑장 (충주시 장천리 399)",
  phone: "043-000-0000",
  operatingPeriod: "2026.03.23 ~ 2026.11.30",
  closedDays: "매주 화/수요일 / 7월 휴장",
  operatingHours: {
    standard: "09:00 ~ 18:00 (1일 4회)",
    summer: "06:00 ~ 15:00 (1일 3회)",
  },
  sessionDuration: "약 2시간 (안전교육/카누체험/이동 포함)",
} as const;
