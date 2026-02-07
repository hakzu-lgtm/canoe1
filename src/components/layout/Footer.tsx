import Link from "next/link";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              바로가기
            </h4>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-emerald-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">
              이용 안내
            </h4>
            <ul className="space-y-2 text-sm">
              <li>주소: {SITE_CONFIG.address}</li>
              <li>전화: {SITE_CONFIG.phone}</li>
              <li>운영기간: {SITE_CONFIG.operatingPeriod}</li>
              <li>일반 {SITE_CONFIG.operatingHours.standard}</li>
              <li>하절기 {SITE_CONFIG.operatingHours.summer}</li>
              <li>휴무: {SITE_CONFIG.closedDays}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
