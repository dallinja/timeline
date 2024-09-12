import Header from '@/components/Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <div className="flex flex-col">{children}</div>
    </>
  )
}
