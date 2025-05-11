export default function HomePage() {
  return (
    <main className="p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          これはテストページです
        </h1>
      </header>
      <section className="text-lg text-gray-700">
        <p className="mb-4">
          ログインをしていなくてもこのページにはアクセスできますが、以下のページにはアクセスできません：
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <a
              href="https://1-6-sales-nextjs.vercel.app/admin"
              className="text-blue-600 underline"
            >
              https://1-6-sales-nextjs.vercel.app/admin
            </a>
          </li>
          <li>
            <a
              href="https://1-6-sales-nextjs.vercel.app/sales"
              className="text-blue-600 underline"
            >
              https://1-6-sales-nextjs.vercel.app/sales
            </a>
          </li>
          <li>
            <a
              href="https://1-6-sales-nextjs.vercel.app/users"
              className="text-blue-600 underline"
            >
              https://1-6-sales-nextjs.vercel.app/users
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
