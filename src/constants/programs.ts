export interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  recommended: string[];
  image: string;
  imageAlt: string;
  highlights: string[];
}

export const CANOE_PROGRAMS: Program[] = [
  {
    id: "canoe-main",
    title: "장자늪 카누 체험",
    description:
      "장자늪 자연 수로를 따라 왕복 약 3.3km를 이동하는 가이드 동행 카누 프로그램입니다. 탑승 전 안전 교육, 구명조끼 착용 후 전문 가이드와 함께 출발합니다.",
    duration: "약 2시간 (안전교육/카누체험/이동 포함)",
    recommended: ["가족", "연인", "친구", "초보자"],
    image: "/images/program-canoe-main.svg",
    imageAlt: "장자늪 수로를 따라 카누를 타는 체험자들",
    highlights: [
      "전문 자격 가이드 동행",
      "수로 왕복 약 3.3km 코스",
      "안전 교육 및 구명조끼 제공",
      "2인승 카누 (회당 최대 10척)",
    ],
  },
];

export const SPECIAL_PROGRAMS: Program[] = [
  {
    id: "canoe-group",
    title: "단체/행사 카누 투어",
    description:
      "기업 워크숍, 동호회, 학교 단체 등을 위한 맞춤 카누 체험입니다. 인원과 일정에 맞춰 별도 협의 후 운영됩니다.",
    duration: "약 2시간 (협의 가능)",
    recommended: ["기업 단체", "동호회", "학교/청소년 단체"],
    image: "/images/program-canoe-group.svg",
    imageAlt: "단체로 카누를 즐기는 참가자들",
    highlights: [
      "단체 맞춤 일정 조율",
      "전문 가이드 다수 배치",
      "안전 장비 일괄 제공",
      "단체 사진 촬영 가능",
    ],
  },
  {
    id: "canoe-seasonal",
    title: "시즌 특별 투어",
    description:
      "봄 벚꽃, 가을 단풍 등 계절에 따라 특별한 수로 풍경을 즐길 수 있는 시즌 한정 프로그램입니다.",
    duration: "약 2시간",
    recommended: ["연인", "사진 애호가", "자연 체험 희망자"],
    image: "/images/program-canoe-seasonal.svg",
    imageAlt: "계절 풍경 속 카누 체험",
    highlights: [
      "계절별 특별 코스 운영",
      "포토 스팟 안내",
      "소규모 프리미엄 운영",
      "시즌 한정 진행",
    ],
  },
];

export const BIKE_PROGRAMS: Program[] = [
  {
    id: "bike-rental",
    title: "자전거 대여 프로그램",
    description:
      "카누 체험 후 또는 단독으로 이용 가능한 자전거 대여 프로그램입니다. 목계 솔밭 일대의 자연 속 라이딩을 즐겨보세요. 헬멧과 안전 안내가 제공됩니다.",
    duration: "자유 이용",
    recommended: ["가족", "어린이 동반", "라이딩 애호가"],
    image: "/images/program-bike-general.svg",
    imageAlt: "자연 속 자전거 라이딩",
    highlights: [
      "일반 / 2인 / 어린이용 선택 가능",
      "헬멧 및 안전 가이드 제공",
      "카누 체험 후 연계 이용 가능",
      "모션캠 대여 옵션 (+10,000원)",
    ],
  },
];
