import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { lastWorkedAt: 'desc' },
    include: { tasks: true, sessions: true },
  })

  const tasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, project: p })))
  const urgentTasks = tasks.filter(t => t.urgency === 'high' || t.urgency === 'critical').slice(0, 3)

  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 3,
    include: { project: true },
  })

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low">

      {/* ── Desktop-only top bar ── */}
      <header className="hidden md:flex sticky top-0 z-40 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 items-center justify-between px-6 lg:px-10 h-[68px] gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-lg font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</span>
          <div className="flex items-center gap-5">
            <a className="text-sm font-semibold text-primary border-b-2 border-primary pb-0.5" href="#">Dashboard</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Team</a>
            <a className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors" href="#">Market</a>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden xl:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input className="bg-white border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-52 outline-none transition-all" placeholder="Search…" type="text"/>
          </div>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-screen-xl w-full mx-auto">

        {/* Greeting */}
        <section className="mb-7 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-background mb-2">
            Good morning, Alex.
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-md leading-relaxed">
            You've completed <span className="text-secondary font-semibold">85%</span> of your weekly goals. Let's finish the sprint strong today.
          </p>
        </section>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">

          {/* Urgent tasks */}
          <div className="lg:col-span-8 bg-surface-container rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-9">
            <div className="flex items-center justify-between mb-5 sm:mb-7">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Urgent Tasks</h3>
              <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-wide rounded-full uppercase">
                {urgentTasks.length} Overdue
              </span>
            </div>
            <div className="space-y-3">
              {urgentTasks.length > 0 ? urgentTasks.map((t, i) => (
                <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:shadow-md hover:-translate-y-px transition-all cursor-pointer border border-outline-variant/10">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex shrink-0 items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[17px]">
                        {t.urgency === 'critical' ? 'campaign' : 'code'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-on-surface truncate">{t.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t.project?.name} · {t.urgency}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px] shrink-0 ml-3">chevron_right</span>
                </div>
              )) : (
                <>
                  {/* Default static tasks shown when DB is empty */}
                  {[
                    { icon: 'campaign', title: 'Finalize Q4 Investor Pitch', sub: 'Due in 2 hours · High Priority' },
                    { icon: 'code', title: 'Bug Scrub: Payment API', sub: 'Assigned to: Engineering Team' },
                    { icon: 'group', title: 'Hiring: Lead Product Designer', sub: '3 new applicants to review' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:shadow-md hover:-translate-y-px transition-all cursor-pointer border border-outline-variant/10">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex shrink-0 items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-[17px]">{item.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-on-surface truncate">{item.title}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-[20px] shrink-0 ml-3">chevron_right</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
            {/* Zen alert */}
            <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative flex items-center gap-2.5 mb-3">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="text-sm font-bold">Project Zen Alert</h3>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-5 relative">
                Performance is peaking. Optimal time for Deep Work on your architecture roadmap.
              </p>
              <button className="relative w-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold py-2.5 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow">
                Enter Solo Focus Mode
              </button>
            </div>

            {/* Momentum */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-outline-variant/10">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Momentum</p>
              <div className="flex items-end justify-between mb-3 gap-2 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight">85%</span>
                <span className="text-[10px] font-semibold text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>+12% this week
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[85%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity timeline */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-10 mt-5 sm:mt-6 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h3 className="text-base sm:text-xl font-bold text-on-surface">Activity Timeline</h3>
            <button className="text-xs sm:text-sm text-primary font-semibold flex items-center gap-1 hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all shrink-0">
              View all <span className="material-symbols-outlined text-[14px] sm:text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-6">
            {recentSessions.length > 0 ? recentSessions.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[14px] sm:text-[16px]">history_edu</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <p className="font-semibold text-sm text-on-surface">Worked on {s.project?.name}</p>
                    <span className="text-[10px] text-on-surface-variant shrink-0">{s.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{s.duration}min deep work session logged.</p>
                </div>
              </div>
            )) : (
              <>
                {[
                  { icon: 'history_edu', title: 'New Version Deployed', sub: 'V2.4.0 successfully pushed to production. All health checks passed.', time: '9:41 AM' },
                  { icon: 'payments', title: 'Revenue Milestone Reached', sub: 'MRR crossed the $50k threshold. Shareholder notification sent.', time: 'Yesterday' },
                  { icon: 'chat_bubble_outline', title: 'Strategic Review Scheduled', sub: 'Board meeting with Seed Series investors confirmed for next Tuesday.', time: '2 days ago' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                      <span className="material-symbols-outlined text-primary text-[14px] sm:text-[16px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                        <p className="font-semibold text-sm text-on-surface">{item.title}</p>
                        <span className="text-[10px] text-on-surface-variant shrink-0">{item.time}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAB — hidden on mobile (use bottom bar) */}
      <button className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
        <span className="material-symbols-outlined text-[24px] group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  )
}
