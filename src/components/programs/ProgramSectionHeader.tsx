interface ProgramSectionHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export default function ProgramSectionHeader({
  badge,
  title,
  description,
}: ProgramSectionHeaderProps) {
  return (
    <div className="mb-10">
      <span className="mb-2 inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
        {badge}
      </span>
      <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base text-gray-500">{description}</p>
    </div>
  );
}
