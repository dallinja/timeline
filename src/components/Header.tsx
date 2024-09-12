import Link from 'next/link'
import { ProfileDropdown } from './ProfileDropdown'
import InitialDataDialog from './InitialDataDialog'

export default function Header() {
  return (
    <nav className="sticky top-0 z-10 flex h-16 w-full justify-center border-b border-b-foreground/10 bg-white">
      <div className="flex w-full items-center justify-between p-3 px-5 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={'/'}>Timeline</Link>
        </div>
        <div className="flex items-center gap-5 font-semibold">
          <InitialDataDialog />
          <ProfileDropdown />
        </div>
        {/* {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />} */}
      </div>
    </nav>
  )
}
