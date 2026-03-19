import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { lastWorkedAt: 'desc' },
    include: { tasks: true, sessions: true },
  })

  const tasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, project: p })))
  const urgentTasks = tasks
    .filter(t => t.urgency === 'high' || t.urgency === 'critical')
    .slice(0, 3)

  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 3,
    include: { project: true },
  })

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 lg:px-10 h-[72px] gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-xl font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</span>
          <div className="hidden lg:flex items-center gap-5">
            <a className="text-sm font-semibold text-primary border-b-2 border-primary pb-0.5 font-body" href="#">Dashboard</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors font-body" href="#">Team</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors font-body" href="#">Market</a>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden xl:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="bg-white border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-56 outline-none transition-all"
              placeholder="Search…"
              type="text"
            />
          </div>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">
            AR
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 px-6 lg:px-10 py-10 max-w-screen-xl w-full mx-auto">

        {/* Hero greeting */}
        <section className="mb-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-on-background mb-2">
            Good morning, Alex.
          </h2>
          <p className="text-base text-on-surface-variant max-w-xl leading-relaxed">
            You've completed <span className="text-secondary font-semibold">85%</span> of your weekly goals. Let's finish the sprint strong today.
          </p>
        </section>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Urgent tasks */}
          <div className="lg:col-span-8 bg-surface-container rounded-3xl p-6 lg:p-9">
            <div className="flex items-center justify-between mb-7">
              <h3 className="text-lg font-bold text-on-surface">Urgent Tasks</h3>
              <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[11px] font-bold tracking-wide rounded-full uppercase">
                {urgentTasks.length} Overdue
              </span>
            </div>

            <div className="space-y-3">
              {urgentTasks.length > 0 ? urgentTasks.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 flex items-center justify-between group hover:shadow-md hover:-translate-y-px transition-all cursor-pointer border border-outline-variant/10"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex shrink-0 items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {t.urgency === 'critical' ? 'campaign' : 'code'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-on-surface truncate">{t.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t.project?.name} · {t.urgency}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px] shrink-0 ml-4">chevron_right</span>
                </div>
              )) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-4xl text-outline-variant">hotel_class</span>
                  <p className="text-sm text-on-surface-variant mt-2 font-medium">No urgent tasks right now. You're crushing it!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-5">
            {/* Zen alert */}
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-7 text-white relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center gap-2.5 mb-4">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="text-base font-bold">Project Zen Alert</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed mb-6 relative">
                Performance is peaking. Optimal time for Deep Work on your architecture roadmap.
              </p>
              <button className="relative w-full bg-secondary-fixed text-on-secondary-fixed text-sm font-semibold py-3 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow">
                Enter Solo Focus Mode
              </button>
            </div>

            {/* Momentum */}
            <div className="bg-white rounded-3xl p-7 border border-outline-variant/10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Momentum</p>
              <div className="flex items-end justify-between mb-3 gap-2">
                <span className="text-4xl font-extrabold text-on-surface tracking-tight">85%</span>
                <span className="text-[11px] font-semibold text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+12% vs last week
                </span>
              </div>
              <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Activity timeline ── */}
        <div className="bg-white rounded-3xl p-6 lg:p-10 mt-8 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-8 gap-4">
            <h3 className="text-xl font-bold text-on-surface">Activity Timeline</h3>
            <button className="text-sm text-primary font-semibold flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all">
              View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="relative pl-5">
            <div className="absolute left-[30px] top-2 bottom-2 w-px bg-surface-container hidden sm:block"></div>
            <div className="space-y-8 relative">
              {recentSessions.length > 0 ? recentSessions.map((s, i) => (
                <div key={i} className="flex gap-6">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary/10 shrink-0 items-center justify-center z-10 ring-4 ring-white">
                    <span className="material-symbols-outlined text-primary text-[16px]">history_edu</span>
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
                      <p className="font-semibold text-sm text-on-surface">Worked on {s.project?.name}</p>
                      <span className="text-xs text-on-surface-variant shrink-0">{s.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{s.duration}min deep work session logged.</p>
                  </div>
                </div>
              )) : (
                <div className="flex gap-6">
                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary/10 shrink-0 items-center justify-center z-10 ring-4 ring-white">
                    <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                  </div>
                  <div className="flex-1 pb-1">
                    <p className="font-semibold text-sm text-on-surface">System initialized</p>
                    <p className="text-sm text-on-surface-variant mt-1">FounderEngine is online. Start logging sessions to see activity here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-[26px] group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  )
}
