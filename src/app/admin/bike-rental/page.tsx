import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import BikeRentalDashboard from "@/components/admin/BikeRentalDashboard";

export const metadata: Metadata = {
  title: "자전거 대여 관리 | 장자늪 카누 체험장",
};

export default function BikeRentalPage() {
  return (
    <div>
      <AdminPageHeader
        title="자전거 대여 관리"
        description="자전거 현황을 확인하고 대여 상태를 관리합니다."
      />
      <BikeRentalDashboard />
    </div>
  );
}
