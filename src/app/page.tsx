import { prisma } from '@/lib/prisma'
import { createProject, logSession } from './actions'
import { PlusCircle, Clock, CheckCircle2, AlertOctagon, Activity, Hash, Zap } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const projects = await prisma.project.findMany({
    orderBy: { lastWorkedAt: 'desc' },
    include: { tasks: true, sessions: true }
  })
  
  const totalProjects = projects.length
  
  // Calculate today's duration
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const sessionsToday = await prisma.session.findMany({
    where: { startTime: { gte: startOfToday } }
  })
  const hoursToday = (sessionsToday.reduce((acc, s) => acc + (s.duration || 0), 0) / 60).toFixed(1)

  // Identify neglected projects (>7 days)
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const neglectedCount = projects.filter(p => !p.lastWorkedAt || p.lastWorkedAt < oneWeekAgo).length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Command Center
            </h1>
            <p className="text-slate-400 mt-2 font-medium">SaaS Operations & Tracking Matrix</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-emerald-400">System Online</span>
            </div>
          </div>
        </header>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Active Projects" value={totalProjects.toString()} icon={<Hash className="w-5 h-5 text-indigo-400" />} />
          <MetricCard title="Hours Today" value={hoursToday} icon={<Clock className="w-5 h-5 text-blue-400" />} />
          <MetricCard title="Neglected Projects" value={neglectedCount.toString()} icon={<AlertOctagon className="w-5 h-5 text-red-400" />} />
          <MetricCard title="Active Tasks" value={projects.reduce((acc, p) => acc + p.tasks.length, 0).toString()} icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} />
        </div>

        {/* Main Grid Floor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Project Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-purple-400"/> Active Operations</h2>
            </div>
            
            {projects.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/50 backdrop-blur-sm">
                <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300">No Projects Found</h3>
                <p className="text-slate-500 mb-6">Initialize a new SaaS operation on the right panel.</p>
              </div>
            ) : (
               <div className="space-y-4">
               {projects.map(p => {
                 const isNeglected = !p.lastWorkedAt || p.lastWorkedAt < oneWeekAgo
                 
                 return (
                   <div key={p.id} className="group relative bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)] backdrop-blur-md overflow-hidden">
                     {isNeglected && <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full border-b border-l border-red-500/20" />}
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{p.name}</h3>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">{p.stage}</span>
                            {isNeglected && <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider">Warning</span>}
                          </div>
                          <p className="text-sm text-slate-400 max-w-lg truncate">{p.description || "No description initialized."}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-950/50 py-2 px-4 rounded-xl border border-slate-800 border-b-slate-800/50">
                          <div className="flex flex-col"><span className="uppercase text-[10px] tracking-widest text-slate-600 font-bold">Tasks</span><span className="font-medium text-slate-300">{p.tasks.length} pending</span></div>
                          <div className="w-px h-8 bg-slate-800"></div>
                          <div className="flex flex-col"><span className="uppercase text-[10px] tracking-widest text-slate-600 font-bold">Total Time</span><span className="font-medium text-slate-300">{(p.sessions.reduce((a, b) => a + (b.duration || 0), 0) / 60).toFixed(1)} hrs</span></div>
                        </div>
                     </div>
                   </div>
                 )
               })}
             </div>
            )}
          </div>

          {/* Right Column: Fast Actions & Timers */}
          <div className="space-y-6">
            
            {/* Rapid Initialization */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-indigo-400"/> Initialize Project</h2>
              <form action={createProject} className="space-y-4">
                <input required type="text" name="name" placeholder="Project Codename" className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-4 py-3 outline-none text-slate-200 transition-all placeholder:text-slate-600" />
                <div className="grid grid-cols-2 gap-2">
                  <label className="cursor-pointer">
                    <input type="radio" name="stage" value="idea" className="peer sr-only" defaultChecked />
                    <div className="text-center px-3 py-2 text-sm rounded-lg border border-slate-800 text-slate-500 peer-checked:bg-slate-800 peer-checked:text-indigo-400 peer-checked:border-indigo-500/50 transition-all">Idea</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="stage" value="building" className="peer sr-only" />
                    <div className="text-center px-3 py-2 text-sm rounded-lg border border-slate-800 text-slate-500 peer-checked:bg-slate-800 peer-checked:text-indigo-400 peer-checked:border-indigo-500/50 transition-all">Build</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="stage" value="testing" className="peer sr-only" />
                    <div className="text-center px-3 py-2 text-sm rounded-lg border border-slate-800 text-slate-500 peer-checked:bg-slate-800 peer-checked:text-indigo-400 peer-checked:border-indigo-500/50 transition-all">Test</div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="stage" value="production" className="peer sr-only" />
                    <div className="text-center px-3 py-2 text-sm rounded-lg border border-slate-800 text-slate-500 peer-checked:bg-slate-800 peer-checked:text-indigo-400 peer-checked:border-indigo-500/50 transition-all">Prod</div>
                  </label>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all">Boot Project</button>
              </form>
            </div>

            {/* Quick Time Log */}
            {projects.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-purple-400"/> Quick Log Session</h2>
                <form action={logSession} className="space-y-4">
                  <select name="projectId" className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-3 outline-none text-slate-200 transition-all">
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input required type="number" name="duration" placeholder="Duration in minutes (e.g. 60)" className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-3 outline-none text-slate-200 transition-all placeholder:text-slate-600" />
                  <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-lg transition-all border border-slate-700 hover:border-slate-500">Inject Time Matrix</button>
                </form>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className="absolute w-24 h-24 bg-slate-800/50 rounded-full -top-6 -right-6 blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-black text-slate-100">{value}</p>
    </div>
  )
}
