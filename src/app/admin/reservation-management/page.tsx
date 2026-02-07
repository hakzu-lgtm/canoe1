import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import ReservationTable from "@/components/admin/ReservationTable";

export const metadata: Metadata = {
  title: "예약 관리 | 장자늪 카누 체험장",
};

export default function ReservationManagementPage() {
  return (
    <div>
      <AdminPageHeader
        title="예약 관리"
        description="예약 현황을 확인하고 상태를 관리합니다."
      />
      <ReservationTable />
    </div>
  );
}
