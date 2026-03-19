import { prisma } from '@/lib/prisma'
import LogSessionModal from '@/components/LogSessionModal'

export const dynamic = 'force-dynamic'

export default async function TimerPage() {
  const projects = await prisma.project.findMany({
    where: { status: { not: 'completed' } },
    orderBy: { lastWorkedAt: 'desc' },
    select: { id: true, name: true },
  })

  const todaySessions = await prisma.session.findMany({
    where: { startTime: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    include: { project: true },
    orderBy: { startTime: 'desc' },
  })

  const todayMinutes = todaySessions.reduce((s, sess) => s + (sess.duration ?? 0), 0)
  const todayHours = (todayMinutes / 60).toFixed(1)

  // Week streak calculation
  const weekSessions = await prisma.session.findMany({
    where: { startTime: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    orderBy: { startTime: 'desc' },
  })
  const daysWithSessions = new Set(weekSessions.map(s => s.startTime.toDateString())).size

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low relative overflow-hidden">

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

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-full bg-gradient-to-l from-primary/5 to-transparent hidden md:block"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/8 blur-[80px] rounded-full"></div>
      </div>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 relative z-10 max-w-screen-xl w-full mx-auto flex flex-col">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-1">Work Timer</h2>
            <p className="text-sm text-on-surface-variant">
              {todayHours}h logged today · {daysWithSessions}-day streak
            </p>
          </div>
          <LogSessionModal projects={projects} />
        </div>

        {/* Today's stats strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7">
          {[
            { label: "Today's Sessions", value: todaySessions.length },
            { label: 'Minutes Today', value: todayMinutes },
            { label: 'Streak (days)', value: daysWithSessions },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-outline-variant/10 text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold mt-1 uppercase tracking-wider leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Central timer + insights */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Timer circle */}
          <div className="flex flex-col items-center w-full lg:w-auto lg:flex-1">
            <div className="relative">
              <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px] rounded-full border-[10px] border-surface-container flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    className="text-secondary"
                    cx="50%" cy="50%" fill="transparent" r="46%"
                    stroke="currentColor" strokeDasharray="1200" strokeDashoffset="400"
                    strokeLinecap="round" strokeWidth="10"
                  />
                </svg>
                <div className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[330px] lg:h-[330px] rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-outline-variant/10">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Elapsed Time</p>
                  <div className="flex items-baseline">
                    <span className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-on-background tracking-tight tabular-nums">00</span>
                    <span className="text-3xl sm:text-5xl font-bold text-primary mx-1">:</span>
                    <span className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-on-background tracking-tight tabular-nums">00</span>
                  </div>
                  <div className="mt-4 flex gap-6 items-center">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Goal</p>
                      <p className="text-sm sm:text-base font-bold text-on-surface tabular-nums">45:00</p>
                    </div>
                    <div className="w-px h-7 bg-outline-variant/30"></div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Streak</p>
                      <p className="text-sm sm:text-base font-bold text-primary">{daysWithSessions}d 🔥</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Controls */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button className="w-12 h-12 bg-white border border-outline-variant/20 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px] text-on-surface">pause</span>
                </button>
                <button className="h-12 px-6 bg-primary text-white rounded-full shadow-lg shadow-primary/25 text-sm font-semibold flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                  Stop
                </button>
                <button className="w-12 h-12 bg-white border border-outline-variant/20 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container transition-all active:scale-95">
                  <span className="material-symbols-outlined text-[20px] text-on-surface">skip_next</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant mt-10 text-center">Use &quot;Log Session&quot; above to record your work</p>
          </div>

          {/* Right: Today's sessions log */}
          <div className="w-full lg:w-80 xl:w-96 mt-6 lg:mt-0">
            <h3 className="text-sm font-bold text-on-surface mb-3">Today's Sessions</h3>
            {todaySessions.length > 0 ? (
              <div className="space-y-3">
                {todaySessions.map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-outline-variant/10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">timer</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{s.project?.name}</p>
                      <p className="text-xs text-on-surface-variant">{s.duration}min · {s.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      {s.notes && <p className="text-xs text-on-surface-variant mt-0.5 truncate italic">{s.notes}</p>}
                    </div>
                    <span className="text-sm font-bold text-secondary shrink-0">{s.duration}m</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 text-center">
                <span className="material-symbols-outlined text-3xl text-outline-variant">timer_off</span>
                <p className="text-sm text-on-surface-variant mt-2">No sessions yet today.</p>
                <p className="text-xs text-outline mt-1">Tap &quot;Log Session&quot; to get started.</p>
              </div>
            )}

            {/* Insight card */}
            <div className="mt-4 bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                <p className="text-xs font-bold uppercase tracking-widest">Focus Insight</p>
              </div>
              <p className="text-sm text-white/85 leading-relaxed relative">
                You peak between <strong className="text-white">9–11:30 AM</strong>. Schedule your hardest tasks in this window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
