"use client";

import { useState, type FormEvent } from "react";
import { RESERVATION_PROGRAMS, TIME_SLOTS } from "@/constants/pricing";

export default function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: 백엔드 연동 시 여기에 API 호출 추가
    setSubmitted(true);
  }

  if (submitted) {
    return <SuccessMessage onReset={() => setSubmitted(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ───── 프로그램 선택 ───── */}
      <fieldset>
        <legend className="mb-4 text-lg font-bold text-gray-900">
          프로그램 선택
        </legend>
        <div className="space-y-4">
          <FormField label="프로그램" htmlFor="program" required>
            <select
              id="program"
              name="program"
              required
              defaultValue=""
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="" disabled>
                프로그램을 선택하세요
              </option>
              <optgroup label="카누 체험">
                {RESERVATION_PROGRAMS.filter((p) =>
                  p.value.startsWith("canoe")
                ).map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="자전거 대여">
                {RESERVATION_PROGRAMS.filter((p) =>
                  p.value.startsWith("bike")
                ).map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </FormField>

          <FormField label="모션캠 대여 (+10,000원)" htmlFor="motion-cam">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="motion-cam"
                name="motionCam"
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-600">
                모션캠 대여를 추가합니다.
              </span>
            </div>
          </FormField>
        </div>
      </fieldset>

      {/* ───── 일정 선택 ───── */}
      <fieldset>
        <legend className="mb-4 text-lg font-bold text-gray-900">
          일정 선택
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="예약 날짜" htmlFor="date" required>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </FormField>

          <FormField label="시간대 (일반 시즌)" htmlFor="timeSlot" required>
            <select
              id="timeSlot"
              name="timeSlot"
              required
              defaultValue=""
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="" disabled>
                시간대를 선택하세요
              </option>
              <optgroup label="일반 시즌 (09:00~18:00)">
                {TIME_SLOTS.standard.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="하절기 (06:00~15:00)">
                {TIME_SLOTS.summer.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </FormField>

          <FormField label="인원" htmlFor="participants" required>
            <input
              type="number"
              id="participants"
              name="participants"
              min={1}
              max={20}
              required
              placeholder="인원을 입력하세요"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <p className="mt-1 text-xs text-gray-400">
              카누는 2인승이며, 회당 최대 16명(카누 8척)까지 가능합니다.
            </p>
          </FormField>
        </div>
      </fieldset>

      {/* ───── 예약자 정보 ───── */}
      <fieldset>
        <legend className="mb-4 text-lg font-bold text-gray-900">
          예약자 정보
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="이름" htmlFor="name" required>
            <input
              type="text"
              id="name"
              name="name"
              required
              autoComplete="name"
              placeholder="홍길동"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </FormField>

          <FormField label="연락처" htmlFor="phone" required>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              autoComplete="tel"
              placeholder="010-0000-0000"
              pattern="[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </FormField>
        </div>

        <div className="mt-4">
          <FormField label="요청사항" htmlFor="memo">
            <textarea
              id="memo"
              name="memo"
              rows={3}
              placeholder="요청사항이 있으시면 입력해 주세요. (선택)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </FormField>
        </div>
      </fieldset>

      {/* ───── 안전 및 기상 안내 ───── */}
      <div className="space-y-4 rounded-2xl bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-bold text-amber-800">
              안전 및 기상 안내
            </h4>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-700">
              <li>
                - 모든 카누 탑승자는 구명조끼를 필수로 착용해야 합니다.
              </li>
              <li>
                - 풍속 4m/s 이상, 수위 1.2m 초과 시 카누 운영이 중단됩니다.
              </li>
              <li>
                - 폭우, 태풍 등 기상 악화 시 당일 운영이 취소될 수 있습니다.
              </li>
              <li>
                - 폭염주의보 발령 시 13:00~17:00 회차는 취소됩니다.
              </li>
              <li>
                - 가벼운 비: 현장 상황 판단 후 운영 여부가 결정됩니다.
              </li>
              <li>
                - 매주 화/수요일 정기 휴무 / 7월 전체 휴장
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ───── 동의 및 제출 ───── */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-600">
            상기 안전 및 기상 안내 사항을 확인하였으며, 기상 상황에 따른 운영
            변경/취소에 동의합니다.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-500 hover:shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.98]"
        >
          예약 신청하기
        </button>

        <p className="text-center text-xs text-gray-400">
          예약 신청 후 담당자 확인을 거쳐 최종 확정됩니다.
          <br />
          현장 구매도 가능하며, 잔여석에 한해 이용 가능합니다.
        </p>
      </div>
    </form>
  );
}

/* ────────────────────────────────────────────
   공통 폼 필드 래퍼
   ──────────────────────────────────────────── */
function FormField({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────
   제출 완료 메시지
   ──────────────────────────────────────────── */
function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-16 text-center" role="alert">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
        <svg
          className="h-10 w-10 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        예약 신청이 완료되었습니다
      </h2>
      <p className="mb-8 max-w-md text-sm text-gray-500">
        담당자 확인 후 입력하신 연락처로 예약 확정 안내를 드립니다.
        <br />
        문의사항은 체험장으로 직접 연락해 주세요.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        새 예약 신청하기
      </button>
    </div>
  );
}
