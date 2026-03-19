'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/projects', icon: 'folder_open', label: 'Projects' },
    { href: '/timer', icon: 'timer', label: 'Timer' },
    { href: '/analytics', icon: 'analytics', label: 'Analytics' },
  ]

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest flex flex-col p-6 gap-8 z-50 border-r border-outline-variant/10 shadow-sm hidden md:flex">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-black text-indigo-700 dark:text-indigo-300 tracking-tighter font-headline">FounderEngine</span>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden">
            <div className="w-full h-full bg-primary text-white font-bold flex items-center justify-center font-headline text-lg">
              AR
            </div>
          </div>
          <div>
            <div className="font-manrope font-bold text-sm text-on-surface">The Editor</div>
            <div className="text-xs text-on-surface-variant font-medium">Solo Mode</div>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2">
        {links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold text-sm transition-all duration-150 active:scale-[0.98] ${isActive ? 'bg-primary/5 text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/50'}`}>
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-4">
        <button className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold text-sm shadow-lg active:scale-95 duration-200 flex items-center justify-center gap-2 hover:shadow-primary/20 hover:scale-[1.02] transition-all">
          <span className="material-symbols-outlined" data-icon="add">add</span>
          New Project
        </button>
      </div>
      
      <div className="mt-auto flex flex-col gap-2 pt-6 border-t border-outline-variant/10">
        <a className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-primary font-headline font-semibold text-sm transition-all" href="#">
          <span className="material-symbols-outlined">help_outline</span>
          Support
        </a>
        <a className="flex items-center gap-3 text-on-surface-variant px-4 py-3 hover:text-primary font-headline font-semibold text-sm transition-all" href="#">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </a>
      </div>
    </aside>
  )
}
