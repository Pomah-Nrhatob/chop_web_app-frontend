export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <main className="p-6">
        {children} {/* Сюда будут подставляться страницы: /bc/security, /crm и т.д. */}
      </main>
      {/* Отображаем HomePage как часть общего интерфейса */}
    </div>
  )
}
