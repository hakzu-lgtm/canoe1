import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin";
import CanoeSessionBoard from "@/components/admin/CanoeSessionBoard";

export const metadata: Metadata = {
  title: "카누 세션 관리 | 장자늪 카누 체험장",
};

export default function CanoeSessionsPage() {
  return (
    <div>
      <AdminPageHeader
        title="카누 세션 관리"
        description="회차별 카누 세션 현황을 확인하고 운영 상태를 관리합니다."
      />
      <CanoeSessionBoard />
    </div>
  );
}
