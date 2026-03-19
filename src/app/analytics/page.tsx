export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  return (
    <div className="w-full flex flex-col min-h-screen bg-background max-w-full relative">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl shadow-sm px-6 md:px-10 h-24 flex justify-between items-center border-b border-outline-variant/5">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-on-surface font-headline hidden sm:block">Performance Dashboard</h1>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center bg-surface-container-low px-4 py-2.5 rounded-full w-full max-w-xs transition-all focus-within:ring-2 focus-within:ring-primary/20 shadow-sm border border-outline-variant/10 hidden md:flex">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none ml-2" placeholder="Search insights..." type="text"/>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 bg-white p-2 rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 bg-white p-2 rounded-full shadow-sm border border-outline-variant/20">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center font-headline shadow-inner border border-primary/10">
              AR
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <section className="p-6 md:p-10 lg:p-14 max-w-[1400px] w-full mx-auto space-y-10 lg:space-y-14">
        
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { title: "Total Deep Work", value: "42.5h", trend: "+12%", trendBg: "bg-secondary/10", trendColor: "text-secondary" },
            { title: "Focus Peak", value: "10:30", label: "AM Daily", bg: "bg-surface-container", labelColor: "text-on-surface-variant text-sm font-semibold ml-2 pb-1" },
            { title: "Projects Shipped", value: "08", label: "This Month", bg: "bg-surface-container", labelColor: "text-secondary text-sm font-bold ml-2 pb-1 bg-secondary/10 px-2 py-0.5 rounded-md" },
            { title: "Avg. Flow State", value: "115m", trend: "-4%", trendBg: "bg-error/10", trendColor: "text-error" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 border border-outline-variant/10 hover:-translate-y-1">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-3">{stat.title}</p>
              <div className="flex items-end flex-wrap gap-2">
                <h3 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter font-headline">{stat.value}</h3>
                {stat.trend && (
                  <span className={`${stat.trendBg} ${stat.trendColor} px-2 py-1 rounded-lg text-sm font-bold flex items-center mb-1`}>
                    {stat.trend}
                  </span>
                )}
                {stat.label && (
                  <span className={stat.labelColor}>{stat.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bento Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Weekly Hours Chart */}
          <div className="col-span-1 lg:col-span-8 bg-surface-container-low p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col items-stretch h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10 shrink-0">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2 font-headline">Weekly Focus Hours</h2>
                <p className="text-on-surface-variant font-medium text-lg">Tracking your mental output across the week</p>
              </div>
              <div className="flex gap-2 bg-white p-1 rounded-full shadow-sm border border-outline-variant/10">
                 <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-bold shadow-md transition-all">7 Days</button>
                 <button className="px-5 py-2 rounded-full text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-all">30 Days</button>
              </div>
            </div>

            {/* Simplified Visual Chart */}
            <div className="flex items-end justify-between h-64 md:h-80 gap-3 md:gap-6 mt-auto">
              {[
                { day: 'MON', val: 40, theme: 'bg-primary/20 hover:bg-primary' },
                { day: 'TUE', val: 65, theme: 'bg-primary/20 hover:bg-primary' },
                { day: 'WED', val: 95, theme: 'bg-gradient-to-t from-primary to-primary-container shadow-[0_0_20px_rgba(53,37,205,0.4)]' },
                { day: 'THU', val: 50, theme: 'bg-primary/20 hover:bg-primary' },
                { day: 'FRI', val: 75, theme: 'bg-primary/20 hover:bg-primary' },
                { day: 'SAT', val: 20, theme: 'bg-primary/10 hover:bg-primary/30' },
                { day: 'SUN', val: 15, theme: 'bg-primary/10 hover:bg-primary/30' },
              ].map((c) => (
                <div key={c.day} className="flex flex-col items-center flex-1 gap-4 group h-full justify-end relative">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-on-surface text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xl tabular-nums hidden md:block">
                    {c.val / 10} hrs
                  </div>
                  <div className={`w-full rounded-t-xl transition-all cursor-pointer ${c.theme}`} style={{ height: `${c.val}%` }}></div>
                  <span className="text-xs md:text-sm font-bold text-on-surface-variant group-hover:text-primary transition-colors">{c.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Allocation Bars */}
          <div className="col-span-1 lg:col-span-4 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-outline-variant/10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-10 font-headline">Project Allocation</h2>
              <div className="space-y-10">
                {[
                  { name: "Cloud Architecture", hrs: "18.5h", p: "75%", c: "bg-primary" },
                  { name: "Marketing Strategy", hrs: "12.0h", p: "45%", c: "bg-secondary" },
                  { name: "Investor Pitch Deck", hrs: "8.2h", p: "30%", c: "bg-tertiary" },
                  { name: "UI Design Iterations", hrs: "3.8h", p: "15%", c: "bg-outline" },
                ].map((alloc) => (
                  <div key={alloc.name}>
                    <div className="flex justify-between text-sm md:text-base mb-3 font-semibold">
                      <span className="text-on-surface">{alloc.name}</span>
                      <span className="text-on-surface-variant tabular-nums">{alloc.hrs}</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${alloc.c} rounded-full transition-all duration-1000 ease-out`} style={{ width: alloc.p }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-12 w-full py-4 text-primary font-bold bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all font-headline">
               Generate Detailed Report
            </button>
          </div>
        </div>

        {/* Bottom Row: Productivity Momentum */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Productivity "Momentum" Progress */}
          <div className="col-span-1 lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold text-on-surface font-headline">Productivity Momentum</h3>
              <span className="text-secondary font-bold text-xs bg-secondary/10 px-4 py-2 rounded-full uppercase tracking-widest">On Track</span>
            </div>
            
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10 font-medium">
                Your deep work sessions are <strong className="text-on-surface">15% longer</strong> than last week. You are currently in the <strong className="text-secondary font-bold">85th percentile</strong> of active founders taking on similar sprint cycles this month.
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-xs md:text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                <span>Monthly Momentum Sprint</span>
                <span className="text-secondary">85% Processed</span>
              </div>
              <div className="h-5 w-full bg-surface-container rounded-full overflow-hidden p-[2px]">
                <div className="h-full bg-gradient-to-r from-secondary to-secondary-fixed w-[85%] rounded-full shadow-[0_0_15px_rgba(0,108,73,0.3)] transition-all duration-1000 ease-in-out relative">
                   <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Card */}
          <div className="col-span-1 lg:col-span-5 bg-gradient-to-br from-indigo-900 via-primary to-primary-container p-8 md:p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-500"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/20 backdrop-blur-md">
                   <span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>tips_and_updates</span>
                   <span className="text-xs font-bold uppercase tracking-widest">AI Insight Module</span>
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tighter font-headline text-white">Zone of Genius</h3>
                <p className="text-indigo-100 font-medium text-lg leading-relaxed">
                   Data confirms you achieve 40% more output between <strong>9:00 AM and 11:30 AM</strong>. Consider auto-scheduling your complex architecture tasks strictly within this hyper-focus window.
                </p>
              </div>
              <button className="mt-10 bg-white text-primary px-8 py-4 rounded-full font-extrabold text-sm hover:scale-[1.02] hover:shadow-lg active:scale-95 transition-all shadow-md self-start font-headline w-full sm:w-auto text-center">
                 Apply Optimization
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
