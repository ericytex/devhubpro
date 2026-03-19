export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Deep Work', value: '42.5h', badge: '+12%', badgeColor: 'bg-secondary/10 text-secondary' },
    { label: 'Focus Peak', value: '10:30', sub: 'AM Daily', subColor: 'text-on-surface-variant' },
    { label: 'Projects Shipped', value: '08', badge: 'This Month', badgeColor: 'bg-secondary/10 text-secondary' },
    { label: 'Avg. Flow State', value: '115m', badge: '−4%', badgeColor: 'bg-error/10 text-error' },
  ]

  const bars = [
    { day: 'MON', h: 40 }, { day: 'TUE', h: 65 }, { day: 'WED', h: 95, highlight: true },
    { day: 'THU', h: 50 }, { day: 'FRI', h: 75 }, { day: 'SAT', h: 20 }, { day: 'SUN', h: 15 },
  ]

  const allocation = [
    { name: 'Cloud Architecture', hrs: '18.5h', pct: 75, color: 'bg-primary' },
    { name: 'Marketing Strategy', hrs: '12.0h', pct: 45, color: 'bg-secondary' },
    { name: 'Investor Pitch', hrs: '8.2h', pct: 30, color: 'bg-tertiary' },
    { name: 'UI Design', hrs: '3.8h', pct: 15, color: 'bg-outline' },
  ]

  return (
    <div className="flex flex-col flex-1 bg-background">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 lg:px-10 h-[72px] gap-4">
        <h1 className="text-xl font-extrabold tracking-tight text-on-surface font-headline shrink-0 hidden sm:block">Performance Dashboard</h1>
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative hidden md:flex items-center bg-surface-container-low border border-outline-variant/10 rounded-full px-4 py-2 w-56 gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Search insights…" type="text"/>
          </div>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 px-6 lg:px-10 py-10 max-w-screen-xl w-full mx-auto space-y-8">

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-all hover:-translate-y-px">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">{s.label}</p>
              <div className="flex items-end flex-wrap gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-on-surface">{s.value}</span>
                {s.badge && <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${s.badgeColor}`}>{s.badge}</span>}
                {s.sub && <span className={`text-xs font-medium pb-0.5 ${s.subColor}`}>{s.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Chart row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-7 border border-outline-variant/10 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-on-surface tracking-tight">Weekly Focus Hours</h2>
                <p className="text-sm text-on-surface-variant mt-0.5">Tracking mental output across the week</p>
              </div>
              <div className="flex gap-1 bg-white rounded-full p-1 border border-outline-variant/20 self-start">
                <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">7 Days</button>
                <button className="px-4 py-1.5 rounded-full text-on-surface-variant text-xs font-semibold hover:bg-surface-container transition-all">30 Days</button>
              </div>
            </div>
            <div className="flex items-end justify-between gap-2 sm:gap-4 h-52 sm:h-64 mt-auto">
              {bars.map((b) => (
                <div key={b.day} className="flex flex-col items-center gap-2 flex-1 group h-full justify-end relative">
                  <div
                    className={`w-full rounded-t-lg transition-all cursor-pointer ${b.highlight ? 'bg-primary shadow-[0_0_16px_rgba(53,37,205,0.35)]' : 'bg-primary/20 hover:bg-primary/50'}`}
                    style={{ height: `${b.h}%` }}
                  ></div>
                  <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary transition-colors">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-7 border border-outline-variant/10 flex flex-col">
            <h2 className="text-lg font-bold text-on-surface tracking-tight mb-7">Project Allocation</h2>
            <div className="space-y-7 flex-1">
              {allocation.map((a) => (
                <div key={a.name}>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-on-surface truncate mr-2">{a.name}</span>
                    <span className="text-on-surface-variant shrink-0">{a.hrs}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${a.color} rounded-full`} style={{ width: `${a.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-7 w-full py-3 text-sm text-primary font-semibold bg-primary/5 hover:bg-primary/10 rounded-xl transition-all">
              Detailed Report
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Momentum */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-7 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface tracking-tight">Productivity Momentum</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1 rounded-full">On Track</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-7">
              Your deep work sessions are <strong className="text-on-surface font-semibold">15% longer</strong> than last week. You're in the <strong className="text-secondary font-semibold">85th percentile</strong> of active founders this month.
            </p>
            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                <span>Monthly Momentum</span><span className="text-secondary">85%</span>
              </div>
              <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed w-[85%] rounded-full shadow-[0_0_12px_rgba(0,108,73,0.25)]"></div>
              </div>
            </div>
          </div>

          {/* Insight card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-primary to-primary-container rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Zone of Genius</h3>
                <p className="text-sm text-indigo-100/80 leading-relaxed">
                  You produce <strong className="text-white">40% more output</strong> between 9–11:30 AM. Schedule your most complex work in this window.
                </p>
              </div>
              <button className="mt-7 bg-white text-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all self-start shadow">
                Optimize Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
