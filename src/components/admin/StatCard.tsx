interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  accentColor = "text-emerald-600",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {title}
          </p>
          <p className={`mt-2 text-3xl font-bold text-gray-900`}>{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 ${accentColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
