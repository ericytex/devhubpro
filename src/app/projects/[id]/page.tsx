import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const statusColor: Record<string, string> = {
  active:      'bg-primary/10 text-primary',
  completed:   'bg-secondary/15 text-secondary',
  in_progress: 'bg-primary/10 text-primary',
  paused:      'bg-outline/10 text-outline',
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: { createdAt: 'desc' } },
      sessions: { orderBy: { startTime: 'desc' } },
    },
  })

  if (!project) notFound()

  const doneTasks = project.tasks.filter(t => t.status === 'done').length
  const totalTasks = project.tasks.length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : project.status === 'completed' ? 100 : 0

  const totalMinutesLog = project.sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
  const totalHours = Math.round((totalMinutesLog / 60) * 10) / 10

  return (
    <div className="flex flex-col flex-1 bg-surface-container-low min-h-screen">
      
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 items-center px-4 sm:px-6 lg:px-10 h-[68px] flex gap-4">
        <Link href="/projects" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <span className="text-sm font-semibold text-on-surface-variant">Back to Registry</span>
      </header>

      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-screen-xl w-full mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-outline-variant/10 shadow-sm relative overflow-hidden">
          {/* subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${statusColor[project.status] ?? 'bg-outline/10 text-outline'}`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant px-3 py-1.5 rounded-full bg-surface-container">
                  Stage: {project.stage}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                {project.name}
              </h1>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                {project.description || 'No detailed description provided.'}
              </p>
            </div>
            
            <div className="flex flex-col gap-3 shrink-0 sm:min-w-[200px]">
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Time Invested</p>
                <p className="text-2xl font-extrabold text-on-surface">{totalHours} <span className="text-sm text-on-surface-variant font-medium">hrs</span></p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-4 border border-outline-variant/10">
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-1">Task Completion</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-extrabold text-on-surface">{progress}%</p>
                  <p className="text-sm text-on-surface-variant font-medium mb-1">({doneTasks}/{totalTasks})</p>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex-1 mt-2">
                  <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Tasks */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">Tasks & Roadmap</h2>
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">add</span> Add Task
              </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-outline-variant/10 divide-y divide-outline-variant/10">
              {project.tasks.length > 0 ? project.tasks.map((task) => (
                <div key={task.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-surface-container-low/50 transition-colors">
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${task.status === 'done' ? 'bg-secondary border-secondary text-white' : 'border-outline-variant text-transparent hover:border-secondary'}`}>
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm sm:text-base font-semibold ${task.status === 'done' ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                      {task.title}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                        {task.urgency} priority
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-2">checklist</span>
                  <p className="text-sm font-semibold">No tasks defined yet.</p>
                  <p className="text-xs mt-1">Break this project down into actionable steps.</p>
                </div>
              )}
            </div>
          </div>

          {/* Side Column: Session History */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-on-surface">Time Logs</h2>
            
            <div className="bg-white rounded-2xl border border-outline-variant/10 divide-y divide-outline-variant/10 overflow-hidden">
              {project.sessions.length > 0 ? project.sessions.map((session) => (
                <div key={session.id} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {session.startTime.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {session.duration} min
                    </span>
                  </div>
                  {session.notes ? (
                    <p className="text-sm text-on-surface leading-relaxed">{session.notes}</p>
                  ) : (
                    <p className="text-sm text-outline italic">No notes recorded.</p>
                  )}
                </div>
              )) : (
                <div className="p-6 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl mb-2">history_toggle_off</span>
                  <p className="text-sm">No recorded sessions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
