import { prisma } from '@/lib/prisma'
import NewProjectModal from '@/components/NewProjectModal'
import ImportCSVModal from '@/components/ImportCSVModal'

export const dynamic = 'force-dynamic'

const palette = [
  { bg: 'bg-primary/10', text: 'text-primary', icon: 'hub' },
  { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: 'article' },
  { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'monitoring' },
]

const statusColor: Record<string, string> = {
  active:      'bg-primary/10 text-primary',
  completed:   'bg-secondary/15 text-secondary',
  in_progress: 'bg-primary/10 text-primary',
  paused:      'bg-outline/10 text-outline',
}

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: true, sessions: true },
  })

  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 5,
    include: { project: true },
  })

  const totalHoursThisWeek = (() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const mins = recentSessions
      .filter(s => s.startTime >= weekAgo)
      .reduce((sum, s) => sum + (s.duration ?? 0), 0)
    return Math.round((mins / 60) * 10) / 10
  })()

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low">

      {/* ── Desktop top bar ── */}
      <header className="hidden md:flex sticky top-0 z-30 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 items-center justify-between px-6 lg:px-10 h-[68px] gap-4">
        <div className="flex items-center gap-5 min-w-0">
          <span className="text-lg font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</span>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[17px]">search</span>
            <input className="bg-white border border-outline-variant/30 rounded-full pl-10 pr-5 py-2 w-56 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Search projects…" type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[19px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-screen-xl w-full mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-on-surface mb-1.5">Project Registry</h2>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              {projects.length} active venture{projects.length !== 1 ? 's' : ''} · {totalHoursThisWeek}h logged this week
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ImportCSVModal />
            <NewProjectModal />
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-7">
          {[
            { label: 'Projects', value: projects.length },
            { label: 'Total Tasks', value: projects.reduce((s, p) => s + p.tasks.length, 0) },
            { label: 'Sessions', value: recentSessions.length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 border border-outline-variant/10 text-center">
              <p className="text-xl sm:text-3xl font-extrabold text-on-surface tracking-tight">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-on-surface-variant font-semibold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {projects.map((project, idx) => {
            const theme = palette[idx % palette.length]
            const done = project.tasks.filter(t => t.status === 'done').length
            const total = project.tasks.length
            const progress = total > 0 ? Math.round((done / total) * 100) : project.status === 'completed' ? 100 : 0
            return (
              <div key={project.id} className="group bg-white rounded-2xl p-5 sm:p-6 border border-outline-variant/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${theme.bg} flex items-center justify-center ${theme.text} shrink-0`}>
                    <span className="material-symbols-outlined text-[19px] sm:text-[21px]">{theme.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColor[project.status] ?? 'bg-outline/10 text-outline'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface mb-1 tracking-tight truncate">{project.name}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mb-5 line-clamp-2 leading-relaxed flex-1">
                  {project.description || 'No description provided.'}
                </p>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-on-surface-variant">{done}/{total} tasks done</span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="mt-4 pt-4 flex justify-between items-center border-t border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {project.sessions.length} session{project.sessions.length !== 1 ? 's' : ''}
                    </span>
                    <button className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Open <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add card */}
          <div className="border-2 border-dashed border-outline-variant/25 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-primary/25 transition-all min-h-[180px]">
            <div className="w-10 h-10 rounded-full bg-surface-container text-outline flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Start New Venture</p>
            <p className="text-xs text-outline mt-1">Initialize a fresh project</p>
          </div>
        </div>

        {/* Activity log */}
        <section className="mt-8">
          <h3 className="text-base sm:text-lg font-bold text-on-surface mb-4">Recent Activity</h3>
          {recentSessions.length > 0 ? (
            <div className="bg-white rounded-2xl border border-outline-variant/10 divide-y divide-outline-variant/10">
              {recentSessions.map((s, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-container/30 transition-colors">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {s.project?.name ?? 'Unknown'} — {s.duration ?? '?'}min session
                    </p>
                    {s.notes && <p className="text-xs text-on-surface-variant mt-0.5 truncate">{s.notes}</p>}
                  </div>
                  <span className="text-xs text-on-surface-variant shrink-0">
                    {s.startTime.toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant/10 p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-outline-variant">history</span>
              <p className="text-sm text-on-surface-variant mt-2">No sessions logged yet. Use the Timer to track your work.</p>
            </div>
          )}
        </section>
      </div>

      <button className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-[24px]">bolt</span>
      </button>
    </div>
  )
}
