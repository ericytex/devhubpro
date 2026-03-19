import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: true, sessions: true },
  })

  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 4,
    include: { project: true },
  })

  const palette = [
    { bg: 'bg-primary/10', text: 'text-primary', icon: 'hub' },
    { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: 'article' },
    { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'monitoring' },
  ]

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 lg:px-10 h-[72px] gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <span className="text-xl font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</span>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input className="bg-white border border-outline-variant/30 rounded-full pl-10 pr-5 py-2 w-60 focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="Search projects…" type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">
            AR
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 px-6 lg:px-10 py-10 max-w-screen-xl w-full mx-auto">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Project Registry</h2>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              Manage your active ventures. High-level architecture for the modern solo founder.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-5 py-2.5 rounded-xl bg-white text-sm text-on-surface font-semibold hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/20">
              Archive
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">add</span> Create New
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, idx) => {
            const theme = palette[idx % palette.length]
            const progress = project.status === 'completed' ? 100 : project.status === 'in_progress' ? 65 : 20
            return (
              <div key={project.id} className="group bg-white rounded-2xl p-7 border border-outline-variant/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center ${theme.text}`}>
                    <span className="material-symbols-outlined text-[22px]">{theme.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${project.status === 'completed' ? 'bg-secondary/15 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-on-surface mb-1.5 tracking-tight">{project.name}</h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed flex-1">
                  {project.description || 'No description provided.'}
                </p>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="mt-5 pt-4 flex justify-between items-center border-t border-outline-variant/10">
                    <span className="text-xs text-on-surface-variant flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>{project.tasks.length} tasks
                    </span>
                    <button className="text-xs text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Add card */}
          <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-7 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-primary/20 transition-all min-h-[220px]">
            <div className="w-12 h-12 rounded-full bg-surface-container text-outline flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-[22px]">add</span>
            </div>
            <p className="text-sm font-semibold text-on-surface-variant group-hover:text-primary transition-colors">Start New Venture</p>
            <p className="text-xs text-outline mt-1">Initialize a fresh project</p>
          </div>
        </div>

        {/* Registry activity table */}
        <section className="mt-12">
          <h3 className="text-lg font-bold text-on-surface mb-5">Registry Activity</h3>
          <div className="bg-white rounded-2xl border border-outline-variant/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container/50 text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Initiator</th>
                    <th className="px-6 py-4 text-right">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {recentSessions.length > 0 ? recentSessions.map((s, i) => (
                    <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                        Session ({s.duration ?? '?'}m)
                      </td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{s.project?.name ?? '—'}</td>
                      <td className="px-6 py-4 text-on-surface-variant">Alex Rivera</td>
                      <td className="px-6 py-4 text-right text-on-surface-variant text-xs">{s.startTime.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td className="px-6 py-8 text-center text-on-surface-variant text-sm" colSpan={4}>No activity logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[26px]">bolt</span>
      </button>
    </div>
  )
}
