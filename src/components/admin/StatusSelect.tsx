"use client";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusSelectProps {
  currentValue: string;
  options: StatusOption[];
  onChange: (value: string) => void;
}

export default function StatusSelect({
  currentValue,
  options,
  onChange,
}: StatusSelectProps) {
  return (
    <select
      value={currentValue}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
