import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import MediaEquipmentBoard from "@/components/admin/MediaEquipmentBoard";

export const metadata: Metadata = {
  title: "미디어 장비 관리 | 장자늪 카누 체험장",
};

export default function MediaEquipmentPage() {
  return (
    <div>
      <AdminPageHeader
        title="미디어 장비 관리"
        description="드론, 360 카메라, 모션캠 장비 현황을 확인하고 상태를 관리합니다."
      />
      <MediaEquipmentBoard />
    </div>
  );
}
