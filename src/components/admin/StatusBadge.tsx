interface StatusBadgeProps {
  label: string;
  color: string;
  bg: string;
}

export default function StatusBadge({ label, color, bg }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${color} ${bg}`}
    >
      {label}
    </span>
  );
}
