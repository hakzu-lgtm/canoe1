"use client";

import { MOCK_LOGS } from "@/constants/mock-data";

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  reservation: { label: "예약", color: "text-emerald-700 bg-emerald-50" },
  bike: { label: "자전거", color: "text-violet-700 bg-violet-50" },
  session: { label: "세션", color: "text-blue-700 bg-blue-50" },
  media: { label: "미디어", color: "text-amber-700 bg-amber-50" },
};

export default function StatusLogTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">시간</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">구분</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">대상</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">변경 내역</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">변경자</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {MOCK_LOGS.map((log) => {
            const cat = CATEGORY_MAP[log.category];
            return (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${cat.color}`}>
                    {cat.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.targetLabel}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="text-gray-400">{log.fromStatus}</span>
                  <span className="mx-1.5 text-gray-300">→</span>
                  <span className="font-medium text-gray-900">{log.toStatus}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{log.changedBy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
