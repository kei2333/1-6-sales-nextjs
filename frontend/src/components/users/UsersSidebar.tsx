// components/AppSidebar.tsx
import Link from "next/link";

export function AppSidebar() {
  const locations = [
    { label: "東京本社", value: "tokyo" },
    { label: "大阪支店", value: "osaka" },
    { label: "名古屋支店", value: "nagoya" },
  ];

  return (
    <aside className="w-64 border-r bg-muted h-full p-4 flex flex-col">
      <div className="text-lg font-bold mb-6">売上管理おまかせくん</div>

      <div className="space-y-2">
        {locations.map((loc) => (
          <Link
            key={loc.value}
            href={`/admin/users/${loc.value}`}
            className="block px-3 py-2 rounded hover:bg-accent transition"
          >
            {loc.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
