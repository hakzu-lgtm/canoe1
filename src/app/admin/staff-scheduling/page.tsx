import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import StaffScheduleBoard from "@/components/admin/StaffScheduleBoard";

export const metadata: Metadata = {
  title: "스태프 일정 관리 | 장자늪 카누 체험장",
};

export default function StaffSchedulingPage() {
  return (
    <div>
      <AdminPageHeader
        title="스태프 일정 관리"
        description="스태프 근무 일정을 확인하고 배정 상태를 관리합니다."
      />
      <StaffScheduleBoard />
    </div>
  );
}
