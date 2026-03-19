import { prisma } from '@/lib/prisma'
import TimerWidget from '@/components/TimerWidget'

export const dynamic = 'force-dynamic'

export default async function TimerPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [projects, todaySessions, weekSessions] = await Promise.all([
    prisma.project.findMany({
      where: { status: { not: 'completed' } },
      orderBy: { lastWorkedAt: 'desc' },
      select: { id: true, name: true },
    }),
    prisma.session.findMany({
      where: { startTime: { gte: today } },
      include: { project: true },
      orderBy: { startTime: 'desc' },
      take: 20,
    }),
    prisma.session.findMany({
      where: { startTime: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ])

  const todayMinutes = todaySessions.reduce((s, se) => s + (se.duration ?? 0), 0)
  const streak = new Set(weekSessions.map(s => s.startTime.toDateString())).size

  // Serialise sessions for the client component (no Date objects)
  const sessionData = todaySessions.map(s => ({
    id: s.id,
    duration: s.duration,
    notes: s.notes,
    startTime: s.startTime,      // Next.js serialises Date → ISO string fine for RSC→client
    projectName: s.project?.name ?? 'Unknown',
  }))

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low">

      {/* ── Desktop top bar ── */}
      <header className="hidden md:flex sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 items-center justify-between px-6 lg:px-10 h-[68px] gap-4">
        <div className="flex items-center gap-5 min-w-0">
          <h1 className="text-lg font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</h1>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[17px]">search</span>
            <input className="bg-white border border-outline-variant/30 rounded-full pl-10 pr-5 py-2 w-52 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search…" type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[19px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      {/* Decorative blob */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/8 blur-[100px] rounded-full hidden md:block"></div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 relative z-10 max-w-screen-xl w-full mx-auto flex flex-col gap-6">

        {/* Page header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-1">Work Timer</h2>
          <p className="text-sm text-on-surface-variant">
            {(todayMinutes / 60).toFixed(1)}h logged today · {streak}-day streak this week
          </p>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today's Sessions", value: todaySessions.length },
            { label: 'Minutes Today',    value: todayMinutes },
            { label: 'Streak (days)',    value: streak },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-outline-variant/10 text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight">{s.value}</p>
              <p className="text-[9px] sm:text-[10px] text-on-surface-variant font-semibold mt-1 uppercase tracking-wider leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Timer widget (client) */}
        <TimerWidget
          projects={projects}
          initialSessions={sessionData}
          todayMinutes={todayMinutes}
          streak={streak}
        />
      </div>
    </div>
  )
}
