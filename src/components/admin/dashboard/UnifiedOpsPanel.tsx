import {
  MOCK_SESSIONS,
  MOCK_BIKES,
  MOCK_MEDIA,
  SESSION_STATUS_MAP,
  WEATHER_STATUS_MAP,
  MEDIA_TYPE_MAP,
  MEDIA_STATUS_MAP,
  type MediaType,
} from "@/constants/mock-data";

interface UnifiedOpsPanelProps {
  date: string;
}

export default function UnifiedOpsPanel({ date }: UnifiedOpsPanelProps) {
  return (
    <div className="space-y-6">
      <SessionStrip date={date} />
      <BikeBar />
      <MediaSummary />
    </div>
  );
}

/* ── Canoe Sessions Strip ── */
function SessionStrip({ date }: { date: string }) {
  const todaySessions = MOCK_SESSIONS.filter((s) => s.date === date);
  const totalParticipants = todaySessions.reduce(
    (sum, s) => sum + s.currentParticipants,
    0,
  );
  const totalCapacity = todaySessions.reduce(
    (sum, s) => sum + s.maxCapacity,
    0,
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900">카누 세션 운영</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            총 {todaySessions.length}회
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            참가 {totalParticipants}/{totalCapacity}명
          </span>
        </div>
      </div>

      {todaySessions.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          오늘 운영 세션이 없습니다.
        </p>
      ) : (
        <div className="flex gap-3 overflow-x-auto p-4">
          {todaySessions.map((session) => {
            const sStat = SESSION_STATUS_MAP[session.status];
            const weather = WEATHER_STATUS_MAP[session.weather];
            const pct = Math.round(
              (session.currentParticipants / session.maxCapacity) * 100,
            );
            const barColor =
              pct >= 100
                ? "bg-red-500"
                : pct >= 80
                  ? "bg-amber-500"
                  : "bg-emerald-500";
            const borderColor =
              session.status === "suspended"
                ? "border-red-300"
                : pct >= 80
                  ? "border-amber-300"
                  : "border-gray-200";

            return (
              <div
                key={session.id}
                className={`flex w-44 shrink-0 flex-col rounded-xl border-2 bg-white p-3 ${borderColor}`}
              >
                {/* Time + Status */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">
                    {session.time}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sStat.color} ${sStat.bg}`}
                  >
                    {sStat.label}
                  </span>
                </div>

                {/* Capacity bar */}
                <div className="mb-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                      {session.currentParticipants}/{session.maxCapacity}명
                    </span>
                    <span className="text-[10px] text-gray-400">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Weather */}
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-sm">{weather.icon}</span>
                  <span className="text-[11px] text-gray-500">
                    {weather.label}
                  </span>
                </div>

                {/* Guides */}
                <div className="flex flex-wrap gap-1">
                  {session.assignedGuides.map((g) => (
                    <span
                      key={g}
                      className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Bike Rental Bar ── */
function BikeBar() {
  const available = MOCK_BIKES.filter((b) => b.status === "available").length;
  const rented = MOCK_BIKES.filter((b) => b.status === "rented").length;
  const maintenance = MOCK_BIKES.filter(
    (b) => b.status === "maintenance",
  ).length;
  const total = MOCK_BIKES.length;

  const segments = [
    { count: available, label: "대여 가능", color: "bg-emerald-500", textColor: "text-emerald-700", bgLight: "bg-emerald-50" },
    { count: rented, label: "대여 중", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-50" },
    { count: maintenance, label: "점검 중", color: "bg-amber-500", textColor: "text-amber-700", bgLight: "bg-amber-50" },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375m0 0V4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v9.375m0 0h.375" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900">자전거 현황</h3>
        </div>
        <span className="text-xs text-gray-400">전체 {total}대</span>
      </div>

      <div className="px-5 py-4">
        {/* Stacked bar */}
        <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
          {segments.map((seg) =>
            seg.count > 0 ? (
              <div
                key={seg.label}
                className={`${seg.color} transition-all`}
                style={{ width: `${(seg.count / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-3">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
              <span className="text-xs text-gray-500">{seg.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-bold ${seg.textColor} ${seg.bgLight}`}
              >
                {seg.count}대
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Media Equipment Summary ── */
function MediaSummary() {
  const types: MediaType[] = ["drone", "camera_360", "motion_cam"];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900">미디어 장비</h3>
        </div>
        <span className="text-xs text-gray-400">전체 {MOCK_MEDIA.length}대</span>
      </div>

      <div className="divide-y divide-gray-50 px-5">
        {types.map((type) => {
          const typeInfo = MEDIA_TYPE_MAP[type];
          const items = MOCK_MEDIA.filter((m) => m.type === type);

          return (
            <div key={type} className="flex items-center gap-3 py-3">
              {/* Type icon + label */}
              <span className="text-base">{typeInfo.icon}</span>
              <span className="w-20 shrink-0 text-sm font-medium text-gray-700">
                {typeInfo.label}
              </span>

              {/* Status dots for each item */}
              <div className="flex flex-1 flex-wrap items-center gap-2">
                {items.map((item) => {
                  const st = MEDIA_STATUS_MAP[item.status];
                  return (
                    <span
                      key={item.id}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.color} ${st.bg}`}
                      title={item.note || item.label}
                    >
                      {st.label}
                    </span>
                  );
                })}
              </div>

              {/* Total */}
              <span className="shrink-0 text-xs text-gray-400">
                {items.length}대
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
