// components/AppSidebar.tsx
import Link from "next/link";

export function AppSidebar() {
  const locations = [
    { label: "すべて", value: "" },
    { label: "関東広域", value: "kat" },
    { label: "北陸", value: "hok" },
    { label: "東海", value: "tok" },
    { label: "近畿", value: "kin" },
    { label: "中四国", value: "chu" },
    { label: "九州", value: "kyu" },
  ];

  return (
    <aside className="w-64 border-r bg-lime-100 h-full p-4 flex flex-col">
      <div className="text-lg font-bold mb-6">売上管理おまかせくん</div>

      <div className="space-y-2">
        {locations.map((loc) => (
          <Link
            key={loc.value}
            href={`/users/${loc.value}`}
            className="block px-3 py-2 rounded hover:bg-accent transition"
          >
            {loc.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
