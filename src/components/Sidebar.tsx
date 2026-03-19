'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/projects', icon: 'folder_open', label: 'Projects' },
  { href: '/timer', icon: 'timer', label: 'Timer' },
  { href: '/analytics', icon: 'analytics', label: 'Analytics' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ─────────────────────────────────────────
          DESKTOP SIDEBAR  (hidden on mobile)
      ───────────────────────────────────────── */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-white flex-col p-6 gap-6 z-50 border-r border-outline-variant/10">
        {/* Brand + user */}
        <div className="flex flex-col gap-1 mb-2">
          <span className="text-xl font-extrabold tracking-tight text-primary font-headline">FounderEngine</span>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm font-headline shadow-sm">
              AR
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">The Editor</p>
              <p className="text-xs text-on-surface-variant">Solo Mode</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-primary/8 text-primary'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container/60'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* New project CTA */}
        <div className="mt-1">
          <button className="w-full py-3 px-5 bg-primary text-white rounded-full text-sm font-semibold shadow shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>New Project
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-auto flex flex-col gap-1 pt-5 border-t border-outline-variant/10">
          <a className="flex items-center gap-3 text-on-surface-variant px-4 py-2.5 text-sm font-semibold hover:text-primary transition-colors" href="#">
            <span className="material-symbols-outlined text-[19px]">help_outline</span>Support
          </a>
          <a className="flex items-center gap-3 text-on-surface-variant px-4 py-2.5 text-sm font-semibold hover:text-primary transition-colors" href="#">
            <span className="material-symbols-outlined text-[19px]">logout</span>Sign Out
          </a>
        </div>
      </aside>

      {/* ─────────────────────────────────────────
          MOBILE TOP BAR  (visible only on mobile)
      ───────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-4 h-14 shadow-sm">
        <span className="text-base font-extrabold tracking-tight text-primary font-headline">FounderEngine</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/15 text-primary text-xs font-bold flex items-center justify-center rounded-full border border-primary/20">
            AR
          </div>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-xl hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-white border-b border-outline-variant/10 shadow-lg px-4 py-3 flex flex-col gap-1">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-primary/8 text-primary' : 'text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
          <div className="pt-3 mt-1 border-t border-outline-variant/10">
            <button className="w-full py-3 bg-primary text-white rounded-full text-sm font-semibold shadow flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>New Project
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          MOBILE BOTTOM TAB BAR
      ───────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 flex items-stretch h-16 safe-padding-bottom">
        {links.map(link => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {link.icon}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
