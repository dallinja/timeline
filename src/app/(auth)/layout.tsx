export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center pt-60">
      <div className="flex max-w-7xl flex-col items-start gap-12">{children}</div>
    </div>
  )
}
