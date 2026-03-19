import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [allProjects, allSessions, weekSessions] = await Promise.all([
    prisma.project.findMany({ include: { tasks: true, sessions: true } }),
    prisma.session.findMany({ orderBy: { startTime: 'desc' }, take: 100 }),
    prisma.session.findMany({ where: { startTime: { gte: weekAgo } }, orderBy: { startTime: 'asc' } }),
  ])

  const totalMinsAllTime = allSessions.reduce((s, se) => s + (se.duration ?? 0), 0)
  const totalHours = (totalMinsAllTime / 60).toFixed(1)
  const completedProjects = allProjects.filter(p => p.status === 'completed').length
  const daysWithSessions = new Set(weekSessions.map(s => s.startTime.toDateString())).size

  // Avg session duration (mins)
  const avgDuration = allSessions.length > 0
    ? Math.round(allSessions.reduce((s, se) => s + (se.duration ?? 0), 0) / allSessions.length)
    : 0

  // Build per-day totals for this week (Mon–Sun)
  const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayTotals = Array(7).fill(0)
  weekSessions.forEach(s => { dayTotals[s.startTime.getDay()] += s.duration ?? 0 })
  const maxDay = Math.max(...dayTotals, 1)
  // Reorder Mon→Sun
  const orderedDays = [1,2,3,4,5,6,0].map(d => ({ label: dayKeys[d], pct: Math.round((dayTotals[d] / maxDay) * 100), mins: dayTotals[d] }))

  // Per-project hour allocation
  const projectHours = allProjects
    .map(p => ({ name: p.name, mins: p.sessions.reduce((s, se) => s + (se.duration ?? 0), 0) }))
    .filter(p => p.mins > 0)
    .sort((a, b) => b.mins - a.mins)
    .slice(0, 4)
  const maxProjMins = Math.max(...projectHours.map(p => p.mins), 1)
  const projColors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-outline']

  // Week-over-week momentum
  const prevWeekAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
  const prevWeekSessions = await prisma.session.findMany({
    where: { startTime: { gte: prevWeekAgo, lt: weekAgo } },
  })
  const weekMins = weekSessions.reduce((s, se) => s + (se.duration ?? 0), 0)
  const prevWeekMins = prevWeekSessions.reduce((s, se) => s + (se.duration ?? 0), 0)
  const wowPct = prevWeekMins > 0 ? Math.round(((weekMins - prevWeekMins) / prevWeekMins) * 100) : 0
  const weekHours = (weekMins / 60).toFixed(1)

  return (
    <div className="flex flex-col flex-1 bg-background">

      {/* ── Desktop top bar ── */}
      <header className="hidden md:flex sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 items-center justify-between px-6 lg:px-10 h-[68px] gap-4">
        <h1 className="text-lg font-extrabold tracking-tight text-on-surface font-headline">Performance Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:flex items-center bg-surface-container-low border border-outline-variant/10 rounded-full px-4 py-2 w-52 gap-2">
            <span className="material-symbols-outlined text-outline text-[17px]">search</span>
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Search insights…" type="text"/>
          </div>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[19px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-screen-xl w-full mx-auto space-y-6 sm:space-y-8">

        {/* Page header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface mb-1">Analytics</h2>
          <p className="text-sm text-on-surface-variant">Your productivity insights for the last 7 days</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Total Deep Work', value: `${totalHours}h`, badge: weekMins > prevWeekMins ? `+${wowPct}%` : `${wowPct}%`, bColor: weekMins >= prevWeekMins ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error' },
            { label: 'This Week', value: `${weekHours}h`, sub: `${daysWithSessions} active days`, sColor: 'text-on-surface-variant' },
            { label: 'Projects Active', value: allProjects.length - completedProjects, badge: `${completedProjects} done`, bColor: 'bg-secondary/10 text-secondary' },
            { label: 'Avg Session', value: `${avgDuration}m`, sub: `across ${allSessions.length} sessions`, sColor: 'text-on-surface-variant' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 border border-outline-variant/10 hover:shadow-md transition-all hover:-translate-y-px">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 sm:mb-3">{s.label}</p>
              <div className="flex items-end flex-wrap gap-2">
                <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-on-surface">{s.value}</span>
                {'badge' in s && s.badge && <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-lg ${s.bColor}`}>{s.badge}</span>}
                {'sub' in s && s.sub && <span className={`text-[10px] sm:text-xs font-medium pb-0.5 ${s.sColor}`}>{s.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

          {/* Bar chart */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-5 sm:p-8 border border-outline-variant/10 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <h2 className="text-base sm:text-xl font-bold text-on-surface tracking-tight">Weekly Focus Hours</h2>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">Minutes per day this week</p>
              </div>
              <span className="px-3 py-1.5 bg-white border border-outline-variant/20 rounded-full text-xs font-semibold text-on-surface self-start">Last 7 days</span>
            </div>
            <div className="flex items-end justify-between gap-1 sm:gap-3 h-40 sm:h-56">
              {orderedDays.map((d) => (
                <div key={d.label} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 group h-full justify-end relative">
                  {d.mins > 0 && (
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-on-surface text-white text-[10px] font-bold px-2 py-1 rounded-lg transition-all whitespace-nowrap z-10">
                      {d.mins}m
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-lg transition-all cursor-pointer ${d.pct > 80 ? 'bg-primary shadow-[0_0_14px_rgba(53,37,205,0.3)]' : d.pct > 0 ? 'bg-primary/25 hover:bg-primary/50' : 'bg-surface-container'}`}
                    style={{ height: `${Math.max(d.pct, 4)}%` }}
                  ></div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-on-surface-variant group-hover:text-primary transition-colors">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project allocation */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-8 border border-outline-variant/10 flex flex-col">
            <h2 className="text-base sm:text-lg font-bold text-on-surface tracking-tight mb-5 sm:mb-7">Project Time</h2>
            {projectHours.length > 0 ? (
              <div className="space-y-5 sm:space-y-6 flex-1">
                {projectHours.map((p, i) => (
                  <div key={p.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-on-surface truncate mr-2">{p.name}</span>
                      <span className="text-on-surface-variant shrink-0">{Math.round(p.mins / 60 * 10) / 10}h</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${projColors[i]} rounded-full`} style={{ width: `${Math.round((p.mins / maxProjMins) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-3xl text-outline-variant mb-2">bar_chart</span>
                <p className="text-sm text-on-surface-variant">Log sessions to see project allocation</p>
              </div>
            )}
            <button className="mt-6 w-full py-2.5 text-sm text-primary font-semibold bg-primary/5 hover:bg-primary/10 rounded-xl transition-all">
              Detailed Report
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

          {/* Momentum */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-on-surface tracking-tight">Productivity Momentum</h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${wowPct >= 0 ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                {wowPct >= 0 ? `+${wowPct}%` : `${wowPct}%`} WoW
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              You logged <strong className="text-on-surface font-semibold">{weekHours}h</strong> this week across <strong className="text-on-surface font-semibold">{daysWithSessions} days</strong>.
              {wowPct > 0
                ? ` That's ${wowPct}% more than last week. Keep it up!`
                : wowPct < 0
                ? ` That's ${Math.abs(wowPct)}% less than last week. Push a bit harder!`
                : ' Same pace as last week.'}
            </p>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                <span>Weekly Goal</span>
                <span className="text-secondary">{Math.min(100, Math.round((weekMins / (40 * 60)) * 100))}% of 40h</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-secondary-fixed rounded-full shadow-[0_0_10px_rgba(0,108,73,0.25)] transition-all"
                  style={{ width: `${Math.min(100, Math.round((weekMins / (40 * 60)) * 100))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Insight card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-primary to-primary-container rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight">Zone of Genius</h3>
                <p className="text-sm text-indigo-100/80 leading-relaxed">
                  {allSessions.length > 0
                    ? `You've logged ${allSessions.length} sessions totaling ${totalHours}h. Schedule your most complex work between 9–11:30 AM for peak output.`
                    : 'Start logging sessions to see your personal focus patterns and optimize your schedule.'}
                </p>
              </div>
              <button className="mt-6 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all self-start shadow">
                Optimize Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
