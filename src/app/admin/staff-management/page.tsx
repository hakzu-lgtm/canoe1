import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import StaffManagementBoard from "@/components/admin/StaffManagementBoard";

export const metadata: Metadata = {
  title: "스태프 관리 | 장자늪 카누 체험장",
};

export default function StaffManagementPage() {
  return (
    <div>
      <AdminPageHeader
        title="스태프 관리"
        description="스태프 현황을 확인하고 빠르게 상태를 관리합니다."
      />
      <StaffManagementBoard />
    </div>
  );
}
