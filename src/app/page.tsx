import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { lastWorkedAt: 'desc' },
    include: { tasks: true, sessions: true }
  })

  // Urgent tasks
  const tasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, project: p })))
  const urgentTasks = tasks.filter(t => t.urgency === 'high' || t.urgency === 'critical').slice(0, 3)

  // Recent Activity
  const recentSessions = await prisma.session.findMany({
    orderBy: { startTime: 'desc' },
    take: 3,
    include: { project: true }
  })

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface-container-low max-w-full relative">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full bg-surface-container-low/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-10 h-24 border-b border-outline-variant/5 text-center">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold tracking-tighter text-primary font-headline hidden sm:block">FounderEngine</span>
          <div className="flex items-center gap-6">
            <a className="text-primary font-bold border-b-2 border-primary py-1 transition-colors font-headline" href="#">Dashboard</a>
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-headline" href="#">Team</a>
            <a className="text-on-surface-variant font-medium hover:text-primary transition-colors font-headline" href="#">Market</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input className="bg-white border border-outline-variant/20 shadow-sm rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 w-72 transition-all outline-none" placeholder="Quick Search..." type="text"/>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all bg-white rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all bg-white rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="h-10 w-10 bg-primary/20 text-primary font-bold flex items-center justify-center rounded-full ml-2 shadow-inner border border-primary/10">
              AR
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-6 md:p-10 lg:p-14 max-w-[1400px] w-full">
        {/* Greeting Hero Section */}
        <section className="mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tighter text-on-background mb-3">Good morning, Alex.</h2>
          <p className="text-on-surface-variant md:text-lg max-w-2xl font-medium">You've completed <span className="text-secondary font-bold">85%</span> of your weekly goals. Let's finish the sprint strong today.</p>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Urgent Tasks (Large Widget) */}
          <div className="col-span-1 lg:col-span-8 bg-surface-container p-6 lg:p-11 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold font-headline text-on-surface">Urgent Tasks</h3>
              <span className="px-4 py-1.5 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full">{urgentTasks.length} OVERDUE</span>
            </div>
            
            <div className="space-y-4">
              {urgentTasks.length > 0 ? urgentTasks.map((t, idx) => (
                <div key={idx} className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between group hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border border-outline-variant/5 gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex shrink-0 items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{t.urgency === 'critical' ? 'campaign' : 'code'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">{t.title}</h4>
                      <p className="text-sm text-on-surface-variant font-medium">{t.project?.name} • {t.urgency} Priority</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors hidden sm:block">chevron_right</span>
                </div>
              )) : (
                <div className="text-center py-8">
                   <span className="material-symbols-outlined text-4xl text-outline mb-2">hotel_class</span>
                   <p className="text-on-surface-variant font-medium">No urgent tasks right now. You're doing great!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Stack */}
          <div className="col-span-1 lg:col-span-4 space-y-8">
            
            {/* Project Zen Alert */}
            <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-[2.5rem] text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full blur-[20px]"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <h3 className="text-xl font-bold font-headline">Project Zen Alert</h3>
              </div>
              <p className="text-primary-fixed leading-relaxed mb-8 font-medium relative z-10">System performance is peaking. This is the optimal time for "Deep Work" on your architecture roadmap.</p>
              <button className="w-full bg-secondary-fixed text-on-secondary-fixed font-bold py-4 rounded-full hover:scale-[1.02] active:scale-95 transition-all shadow-lg relative z-10">
                Enter Solo Focus Mode
              </button>
            </div>
            
            {/* Growth Momentum Widget */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10 flex flex-col">
              <h4 className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-6">Momentum</h4>
              <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
                <span className="text-4xl font-black font-headline text-on-surface tracking-tighter">85%</span>
                <span className="shrink-0 text-xs font-bold text-secondary flex items-center gap-1 bg-secondary-container/30 px-2 py-1 rounded-full whitespace-nowrap truncate max-w-full">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  +12% vs last week
                </span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden shrink-0 mt-auto">
                <div className="h-full bg-secondary w-[85%] rounded-full shadow-[0_0_12px_rgba(0,108,73,0.3)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline (Full Width Editorial) */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 lg:p-14 mt-12 shadow-sm border border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <h3 className="text-3xl font-bold font-headline tracking-tighter text-on-surface">Activity Timeline</h3>
            <button className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-full transition-all">
              View Historical Logs
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="relative pl-6">
            {/* Vertical line for timeline */}
            <div className="absolute left-[34px] top-4 bottom-4 w-0.5 bg-surface-container hidden sm:block"></div>
            
            <div className="space-y-12 relative z-10">
              {recentSessions.length > 0 ? recentSessions.map((session, i) => (
                 <div key={i} className="relative flex flex-col sm:flex-row gap-4 sm:gap-8 group">
                   <div className="hidden sm:flex w-12 h-12 rounded-full bg-surface-container shrink-0 items-center justify-center z-10 ring-[6px] ring-white">
                     <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                   </div>
                   <div className="flex-grow pb-2">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                       <h5 className="text-lg font-bold text-on-surface">Worked on {session.project?.name || 'Project'}</h5>
                       <span className="text-sm text-on-surface-variant font-medium">{session.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                     </div>
                     <p className="text-on-surface-variant max-w-3xl font-medium">Clocked in a deep work session for {session.duration} minutes successfully.</p>
                   </div>
                 </div>
              )) : (
                <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-8">
                   <div className="hidden sm:flex w-12 h-12 rounded-full bg-surface-container shrink-0 items-center justify-center z-10 ring-[6px] ring-white">
                     <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                   </div>
                   <div className="flex-grow pb-2">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                       <h5 className="text-lg font-bold text-on-surface">System Initialized</h5>
                       <span className="text-sm text-on-surface-variant font-medium">Just now</span>
                     </div>
                     <p className="text-on-surface-variant max-w-3xl font-medium">FounderEngine successfully booted. Tracking systems online and ready for metrics.</p>
                   </div>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contextual Floating Action Button */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-[32px] group-hover:rotate-90 transition-transform duration-300">add</span>
      </button>
    </div>
  )
}
