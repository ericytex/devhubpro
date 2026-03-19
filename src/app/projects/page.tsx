import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tasks: true, sessions: true }
  })

  // Dummy activity logs since there is no project deployment tracking yet
  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 4,
    include: { project: true }
  })

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface-container-low max-w-full relative">
      <header className="sticky top-0 z-30 w-full bg-surface-container-low/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-10 h-24 border-b border-outline-variant/5">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-primary font-headline hidden sm:block">FounderEngine</span>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="bg-white border border-outline-variant/20 shadow-sm rounded-full pl-11 pr-6 py-2.5 w-80 focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="Search projects..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all bg-white rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all bg-white rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
          </div>
          <div className="h-10 w-10 bg-primary/20 text-primary font-bold flex items-center justify-center rounded-full ml-2 shadow-inner border border-primary/10">
            AR
          </div>
        </div>
      </header>

      <div className="p-6 md:p-10 lg:p-14 max-w-[1400px] w-full">
        <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4 font-headline">Project Registry</h2>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed font-medium">
              Manage and monitor your active ventures. High-level architecture for the modern solo founder.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 rounded-xl bg-white text-on-surface font-semibold hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/20">
              Archive
            </button>
            <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">add</span>
              Create New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => {
            // cycle through colors based on id or index
            const themeClasses = [
              { bg: 'bg-primary/10', text: 'text-primary', icon: 'hub' },
              { bg: 'bg-tertiary/10', text: 'text-tertiary', icon: 'article' },
              { bg: 'bg-secondary/10', text: 'text-secondary', icon: 'monitoring' },
            ]
            const theme = themeClasses[idx % themeClasses.length]
            const progress = project.status === 'completed' ? 100 : project.status === 'in_progress' ? 65 : 20

            return (
              <div key={project.id} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-outline-variant/10">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-14 h-14 rounded-2xl ${theme.bg} flex items-center justify-center ${theme.text}`}>
                    <span className="material-symbols-outlined text-3xl">{theme.icon}</span>
                  </div>
                  <span className={`px-3 py-1 ${project.status === 'completed' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'} text-xs font-bold rounded-full uppercase`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">{project.name}</h3>
                <p className="text-on-surface-variant text-sm mb-8 line-clamp-2 font-medium">{project.description || 'No description provided.'}</p>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="text-on-surface">Development Progress</span>
                      <span className="text-secondary">{progress}%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <div className="pt-6 flex justify-between items-center border-t border-outline-variant/10">
                    <div className="text-sm font-bold text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">task_alt</span> {project.tasks.length}
                    </div>
                    <button className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Open Dashboard <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="border-4 border-dashed border-outline-variant/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-primary/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
              <span className="material-symbols-outlined text-4xl">add_circle</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface-variant group-hover:text-primary transition-colors font-headline">Start New Venture</h3>
            <p className="text-outline text-sm mt-2 font-medium">Initialize a fresh repository</p>
          </div>
        </div>

        <section className="mt-20">
          <h3 className="text-2xl font-bold text-on-surface mb-8 font-headline">Registry Activity</h3>
          <div className="bg-white rounded-2xl overflow-x-auto shadow-sm border border-outline-variant/10">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-surface-container/50 text-on-surface-variant text-sm font-semibold">
                <tr>
                  <th className="px-8 py-5">Action</th>
                  <th className="px-8 py-5">Project</th>
                  <th className="px-8 py-5">Initiator</th>
                  <th className="px-8 py-5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentSessions.length > 0 ? recentSessions.map((session, i) => (
                   <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-tertiary'}`}></span>
                      <span className="font-bold text-on-surface text-sm">Session Clocked ({session.duration}m)</span>
                    </td>
                    <td className="px-8 py-5 text-on-surface font-semibold text-sm">{session.project?.name || 'Unknown Project'}</td>
                    <td className="px-8 py-5 text-on-surface-variant text-sm font-medium">Alex Rivera</td>
                    <td className="px-8 py-5 text-right text-on-surface-variant text-xs font-semibold">{session.startTime.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                )) : (
                  <tr className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-8 py-5 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="font-bold text-on-surface text-sm">System Deployed</span>
                    </td>
                    <td className="px-8 py-5 text-on-surface font-semibold text-sm">FounderEngine</td>
                    <td className="px-8 py-5 text-on-surface-variant text-sm font-medium">System</td>
                    <td className="px-8 py-5 text-right text-on-surface-variant text-xs font-semibold">Just now</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">bolt</span>
      </button>
    </div>
  )
}
